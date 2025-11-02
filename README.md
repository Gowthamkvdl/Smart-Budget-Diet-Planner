## 🚀 Quick Start — Run via Docker

Easily spin up the entire **AI Diet Planner (MERN)** stack using **Docker Compose** 🐳  
This will launch both the **frontend (React + Vite + NGINX)** and **backend (Node.js + Express)** containers in one go.

---

### 🧩 Step 1 — Clone the Repository

```bash
git clone https://github.com/<your-username>/diet-planner.git
cd diet-planner
```

### ⚙️ Step 2 — Build & Start Containers

```bash
sudo docker compose up --build
```

### 🌐 Step 3 — Access the App
Once containers are running, open the app in your browser:
```
| Service            | URL                                            | Description                       |
| ------------------ | ---------------------------------------------- | --------------------------------- |
| 🖥️ **Frontend**   | [http://localhost:7000](http://localhost:7000) | React + Vite served through NGINX |
| ⚙️ **Backend API** | [http://localhost:3000](http://localhost:3000) | Node.js + Express server          |
```

### 🧹 Step 4 — Stop Containers
When you’re done, gracefully shut down everything with:
```bash
sudo docker compose down
```
