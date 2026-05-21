# 🪐 SumitKolgire.com

<div align="center">
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  <br>
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Sanity](https://img.shields.io/badge/Sanity-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)](https://www.sanity.io/)
  [![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
  [![Velite](https://img.shields.io/badge/Velite-Content_Layer-8B5CF6?style=for-the-badge)](https://velite.js.org/)
  
</div>

---

## ✦ Overview

Personal site, writing space, projects portfolio, and private lab diary for **Sumit Kolgire**. 
Built with a focus on premium aesthetics, seamless content management, and robust multi-zone architecture (Public / Private Lab).

The project is heavily inspired by Wabi-Sabi and Neural Parchment design principles — offering a distraction-free, minimalist, yet deeply functional environment for writing and research.

## 🚀 Key Features

- **Public Zone**: High-performance portfolio and blog built using [Velite](https://velite.js.org/) for optimized static content.
- **Private Lab (Workspace)**: A dedicated, authenticated space for drafting ideas, managing research, and seamless publishing directly to Sanity.
- **Wabi-Sabi Design System**: Custom tailored aesthetics focusing on typography, layout, and visual harmony.
- **Authentication**: Secure, fragment-based OAuth workflow with Supabase.
- **Database**: PostgreSQL (Supabase) managed seamlessly with Drizzle ORM.
- **Headless CMS**: Sanity Studio integrated for dynamic content editing and schema modeling.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Content Management (Static)**: [Velite](https://velite.js.org/)
- **Content Management (Dynamic)**: [Sanity](https://www.sanity.io/)
- **Database**: [PostgreSQL (Supabase)](https://supabase.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## ⚡ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sumitkolgire23/Sumitkolgire.com.git
   cd Sumitkolgire.com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file and add your Supabase, Sanity, and other necessary credentials (refer to `.env.example`).

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   *The local server will start on [http://localhost:5500](http://localhost:5500).*

## 📖 License

This project is open-source and available under the [MIT License](LICENSE).

