import Research from "../models/research.model.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const RSS_FEEDS = [
    "https://www.nature.com/nature/articles?type=research&format=rss",
    "https://www.sciencedaily.com/rss/top/science.xml",
    "https://rss.sciencedirect.com/publication/science",
];

const FALLBACK_NEWS = [
    {
        title: "AI Models Boost Climate Forecast Accuracy",
        link: "https://example.com/ai-climate-forecast",
        description: "Recent studies show deep learning models improving climate predictions by up to 40%.",
        pubDate: "2025-10-25",
        source: "Fallback Research News",
    },
    {
        title: "Quantum Computing Advances Drug Discovery",
        link: "https://example.com/quantum-drug-discovery",
        description: "Researchers use quantum simulations to accelerate new molecule designs.",
        pubDate: "2025-10-22",
        source: "Fallback Research News",
    },
    {
        title: "New Material Offers 10x Battery Efficiency",
        link: "https://example.com/new-battery-material",
        description: "A novel graphene-titanium compound shows promise for high-density energy storage.",
        pubDate: "2025-10-20",
        source: "Fallback Research News",
    },
];

export const addResearchOpportunity = async (req, res) => {
    const { title, description, skillsRequired, membersNeeded, duration, status, reachoutemail, stipend } = req.body;
    if (!title || !description || !skillsRequired || !membersNeeded || !duration || !status || !reachoutemail) {
        return res.status(400).json({ success: false, message: "All fields are required " });
    }

    try {
        const opp = {
            title,
            description,
            skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [skillsRequired],
            membersNeeded,
            membersJoined: [],
            duration,
            status: status || 'open',
            reachoutemail,
            stipend,
            createdBy: req.user.id,
        };
        await Research.create(opp);

        return res.status(201).json({ success: true, message: "Opportunity added successfully !", research: opp });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getResearchOpportunities = async (req, res) => {
    try {
        const results = await Research.find({}).sort({ createdAt: -1 }); //to get all research opportunites available 
        return res.status(200).json({ success: true, results: results, message: "opportunites fetched!" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getNews = async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY; // get your key from newsapi.org
        const url = `https://newsapi.org/v2/everything?q=research+science+technology&language=en&pageSize=6&apiKey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.articles) return res.status(404).json({ success: false, message: "No news found" });

        const formatted = data.articles.map(a => ({
            title: a.title,
            description: a.description,
            image: a.urlToImage,
            url: a.url,
            source: a.source.name,
            publishedAt: a.publishedAt,
        }));

        return res.status(200).json({ success: true, news: formatted });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Server error fetching news" });
    }
};

export const getAcademicResearchNews = async (req, res) => {
    try {
        const allFeeds = [];

        for (const feed of RSS_FEEDS) {
            try {
                const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`;
                const response = await fetch(proxyUrl);

                if (!response.ok) {
                    console.warn(`⚠️ Failed to fetch RSS feed: ${feed} (status ${response.status})`);
                    continue;
                }

                const data = await response.json();

                if (data.items && data.items.length > 0) {
                    const simplified = data.items.slice(0, 5).map((item) => ({
                        title: item.title,
                        link: item.link,
                        description: item.description,
                        pubDate: item.pubDate,
                        source: data.feed?.title || "Research Feed",
                    }));

                    allFeeds.push(...simplified);
                }
            } catch (err) {
                console.warn(`⚠️ RSS feed error for ${feed}:`, err.message);
            }
        }

        if (allFeeds.length === 0) {
            console.log("⚠️ All RSS feeds failed — returning fallback news.");
            return res.status(200).json({
                success: true,
                source: "fallback",
                results: FALLBACK_NEWS,
            });
        }

        return res.status(200).json({
            success: true,
            source: "rss",
            results: allFeeds,
        });
    } catch (error) {
        console.error("❌ Error fetching RSS feeds:", error);
        return res.status(200).json({
            success: true,
            source: "fallback",
            results: FALLBACK_NEWS,
        });
    }
};
