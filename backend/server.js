import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import { createClient } from 'redis';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB } from "./config/db.js";
import User from "./models/user.model.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

//Setting up Redis Client
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
// -----------------------

//LLM for AI Analysis we are going to use
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:8080",   // your frontend origin
  credentials: true,                 // 👈 allows cookies
}));

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

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if(!token){
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try{
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

app.get('/', (req, res) => {
    res.send("Welcome to PaperHunt");
})

// Replace with your email for Unpaywall API
const EMAIL = "arihantsrivastava71011@gmail.com";

app.post("/api/auth/signup", async(req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "7h",
    });

    // ✅ Store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 60 * 60 * 1000, // 7 hours
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: { id: newUser._id, fullName: newUser.fullName, email: newUser.email },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
})

app.post("/api/auth/signin", async (req, res) => {
  try {
    // 🧩 Check if user already has a valid token
    const existingToken = req.cookies.token;
    if (existingToken) {
      try {
        const decoded = jwt.verify(existingToken, JWT_SECRET);
        return res.status(200).json({
          success: true,
          message: "User already logged in",
          user: { id: decoded.id },
        });
      } catch (err) {
        // token invalid or expired, so continue to signin
      }
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    // 🪪 Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7h" });

    // 🍪 Set token in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 60 * 60 * 1000, // 7 hours
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/auth/signout", verifyToken, (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Signout successful" });
  } catch (err) {
    console.error("Signout error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/auth/validate", (req, res) => {
  const token = req.cookies.token;
  if(!token){
    return res.status(200).json({ loggedIn: false });
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ loggedIn: true, user: decoded });
  }catch(error){
    console.error("Token validation error:", error);
    res.status(500).json({ loggedIn: false, message: "Server Error" });
  }
})

// API endpoint: /search?q=keyword
app.get("/api/search", verifyToken, async (req, res) => {
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

app.post("/api/summary", verifyToken, async(req, res) => {
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

app.post('/api/user/library/add', verifyToken, async(req, res) => {
  const libPaper = req.body;
  if(!libPaper.title || !libPaper.category || !libPaper.bookmark){  //as user only enters the title, category and the bookmark for the paper
    return res.status(400).json({ success: false, error: "All fields are required"});
  }
  if(!libPaper.doi) libPaper.doi = "N/A";
  if(!libPaper.pdfLink) libPaper.pdfLink = "N/A";

  try{
    const user = await User.findById(req.user.id);
    if(!user){
      return res.status(404).json({ success: false, error: "User not found. Need to login."});
    }
    user.papers.push(libPaper);
    await user.save();
    res.status(200).json({ success: true, message: "Paper added to library successfully"});
  }catch(error){
    console.error("Error adding paper to library: ", error);
    res.status(500).json({ success: false, error: "Failed to add paper to library"});
  }
})

app.get('/api/user/library/papers', verifyToken, async(req, res) => {
  try{
    const user = await User.findById(req.user.id);
    if(!user){
      return res.status(404).json({ success: false, error: "User not found. Need to login."});
    }
    res.status(200).json({ success: true, papers: user.papers });
  }catch(error){
    console.error("Error fetching user papers: ", error);
    res.status(500).json({ success: false, error: "Failed to fetch user papers"});
  }
})

app.put('/api/user/library/paper/:pid/update', verifyToken, async(req, res) => {
  const { pid } = req.params;
  const { title, category, bookmark } = req.body;

  if(!mongoose.Types.ObjectId.isValid(req.user.id) || !mongoose.Types.ObjectId.isValid(pid)){
    return res.status(400).json({ success: false, message: "Invalid user ID or paper ID" });
  }

  try{
    const user = await User.findById(req.user.id);
    if(!user){
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const paper = user.papers.id(pid);
    paper.title = title;
    paper.category = category;
    paper.bookmark = bookmark;
    await user.save();

    res.status(200).json({ success: true, message: "Details updated"})
  }catch(error){
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error"});
  }
})

app.delete('/api/user/library/paper/:pid/delete', verifyToken, async(req, res) => {
  const { pid } = req.params;

  if(!mongoose.Types.ObjectId.isValid(req.user.id) || !mongoose.Types.ObjectId.isValid(pid)){
    return res.status(400).json({ success: false, message: "Invalid user ID or paper ID" });
  }

  try{
    const user = await User.findById(req.user.id);
    const paper = user.papers.id(pid);
    const originalLength = user.papers.length;

    user.papers = user.papers.filter(p => p._id.toString() !== pid);

    if(user.papers.length === originalLength){
      return res.status(404).json({ success: false, message: "Paper not found"});
    }
    await user.save();

    res.status(200).json({ success: true, message: "Paper deleted successfully"});
  }catch(error){
    res.status(500).json({ success: false, message: "Server Error"});
    console.error(error.message);
  }
})

app.get('/api/user/library/search', verifyToken, async(req, res) => {
  const { searchTerm } = req.body;
  if(!searchTerm){
    return res.status(400).json({ success: false, message: "Search term is required" });
  }

  try{
    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).json({ success: false, message: "User not found" });
    const searchResults = user.papers.filter(paper => paper.title.toLowerCase().includes(searchTerm.toLowerCase()) || paper.authors.toLowerCase().includes(searchTerm.toLowerCase()));
    res.status(200).json({ success: true, results: searchResults }); 
  }catch(error){
    res.status(500).json({ success: false, message: "Server Error"});
    console.error(error.message);
  }
})

app.get('/api/user/libmodal/close', (req, res) => {
  // This is a dummy endpoint to handle modal close requests
    // It doesn't perform any action but is used to trigger the onClose function in the frontend
    try {
        res.status(200).json({ success: true, message: "Modal closed" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
})

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})