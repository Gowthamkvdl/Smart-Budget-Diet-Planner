 🥗 AI Diet Planner (MERN + Docker)

A full-stack **AI-powered Diet Planner** built with Express.js, React (Vite), and **Node.js** — fully containerized with **Docker Compose** for easy setup and deployment.  
It automatically generates personalized meal plans based on user preferences and daily budget.


⚙️ Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | React + Vite + Nginx |
| Backend | Node.js + Express |
| Database | (Optional) MongoDB |
| Containerization | Docker & Docker Compose |


🚀 Quick Start — Run via Docker

1️⃣ Clone the repository

git clone https://github.com/<your-username>/diet-planner.git
cd diet-planner

2️⃣ Build and start containers

sudo docker compose up --build

| Service  | Port   | Description                 |
| -------- | ------ | --------------------------- |
| Frontend | `7000` | React app (served by Nginx) |
| Backend  | `3000` | Node.js Express API         |


📦 Folder Structure
diet/
 ├── api/                # Backend (Express.js)
 ├── client/             # Frontend (Vite + React)
 ├── docker-compose.yml  # Defines frontend + backend services
 ├── README.md           # Project documentation


