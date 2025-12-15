# Software Requirements Specification (SRS)
**Project Name:** PaperHunt  
**Version:** 1.0  
**Date:** 2025-12-10

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the software requirements for **PaperHunt**, a web-based platform designed to democratize access to academic research. The platform allows users to search for research papers, generate AI-powered summaries, save papers to a personal library, and discover research opportunities.

### 1.2 Scope
**PaperHunt** is a full-stack web application that serves as a hub for students, researchers, and academicians. It integrates multiple external APIs (OpenAlex, Unpaywall, NewsAPI) and Generative AI (Google Gemini) to provide comprehensive insights.
The system includes:
- A search engine for research papers.
- An AI summarization tool for quick paper analysis.
- A user dashboard for managing saved papers.
- A portal for posting and finding research internships/collaborations.
- A news feed for the latest academic updates.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS**: Software Requirements Specification
- **LLM**: Large Language Model (e.g., Google Gemini)
- **API**: Application Programming Interface
- **JWT**: JSON Web Token (used for secure authentication)
- **OA**: Open Access (freely available research papers)
- **DOI**: Digital Object Identifier

---

## 2. Overall Description

### 2.1 Product Perspective
PaperHunt functions as a standalone web application. It relies on a client-server architecture:
- **Frontend**: React-based Single Page Application (SPA).
- **Backend**: Node.js/Express REST API.
- **Database**: MongoDB for persistent storage (users, libraries, posts).
- **Cache**: Redis for temporary storage of AI summaries to reduce API costs and latency.

### 2.2 Product Functions
- **User Authentication**: Secure signup/signin using email and password.
- **Paper Search**: Query external databases to find papers by keywords, title, or authors.
- **Content Access**: Provide direct links to PDF versions of papers when available.
- **Intelligent Summarization**: Generate structured summaries (intro, methods, findings) using AI.
- **Library Management**: Add, update, delete, and categorize papers in a personal collection.
- **Opportunity Board**: Users can browse and post academic research positions.
- **News Aggragator**: Display real-time news from reputable scientific sources.

### 2.3 User Classes and Characteristics
- **Student/Researcher**: Primary users. They search for papers, save them, and look for opportunities.
- **Professor/Recruiter**: Users who may primarily use the platform to post research opportunities and recruit students.
- **Administrator**: (Implicit) Manages system health and content moderation (future scope).

### 2.4 Operating Environment
- **Client**: Modern web browser (Chrome, Firefox, Edge, Safari).
- **Server**: Node.js runtime environment (v18+).
- **Database**: MongoDB Atlas (Cloud) or local instance.
- **Cache Server**: Redis instance.

---

## 3. Functional Requirements

### 3.1 Authentication & User Management
- **FR-01**: User Signup - The system shall allow users to create an account with Name, Email, and Password.
- **FR-02**: User Login - The system shall authenticate users and issue a secure HTTP-only JWT.
- **FR-03**: User Logout - The system shall provide a secure logout mechanism that clears the session.
- **FR-04**: Session Validation - The system shall persist user login state across page reloads.

### 3.2 Research Paper Search
- **FR-05**: Search Interface - The system shall provide a search bar to input keywords.
- **FR-06**: Fetch Results - The system shall query OpenAlex API to fetch relevant papers.
- **FR-07**: OA Check - The system shall check Unpaywall API to determine if a paper is Open Access and provide the PDF link.

### 3.3 AI Summarization
- **FR-08**: Generate Summary - The system shall send paper content/metadata to Google Gemini API to generate a summary.
- **FR-09**: Structured Output - The summary shall be formatted into: Introduction, Key Ideas, Findings, and Contribution.
- **FR-10**: Caching - The system shall store generated summaries in Redis for 24 hours to prevent redundant processing.

### 3.4 User Library
- **FR-11**: Add to Library - Users shall be able to save a paper with custom bookmarks/categories to their database.
- **FR-12**: View Library - The system shall display a list of all saved papers for the logged-in user.
- **FR-13**: Search Library - Users shall be able to filter their saved papers by title or author.
- **FR-14**: Remove Paper - Users shall be able to delete papers from their library.

### 3.5 Research Opportunities
- **FR-15**: View Opportunities - The system shall list available research positions sorted by date.
- **FR-16**: Post Opportunity - Authenticated users shall be able to create a listing requiring Title, Description, Skills, Duration, and Contact Info.

### 3.6 Academic News
- **FR-17**: Fetch News - The system shall aggregate news from defined RSS feeds (Nature, ScienceDaily) or fallback to NewsAPI/Static data if feeds fail.

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **Response Time**: Search results should load within 2 seconds. AI summaries should generate within 5-10 seconds.
- **Concurrency**: The system should handle concurrent user requests efficiently using non-blocking I/O.

### 4.2 Security
- **Data Privacy**: Passwords must be hashed using `bcrypt` before storage.
- **API Security**: All backend routes (except auth/public) must be protected via middleware verifying the JWT.
- **Injection Protection**: Use parameterized queries/ORM methods (Mongoose) to prevent NoSQL injection.

### 4.3 Reliability
- **Availability**: The system should be available 99% of the time.
- **Error Handling**: Graceful error messages should be displayed to the user if external APIs (e.g., OpenAlex) are down.

### 4.4 Maintainability
- **Code Structure**: The codebase shall follow MVC (Model-View-Controller) architecture on the backend and Component-based architecture on the frontend.
- **Documentation**: Code should be commented, and API endpoints documented.

---

## 5. System Interfaces

### 5.1 External APIs
- **OpenAlex API**: For retrieving bibliographic data of research papers.
- **Unpaywall API**: For checking Open Access status and PDF links.
- **Google Generative AI (Gemini)**: For natural language processing and text summarization.
- **NewsAPI / RSS**: For fetching latest scientific articles.

### 5.2 Database Schema (Conceptual)
- **User**: `_id`, `fullName`, `email`, `password`, `papers[]`
- **Research**: `_id`, `title`, `description`, `skillsRequired[]`, `createdBy`, `createdAt`
