# Planify - Task Management System

Planify is a modern, production-grade, full-stack Task Management application designed to help teams organize, track, and execute their goals seamlessly. It features a robust backend built with Java Spring Boot and a beautiful, highly animated React frontend.

![Planify UI Overview](frontend/public/favicon.svg)

## 🚀 Features

- **Secure Authentication:** Full registration and login system with JWT (JSON Web Tokens) and Role-Based Access Control (RBAC).
- **Comprehensive Task Management:** Create, Read, Update, and Delete tasks. Organize them by `TODO`, `IN_PROGRESS`, and `DONE` statuses.
- **Premium User Interface:** A highly polished, custom dark-themed UI with glassmorphism effects, built without heavy CSS frameworks.
- **Smooth Animations:** Includes a fully animated landing page with a custom Typewriter effect, 3D CSS isometric dashboard mockups, and smooth transitions.
- **Real-time Dashboard:** Track your workflow with summary statistics and a dedicated "All Tasks" management screen.
- **Responsive Navigation:** Features a fixed sidebar, header with profile dropdown, and seamless protected routing using React Router.

---

## 🛠️ Tech Stack

### Backend
- **Java 17 & Spring Boot 3+**
- **Spring Security & JWT** for secure, stateless authentication
- **Spring Data JPA & Hibernate** for ORM
- **MySQL Database** for reliable, persistent data storage
- **Maven** for dependency management

### Frontend
- **React.js** (Vite build tool)
- **React Router v6** for protected/public routing
- **Axios** with automatic JWT interceptors
- **Vanilla CSS** with advanced custom animations and tokens
- **Lucide React** for beautiful SVG icons
- **React Hot Toast** for seamless user notifications

---

## ⚙️ Getting Started

Follow these instructions to run the Planify application locally.

### Prerequisites
- [Java Development Kit (JDK) 17+](https://adoptium.net/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or CLI).
2. Create the database:
   ```sql
   CREATE DATABASE taskmanager_db;
   ```
3. Update your database credentials. Navigate to `backend/src/main/resources/application.yml` and ensure your `username` and `password` match your local MySQL configuration.

### 2. Running the Backend
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Run the Spring Boot application using the Maven wrapper:
   ```bash
   # Windows
   ./mvnw.cmd spring-boot:run
   
   # Mac/Linux
   ./mvnw spring-boot:run
   ```
3. The API will start on `http://localhost:8080`.

### 3. Running the Frontend
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the required Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The frontend will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```text
Task-Manager/
├── backend/                  # Java Spring Boot API
│   ├── src/main/java/...     # Controllers, Services, Repositories, Security
│   └── src/main/resources/   # application.yml configurations
├── frontend/                 # React UI Client
│   ├── src/components/       # Reusable components (TaskCard, Layout, TaskModal)
│   ├── src/context/          # AuthContext for global state
│   ├── src/pages/            # View pages (Landing, Login, Dashboard, Tasks)
│   ├── src/api/              # Axios configurations and service files
│   └── src/index.css         # Global design system & animations
└── README.md
```

---

## 🔒 Security Architecture
The application uses state-of-the-art **JSON Web Tokens (JWT)** for security:
1. **Login:** User authenticates via `/api/auth/login`.
2. **Token Generation:** The backend verifies credentials and issues a JWT signed with a secret key.
3. **Storage:** The React frontend stores the token safely in `localStorage`.
4. **Interceptors:** Every outgoing Axios request automatically attaches the token to the `Authorization: Bearer <token>` header.
5. **Expiration Handling:** If a token expires, the frontend detects the `401 Unauthorized` response, clears the session, and redirects the user back to the login screen.

---


