import { GoogleGenerativeAI } from "@google/generative-ai";
import RSSParser from 'rss-parser';
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parser = new RSSParser({
    customFields: {
        item: ['description', 'summary', 'content:encoded'],
    },
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
    },
});

const JOB_RSS_FEEDS = [
    "https://euraxess.ec.europa.eu/job-feed", // Verified working
    "https://www.academickeys.com/rss/2555.xml", // AcademicKeys (General Sciences) - Usually reliable
];

// Fallback top labs if RSS yields nothing
const FALLBACK_TOP_LABS = [
    {
        title: "DeepMind Research Opportunities",
        description: "Explore open roles at Google DeepMind in London, Mountain View, and Montreal.",
        link: "https://deepmind.google/discover/careers/",
        source: "DeepMind",
    },
    {
        title: "OpenAI Residency",
        description: "Apply for the OpenAI Residency program to work on bleeding-edge AI models.",
        link: "https://openai.com/careers",
        source: "OpenAI",
    },
    {
        title: "CERN Fellowship Program",
        description: "Opportunities for physicists, engineers, and technicians at CERN.",
        link: "https://careers.cern/",
        source: "CERN",
    }
];

export const scoutOpportunities = async (req, res) => {
    const { topic, role, specificLocation } = req.body;

    if (!topic) {
        return res.status(400).json({ success: false, message: "Topic is required" });
    }

    try {
        console.log(`🔍 Scouting opportunities for: ${topic} (${role || "any role"})`);

        let feedItems = [];

        // 1. Fetch RSS Feeds
        for (const feed of JOB_RSS_FEEDS) {
            try {
                const data = await parser.parseURL(feed);
                if (data.items) {
                    // Basic pre-filter to reduce token usage
                    const relevant = data.items;
                    feedItems.push(...relevant.map(item => ({
                        title: item.title,
                        description: item.contentSnippet || item.content || "",
                        link: item.link,
                        pubDate: item.pubDate,
                        source: data.title
                    })).slice(0, 15)); // Take top 15 from each to avoid huge prompt
                }
            } catch (err) {
                console.warn(`⚠️ Failed to parse Scout feed ${feed}: ${err.message}`);
            }
        }

        // 2. Prepare Context for Gemini
        const context = feedItems.length > 0 ?
            JSON.stringify(feedItems) :
            "No real-time RSS data available. Please generate high-quality recommendations based on known top institutions.";

        const prompt = `
        Role: You are an expert Academic Career Scout.
        Task: Find relevant research opportunities, internships, or job openings for a user interested in: "${topic}".
        User Preference: Role = "${role || "Any"}", Location = "${specificLocation || "Global"}".
        
        Source Data (RSS feeds):
        ${context}

        Instructions:
        1. Analyze the provided RSS items. Select the most relevant matches for the user's topic.
        2. If RSS items are relevant, extract: Title, Organization/Lab (infer from title/desc), Location (if available), Summary.
        3. CRITICAL FOR LINKS: 
           - For **RSS Items**: You MUST use the **EXACT link** provided in the source data. DO NOT modify it.
           - For **Generative/Knowledge Leads**: If you generate leads from your own knowledge (when RSS is empty or irrelevant), use the **OFFICIAL MAIN CAREERS PAGE URL** (e.g., "https://careers.google.com" or "https://www.ibm.com/employment"). **DO NOT** invent specific job posting URLs with IDs (like /jobs/12345), as they will be 404s.

        4. Return ONLY a JSON object with this structure:
        {
            "results": [
                {
                    "title": "Job/Role Title",
                    "organization": "Institution Name",
                    "location": "City/Country or 'Remote'",
                    "description": "2-sentence summary of the opportunity",
                    "link": "Application URL",
                    "isRealTime": true/false (true if from RSS, false if AI knowledge)
                }
            ]
        }
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Cleanup JSON markdown
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonResponse = JSON.parse(cleaned);

        res.status(200).json({ success: true, ...jsonResponse });

    } catch (error) {
        console.error("Explore Scout Error:", error);
        // Fallback
        res.status(200).json({
            success: true,
            results: FALLBACK_TOP_LABS.map(l => ({ ...l, organization: l.source, location: "Global", isRealTime: false }))
        });
    }
};
