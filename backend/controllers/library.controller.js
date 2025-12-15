import User from "../models/user.model.js";
import mongoose from "mongoose";

export const addPaperToLibrary = async (req, res) => {
    const libPaper = req.body;
    if (!libPaper.title || !libPaper.category || !libPaper.bookmark) {
        return res.status(400).json({ success: false, error: "All fields are required" });
    }
    if (!libPaper.doi) libPaper.doi = "N/A";
    if (!libPaper.pdfLink) libPaper.pdfLink = "N/A";
    if (!libPaper.authors) libPaper.authors = [];

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found. Need to login." });
        }
        user.papers.push(libPaper);
        await user.save();
        res.status(200).json({ success: true, message: "Paper added to library successfully" });
    } catch (error) {
        console.error("Error adding paper to library: ", error);
        res.status(500).json({ success: false, error: "Failed to add paper to library" });
    }
};

export const getLibraryPapers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found. Need to login." });
        }
        res.status(200).json({ success: true, papers: user.papers });
    } catch (error) {
        console.error("Error fetching user papers: ", error);
        res.status(500).json({ success: false, error: "Failed to fetch user papers" });
    }
};

export const updatePaper = async (req, res) => {
    const { pid } = req.params;
    const { title, category, bookmark } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.user.id) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ success: false, message: "Invalid user ID or paper ID" });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const paper = user.papers.id(pid);
        paper.title = title;
        paper.category = category;
        paper.bookmark = bookmark;
        if (req.body.authors) paper.authors = req.body.authors; // Optional: Allow updating authors
        await user.save();

        res.status(200).json({ success: true, message: "Details updated" })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deletePaper = async (req, res) => {
    const { pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(req.user.id) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ success: false, message: "Invalid user ID or paper ID" });
    }

    try {
        const user = await User.findById(req.user.id);
        const paper = user.papers.id(pid);
        const originalLength = user.papers.length;

        user.papers = user.papers.filter(p => p._id.toString() !== pid);

        if (user.papers.length === originalLength) {
            return res.status(404).json({ success: false, message: "Paper not found" });
        }
        await user.save();

        res.status(200).json({ success: true, message: "Paper deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
        console.error(error.message);
    }
};

export const searchLibrary = async (req, res) => {
    const { searchTerm } = req.body;
    if (!searchTerm) {
        return res.status(400).json({ success: false, message: "Search term is required" });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        const searchResults = user.papers.filter(paper => paper.title.toLowerCase().includes(searchTerm.toLowerCase()) || paper.authors.toLowerCase().includes(searchTerm.toLowerCase()));
        res.status(200).json({ success: true, results: searchResults });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
        console.error(error.message);
    }
};

export const closeLibModal = (req, res) => {
    try {
        res.status(200).json({ success: true, message: "Modal closed" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
