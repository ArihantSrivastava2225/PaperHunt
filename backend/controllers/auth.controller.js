import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV;
const COOKIE_SECURE = process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : NODE_ENV === "production";
const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE || "strict";
const COOKIE_MAX_AGE = 7 * 60 * 60 * 1000; // 7 hours

const authCookieOptions = {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
    maxAge: COOKIE_MAX_AGE,
};

const clearCookieOptions = {
    httpOnly: true,
    sameSite: COOKIE_SAME_SITE,
    secure: COOKIE_SECURE,
};

export const signup = async (req, res) => {
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
        res.cookie("token", token, authCookieOptions);

        res.status(201).json({
            success: true,
            message: "Signup successful",
            user: { id: newUser._id, fullName: newUser.fullName, email: newUser.email },
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const signin = async (req, res) => {
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
        res.cookie("token", token, authCookieOptions);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: { id: user._id, fullName: user.fullName, email: user.email },
        });
    } catch (err) {
        console.error("Signin error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const signout = async (req, res) => {
    try {
        res.clearCookie("token", clearCookieOptions);
        res.status(200).json({ message: "Signout successful" });
    } catch (err) {
        console.error("Signout error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const validateToken = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(200).json({ loggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ loggedIn: true, user: decoded });
    } catch (error) {
        console.error("Token validation error:", error);
        res.status(500).json({ loggedIn: false, message: "Server Error" });
    }
};
