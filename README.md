# 📊 Conversational BI Dashboard
**A modern, AI-powered Business Intelligence tool built for the Geeks for Geeks Hackathon.**

This dashboard allows users to interact with their data using natural language. By integrating Google's Gemini AI, complex database queries are transformed into simple conversational prompts, generating real-time charts, insights, and analytics.

## 🚀 Live Demo
[Click here to view the live dashboard!](https://krishnendu007u.github.io/Conversational-Bi-Dashboard/)

## 🛠️ Tech Stack
* **Frontend:** React, Vite, Tailwind CSS (or your CSS framework)
* **Backend:** Python, FastAPI
* **Database:** PostgreSQL (with SQLite local fallback)
* **AI Integration:** Google Gemini Pro API

## ✨ Key Features
* **Natural Language to SQL:** Chat with your data without knowing complex query languages.
* **Dynamic Chart Rendering:** Automatically visualizes data based on user prompts.
* **Responsive UI:** Clean, modern interface designed for ease of use.
* **Secure Architecture:** API keys and sensitive environment variables are strictly protected.

## 💻 Local Setup Instructions

**1. Clone the repository**
\`\`\`bash
git clone https://github.com/krishnendu007u/Conversational-Bi-Dashboard.git
cd Conversational-Bi-Dashboard
\`\`\`

**2. Install Frontend Dependencies**
\`\`\`bash
npm install
\`\`\`

**3. Environment Variables**
Create a `.env` file in the root directory and add your credentials:
\`\`\`text
VITE_GEMINI_API_KEY=your_new_api_key_here
\`\`\`

**4. Run the Development Server**
\`\`\`bash
npm run dev
\`\`\`
