import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";
import { createClient } from 'redis';
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { connectDB } from "./config/db";

dotenv.config();

const app = express();
const client = createClient({
    username: 'default',
    password: process.env.REDIS_DB_PASSWORD,
    socket: {
        host: 'redis-13811.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 13811
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const extractTextFromPDF = async(pdfUrl) => {
  try{
    const pdf = (await import("pdf-parse")).default; // ✅ dynamic import
    const response = await fetch(pdfUrl);
    const buffer = await response.arrayBuffer();
    const data = await pdf(Buffer.from(buffer));
    return data.text.slice(0, 6000); // Limit to first 6000 characters
  }catch(error){
    console.error("Error extracting PDF text: ", error);
    return null;
  }
}

app.get('/', (req, res) => {
    res.send("Welcome to PaperHunt");
})

// Replace with your email for Unpaywall API
const EMAIL = "arihantsrivastava71011@gmail.com";

// API endpoint: /search?q=keyword
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Query missing" });

    // 1. Search OpenAlex
    const openAlexUrl = `https://api.openalex.org/works?search=${encodeURIComponent(
      query
    )}&per_page=5`;
    const openAlexResp = await fetch(openAlexUrl);
    const openAlexData = await openAlexResp.json();

    // 2. Prepare results
    const results = [];

    for (const paper of openAlexData.results) {
      const doi = paper.doi;
      let pdfLink = null;

      if (doi) {
        // 3. Check Unpaywall for OA PDF
        const unpaywallUrl = `https://api.unpaywall.org/v2/${doi}?email=${EMAIL}`;
        const unpaywallResp = await fetch(unpaywallUrl);
        const unpaywallData = await unpaywallResp.json();
        pdfLink = unpaywallData?.best_oa_location?.url_for_pdf || null;
      }

      results.push({
        title: paper.display_name,
        doi: paper.doi,
        authors: paper.authorships.map((a) => a.author.display_name),
        pdfLink,
        isOpenAccess: paper.is_oa,
      });
    }

    res.status(200).json({ results: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/summary", async(req, res) => {
  try{
    const { title, authors, pdfLink } = req.body;
    if(!title){
      return res.status(400).json({ error: "Title required"});
    }

    const cacheKey = `summary:${title}`;
    const cached = await client.get(cacheKey);
    if(cached){
      return res.status(200).json({ summary: cached, cached: true});
    }

    let text = "";
    if(pdfLink){
      text = await extractTextFromPDF(pdfLink);
    }
    if(!text){
      text = title;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an academic summarizer. Summarize the following research paper in a **structured, concise format** with clearly labeled sections. 
Each section should be 2–3 short paragraphs max. Maintain academic tone and clarity.

Required format:

Concise Introduction:
- Briefly introduce what the paper is about and its purpose.

Key Ideas:
- Outline the main methods, principles, or theoretical foundations.

Findings:
- Summarize the main results, experiments, or implementations.

Contribution to the Field:
- Explain how this paper advances research or offers practical significance.

Title: ${title}
by : ${authors.join(", ")}

Extracted Text / Content:
${text}
`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    //Cache summary for 24 hours
    await client.set(cacheKey, summary, "EX", 86400);

    res.status(200).json({ summary, cached: false});
  }catch(error){
    console.error("Error in summary API: ", error);
    res.status(500).json({ error: "Failed to generate summary"});
  }
})

app.listen(PORT, () => {
    // connectDB();
    console.log(`Server is running on port ${PORT}`);
})