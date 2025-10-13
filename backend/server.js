import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import { connectDB } from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Welcome to PaperHunt");
})

// Replace with your email for Unpaywall API
const EMAIL = "arihantsrivastava71011@gmail.com";

// API endpoint: /search?q=keyword
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
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

    res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


app.listen(PORT, () => {
    // connectDB();
    console.log(`Server is running on port ${PORT}`);
})