# PaperHunt

PaperHunt is a comprehensive platform designed to bridge the gap between academic research and students/researchers. It provides a seamless experience for searching research papers, accessing AI-powered summaries, finding research opportunities, and staying updated with the latest academic news.

## 🚀 Features

### 🔍 **Research Paper Discovery**
- **Smart Search**: Integrated with **OpenAlex** to search for millions of research papers.
- **Access to PDFs**: Automatically finds open-access PDF links using **Unpaywall**.
- **AI Summarization**: Uses **Google Gemini AI** to generate concise, structured summaries of research papers (Introduction, Key Ideas, Findings, Contribution).

### 📚 **Personal Library**
- **Save & Organize**: Users can save papers to their personal library.
- **Manage**: Update details, categorize, and delete papers.
- **Search Library**: Quickly find saved papers within your collection.

### 🤝 **Research Opportunities**
- **Find Opportunities**: Browse listings for research collaborations, internships, and projects.
- **Post Opportunities**: Users/Professors can post new research opportunities with required skills, duration, and contact details.

### 📰 **Academic News Feed**
- **Latest Updates**: Aggregates news from top sources like **Nature**, **ScienceDaily**, and **ScienceDirect via RSS feeds**.
- **Real-time Integration**: Keeps users informed about the latest scientific breakthroughs.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Mongoose ODM)
- **Caching**: [Redis](https://redis.io/) (for caching summaries)
- **Authentication**: JWT (JSON Web Tokens) with HttpOnly cookies
- **AI Integration**: Google Generative AI (Gemini) SDK
- **External APIs**: OpenAlex, Unpaywall, NewsAPI / RSS Feeds

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas Account (or local MongoDB)
- Redis Server (or Redis Cloud)
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/PaperHunt.git
cd PaperHunt
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
REDIS_URL=your_redis_url
REDIS_DB_PASSWORD=your_redis_password
NEWS_API_KEY=your_news_api_key
NODE_ENV=development
```

Start the backend server:
```bash
npm start
# OR for development with nodemon
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../nebula-hunt-ui
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:8080` (or the port shown in your terminal).

---

## 📖 Usage Guides

### **For Researchers/Students**
1. **Sign Up/Login**: Create an account to access personalized features.
2. **Search**: Use the search bar to find papers by keywords.
3. **Summarize**: Click on a paper to view details and generate an AI summary.
4. **Library**: Save interesting papers to your library for later reading.
5. **Opportunities**: Check the "Opportunities" section to apply for research roles.

### **For Professors/Labs**
1. **Post Opportunities**: Log in and navigate to the opportunities section to post new openings for students.

---

## 🛡️ Security
- **Authentication**: Secure password hashing with bcrypt and session management via JWT.
- **Data Protection**: Sensitive routes are protected ensuring only authorized access to user libraries and administrative actions.

## 📄 License
This project is licensed under the ISC License.
