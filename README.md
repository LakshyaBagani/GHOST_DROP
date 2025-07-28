# 🔐 Ghost Drop

**Ghost Drop** is a secure, end-to-end encrypted file-sharing platform that allows users to share files through **auto-expiring, one-time access links**. Built with privacy in mind, Ghost Drop ensures your content is delivered safely, privately, and only once.

---

## 🚀 Key Features

- 🔐 **One-Time Access Links** — Links automatically expire after 24 hours or a single use.
- 📁 **Multi-Format File Support** — Upload videos, images, PDFs, and audio files.
- 🛡️ **End-to-End Encryption** — All files are encrypted before storage.
- 🧠 **Owner Dashboard** — Regenerate access links for uploaded content at any time.
- 📊 **File Management** — Track your uploads and manage them through an intuitive dashboard.
- ❌ **No Re-Access** — Once accessed, the link is permanently invalid.

---

## 🛠️ Tech Stack

### Frontend
- **React** with **TypeScript**
- **Tailwind CSS** for UI styling
- **React Router** for routing
- **Axios** for HTTP requests

### Backend
- **Express.js** with **TypeScript**
- **Prisma ORM** for database interaction
- **Supabase** for authentication and object storage
- **PostgreSQL** for data persistence

---

## ⚙️ System Architecture

1. **User uploads a file** via the frontend interface.
2. The file is **encrypted** and stored securely using Supabase Storage.
3. A **JWT-secured, one-time link** is generated and stored in PostgreSQL via Prisma.
4. On access, the backend:
   - Validates the token
   - Serves the file
   - **Deletes or invalidates the link** immediately
5. The file owner can log into the dashboard to **regenerate a new link** for future sharing.

---

