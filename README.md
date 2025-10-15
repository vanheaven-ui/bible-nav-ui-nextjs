# 📜 Bible Nav App

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat-square&logo=supabase)

**Bible Nav** is a fully-featured, Bible-centered navigation and study application built with **Next.js**, **TypeScript**, and **NextAuth.js**. Users can sign in with email/password or **Google OAuth**, navigate books and chapters, bookmark favorite verses, search passages efficiently, and perform **AI-assisted Bible study** for deeper understanding. The app uses **Supabase** as the database and **Prisma ORM** for database access. It is fully deployed on **Vercel**.

---

## Live Demo
Check out the live app here: [Bible Nav Live](https://bible-nav-ui-nextjs.vercel.app/)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- 🌟 **User Authentication**: Email/password and Google OAuth via NextAuth.js
- 📖 **Bible Navigation**: Browse books, chapters, and verses
- 🔍 **Search**: Keyword search across books and chapters
- ⭐ **Bookmarks**: Save favorite verses for quick access
- 🧠 **AI-Assisted Bible Study**: Get explanations, insights, and commentary powered by AI
- 📅 **Daily Verse**: Inspiring verse of the day
- ⚡ **Responsive Design**: Works on desktop and mobile seamlessly
- ☁️ **Supabase Backend**: Database storage with PostgreSQL
- 🛠 **Prisma ORM**: Type-safe database queries
- 🔒 **JWT & Secure Sessions**: Managed with NextAuth.js
- ✨ **Bible-Centric UI**: Uplifting and scripture-based messages

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, Supabase PostgreSQL, Prisma ORM
- **Authentication:** NextAuth.js (Email/Password & Google OAuth)
- **AI:** Gemini API for AI-assisted Bible study
- **Deployment:** Vercel

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bible-nav.git
cd bible-nav
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up the database:

- Create a Supabase project or local PostgreSQL database.
- Run Prisma migrations:

```bash
npx prisma migrate dev
```

## Environment Variables

Create a `.env` file in the root directory with the following:

```
# PostgreSQL connection string for local development
DATABASE_URL="postgresql://postgres:password@localhost:5432/bible-nav"

# Supabase production database
DIRECT_URL="postgresql://postgres:<password>@<supabase-host>:5432/postgres?sslmode=require"

# NextAuth settings
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<your-nextauth-secret>"

# Google OAuth
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"

# JWT Secret
JWT_SECRET="<your-jwt-secret>"

# AI API Key
GEMINI_API_KEY="<your-gemini-api-key>"
```

> **NOTE:\***- Replace placeholders with your actual credentials.

## Usage

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Open your browser at http://localhost:3000
3. **Sign Up / Log In:** Create an account or log in with Google OAuth.
4. **Browse:** Navigate through Bible books, chapters, and verses.
5. **Search:** Enter keywords or references in the search bar.
6. **Bookmark:** Save favorite passages to your account.
   7 **Daily Verse:** Get inspired with a daily verse on the homepage.
   8 **AI-Assisted Study:** Ask questions about passages or request explanations to deepen your understanding.

## Deployment

1. Push the project to GitHub:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Deploy to Vercel:

- Connect your GitHub repository to Vercel.
- Set environment variables in the Vercel dashboard.
- Deploy the app with automatic CI/CD.

## Roadmap

[x] Core Bible navigation and search
[x] Authentication with NextAuth.js
[x] Google OAuth support
[x] Bookmarking verses
[x] AI-assisted Bible study
[] Multi-language support
[] Notes and highlights on verses
[] Reading plans and devotionals
[] Offline support

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes and commit:

```bash
git commit -m "Add some feature"
```

4. Push to your branch:

```bash
git push origin feature/your-feature-name
```

5. Open a pull request.

## License

This project is licensed under the **MIT License**.

> **Bible Quote for Inspiration**  
> “Your word is a lamp to my feet and a light to my path.” — _Psalm 119:105_
