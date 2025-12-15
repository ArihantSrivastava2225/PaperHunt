import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { client } from "../config/redis.js";
import dotenv from "dotenv";

dotenv.config();

const EMAIL = "arihantsrivastava71011@gmail.com";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractTextFromPDF = async (pdfUrl) => {
    try {
        let pdf = await import("pdf-parse");
        // Handle CJS/ESM interop
        if (pdf.default) pdf = pdf.default;

        if (typeof pdf !== 'function') {
            console.error("pdf-parse import failed:", pdf);
            return null;
        }

        const response = await fetch(pdfUrl);
        const buffer = await response.arrayBuffer();
        const data = await pdf(Buffer.from(buffer));
        return data.text.slice(0, 6000); // Limit to first 6000 characters
    } catch (error) {
        console.error("Error extracting PDF text: ", error);
        return null;
    }
};

export const searchPapers = async (req, res) => {
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

        if (openAlexData.results) {
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
        }

        res.status(200).json({ results: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const summarizePaper = async (req, res) => {
    try {
        const { title, authors, pdfLink } = req.body;
        if (!title) {
            return res.status(400).json({ error: "Title required" });
        }

        const cacheKey = `summary:${title}`;
        try {
            const cached = await client.get(cacheKey);
            if (cached) {
                return res.status(200).json({ summary: cached, cached: true });
            }
        } catch (redisError) {
            console.error("Redis error:", redisError);
            // Continue without cache
        }

        let text = "";
        if (pdfLink) {
            text = await extractTextFromPDF(pdfLink);
        }
        if (!text) {
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
        try {
            await client.set(cacheKey, summary, { EX: 86400 });
        } catch (redisError) {
            console.error("Redis set error:", redisError);
        }

        res.status(200).json({ summary, cached: false });
    } catch (error) {
        console.error("Error in summary API: ", error);
        if (error.status === 503) {
            return res.status(503).json({ error: "AI Service Overloaded. Please try again later." });
        }
        res.status(500).json({ error: "Failed to generate summary" });
    }
};
