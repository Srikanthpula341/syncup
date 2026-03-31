# SyncUp 🚀

SyncUp is a premium, real-time collaboration platform designed for high-performance teams. Built with **Next.js 16**, **Firebase**, and **Redux Toolkit**, it combines the best of Slack's threaded conversations with Trello's intuitive Kanban task management—all under a sleek, Halodek-inspired modern UI.

---

## ✨ Core Features

### 💬 Real-time Threaded Chat
- **Threaded Conversations**: Keep discussions focused and organized.
- **Message Status**: Real-time read receipts and delivery indicators.
- **Presence Tracking**: See who's online with 10M-heartbeat accuracy.
- **Multi-channel Support**: Public and private channels for every workspace.

### 📋 Kanban Task Management
- **Interactive Board**: Drag-and-drop tasks across custom columns (`To-Do`, `In Progress`, `Review`, `Done`).
- **Optimistic UI**: Instant updates for a lag-free productivity experience.
- **Task Metadata**: Manage priorities, due dates, and assignees with ease.
- **Direct Navigation**: Link activities directly to tasks for rapid context switching.

### 📈 Activity Timeline
- **Workspace Pulse**: A live feed of every significant event (task moves, new messages, workspace changes).
- **Human-Readable Logs**: Detailed event descriptions including task names and user actions.
- **Instant Sync**: Powered by Firestore listeners for a truly live experience.

### 🏢 Multi-tenant Workspaces
- **Isolated Environments**: Switch between independent workspaces without leaving the app.
- **Workspace Hub**: A central management page to join or create new collaboration hubs.
- **Admin Settings**: Fine-grained control over workspace names and configurations.

### 🛡️ Security Implementation
- **Token-based API Protection**: All mission-critical API routes (Tasks, Messages) require a valid **Firebase ID Token** in the `Authorization` header.
- **Server-side Verification**: Using the `firebase-admin` SDK, every request's identity is verified on the server before any database operations occur.
- **Identity Correlation**: The system ensures that the verified user UID from the token matches the `creatorId` or `userId` in the request body, preventing ID spoofing.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router & Turbopack) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) |
| **Database** | [Firebase Firestore](https://firebase.google.com/docs/firestore) |
| **Authentication** | [Firebase Auth](https://firebase.google.com/docs/auth) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v20+)
- A Firebase Project (Firestore, Auth, and Admin SDK enabled)

### 2. Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Srikanthpula341/syncup.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   Create a `.env.local` file with your Firebase configuration.

4. **Launch the platform**:
   ```bash
   npm run dev
   ```

---

## 👔 Design System: "Halodek"
SyncUp follows a custom design philosophy called **Halodek**, which prioritizes:
- **Clean Aesthetic**: Off-white backgrounds with vibrant orange accents (`#F97316`).
- **Soft Geometry**: Large border-radii (`32px`) and subtle drop shadows.
- **Micro-Animations**: Smooth page transitions and interactive hover states.

---

### 👨‍💻 Developed By
**Pula Srikanth** - *Advancing collaboration through modern architecture.*
