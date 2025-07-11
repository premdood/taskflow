# 🚀 TaskFlow

[![Live Demo](https://img.shields.io/badge/-Live%20Demo-00bcd4?style=for-the-badge&logo=vercel&logoColor=white)](https://taskflow-rho-nine.vercel.app/)

A full-featured **Task Management App** built with the **MERN Stack**, designed for admin-led team collaboration. Manage tasks, assign team members, track progress, and boost productivity with a clean, responsive UI.

---

## 📌 Features

### 👤 User & Role Management

- JWT-based authentication
- Admin can add team members (email = password on creation)
- Team members can change their password after login
- Role-based access control (Admin vs Members)

### 📋 Task Management

- Create, edit, delete tasks
- Assign team members to a task
- Upload and view task files
- Add comments or chat in task activities
- View detailed task info
- notifications to assigned members

### 📊 Dashboard & Insights

- User-friendly dashboard for all users
- Task overview
- Real-time updates using Redux + RTK Query

### 🗃️ Admin Controls

- Trash view to manage deleted tasks
- Add new members
- Manage team via dedicated Team Page
- Activate and deactivate members' account

---

## 🧑‍💻 Tech Stack

### 🌐 Frontend

- ⚛️ React 19
- 🛠️ Redux Toolkit & RTK Query
- 🎨 Tailwind CSS + Headless UI
- 📦 Vite
- 📊 Recharts

### 🖥️ Backend

- 🚀 Node.js + Express + Supabase
- 🧱 MongoDB + Mongoose
- 📁 File uploads with Multer
- 🔐 JWT Auth with Bcrypt
- 🧩 RESTful API architecture

---

## Client Setup

### Environment variables

create the environment variables file .env in the client folder. The .env file contains the following environment variables:

- VITE_API_BASE_URL= `your backend url`

### Steps to run client

```bash
cd client
npm install
npm run dev
```

## Server Setup

### Environment variables

create the environment variables file .env in the server folder. The .env file contains the following environment variables:

- NODE_ENV = `development`
- JWT_SECRET = `jwt secret key`
- JWT_LIFETIME = `jwt validaity time`
- PORT = `3000`
- DB_USER = `database user name`
- PASSWORD = `database password name`
- DATABASE = `Task-Management-System`
- SUPABASE_URL= `supabse project url`
- SUPABASE_SERVICE_ROLE_KEY= `supabse service role key`

### Steps to run server

```bash
cd server
npm install
npm run dev
```
