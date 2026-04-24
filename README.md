# 🚀 ResumeIQ — AI Resume Analyzer

ResumeIQ is a modern web application that analyzes resumes and provides instant feedback, scoring, and job-match insights. Built with a clean UI and real-world cloud integration using Supabase.

---

## 🌐 Live Demo

👉 https://resume-sparkle-eight.vercel.app/

---

## 📌 Features

* 📄 Upload PDF resumes
* ⚡ Instant resume analysis
* 📊 Resume scoring system
* 🎯 Job description matching (optional)
* 🔐 Secure environment variable handling
* 🎨 Modern dark UI

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, TypeScript
* **Styling:** Tailwind CSS, shadcn UI
* **Backend/DB:** Supabase
* **Deployment:** Vercel
* **Version Control:** Git & GitHub

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Mahesh-363/resume-sparkle-630.git
cd resume-sparkle-630
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

### 4️⃣ Run the application

```bash
npm run dev
```

👉 Open: http://localhost:5173

---

## 🔐 Environment Variables

| Variable               | Description          |
| ---------------------- | -------------------- |
| VITE_SUPABASE_URL      | Supabase Project URL |
| VITE_SUPABASE_ANON_KEY | Public API Key       |

---

## 🚀 Deployment

This project is deployed using **Vercel**.

### Steps:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

---

## ⚠️ Security Note

* `.env` file is ignored using `.gitignore`
* Never expose secret keys in GitHub
* Use environment variables for deployment

---

## 📁 Project Structure

```
resume-sparkle-630/
│
├── public/
├── src/
├── supabase/
├── .gitignore
├── package.json
└── README.md
```

---

## 👨‍💻 Author

**Mahesh**

---

## ⭐ Acknowledgements

Built using modern frontend tools and cloud services to simulate a real-world AI-powered resume analysis platform.
