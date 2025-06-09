# 🎮 Game Dashboard

A modern, responsive game dashboard built with **Next.js**, optimized for performance and deployed on **Vercel**.

🟢 **Live Demo**:  
👉 [https://newgame-git-master-alkakaswans-projects.vercel.app](https://newgame-git-master-alkakaswans-projects.vercel.app)

---

## 🚀 Tech Stack

- ⚡️ Next.js (App Router)
- 💅 Tailwind CSS
- 💻 TypeScript
- ☁️ MongoDB
- 🎨 ShadCN UI
- ☁️ Vercel for deployment


---

## 📁 Folder Structure

```bash
.
├── app/                # App routes and pages
├── components/         # Reusable UI components
├── lib/                # Utility functions
├── public/             # Static files
├── styles/             # Global styles
├── types/              # TypeScript interfaces
└── README.md


---
## 🔐 Environment Variables

Create a file named `.env` in the root of your project and add the following:

```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/game-dashboard?retryWrites=true&w=majority

# Secret key for JWT auth
JWT_SECRET=your_super_secret_key

# Environment type
NODE_ENV=development

