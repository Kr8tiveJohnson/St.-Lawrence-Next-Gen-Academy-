# St. Lawrence Next Gen Academy — CBT System

A dedicated, full-featured Computer-Based Testing (CBT) System for St. Lawrence Next Gen Academy. Built to simulate authentic examination hall environments for **JAMB UTME**, **WAEC SSCE**, **NECO SSCE**, and **Academy Internal Mocks**.

---

## 🎯 Features
- **Authentic CBT Exam Hall**: Real-time clock with visual warnings, question palette matrix, and progress counters.
- **On-Screen CBT Calculator**: Built-in digital scientific/arithmetic calculator for math and science examinations.
- **Keyboard Shortcuts**: Fast keyboard answers (`A`, `B`, `C`, `D`), navigation (`N` next, `P` previous), review toggle (`R`), and submission shortcut.
- **Instant Auto-Grading & Review**: In-depth score breakdowns with worked solutions and explanations for each question.
- **Candidate History**: Full performance log tracking score improvements across exam sessions.
- **Question Bank Manager**: Dedicated portal for teachers and admins to search, add, edit, test, and delete questions.
- **Shared Academy Database**: Synchronized directly with the academy's PostgreSQL database (`CbtQuestion`, `CbtAttempt`, and `User` tables).

---

## 📁 Directory Structure
```
CBT System/
├── package.json          # Root workspace scripts
├── README.md             # System documentation
├── client/               # Dedicated CBT React + Vite Frontend (Port 5174)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/client.js
│       ├── context/AuthContext.jsx
│       ├── components/
│       │   ├── CbtExamHall.jsx
│       │   ├── CbtCalculator.jsx
│       │   ├── CbtQuestionPalette.jsx
│       │   ├── CbtResultsModal.jsx
│       │   ├── CbtHistoryView.jsx
│       │   └── QuestionBankManager.jsx
│       └── pages/
│           └── CbtHomePage.jsx
└── server/               # Dedicated CBT Express Service (Port 5001)
    ├── package.json
    ├── .env
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.js
    └── src/
        ├── server.js
        ├── config/database.js
        ├── routes/cbt.routes.js
        ├── controllers/cbt.controller.js
        ├── middleware/
        └── utils/
```

---

## 🚀 Quick Start

### 1. Run the CBT Frontend (Recommended with Main Server)
The CBT client runs on port `5174` and communicates with the main server on port `5000`:
```bash
cd "C:\Users\HomePC\Documents\WEBSITE\St. Lawrence Next Gen Academy\CBT System\client"
npm install
npm run dev
```
Open **http://localhost:5174** in your browser.

### 2. (Optional) Run the CBT Microservice Backend
If running the CBT service independently on port `5001`:
```bash
cd "C:\Users\HomePC\Documents\WEBSITE\St. Lawrence Next Gen Academy\CBT System\server"
npm install
npm run dev
```

### 3. Seed Questions to the Database
To populate the central question bank with JAMB, WAEC, and NECO questions:
```bash
cd "C:\Users\HomePC\Documents\WEBSITE\St. Lawrence Next Gen Academy\CBT System\server"
npm run seed
```

---

## 🔗 Single Sign-On / Handover
When navigating from the main academy portal (`http://localhost:5173`), the auth token is passed via URL query parameter (`http://localhost:5174?token=<JWT_TOKEN>`) or read from `localStorage`, allowing candidates to enter the examination hall without logging in again.
