## 🚀 Quick Start — Run via Docker

Get the entire **AI Diet Planner (MERN)** stack running in one command using **Docker Compose** 🐳  

---

### 🧩 Step 1 — Clone the Repository
```bash
git clone https://github.com/<your-username>/diet-planner.git
cd diet-planner
⚙️ Step 2 — Build & Start Containers
bash
Copy code
sudo docker compose up --build
💡 Pro Tip:
Use the --build flag the first time or whenever you change code or dependencies.
For faster restarts (when nothing changed), skip rebuilding:

bash
Copy code
sudo docker compose up
🌐 Step 3 — Access the App
Service	URL	Description
🖥️ Frontend	http://localhost:7000	React + Vite (served via NGINX)
⚙️ Backend API	http://localhost:3000	Node + Express server

🧹 Step 4 — Stop Containers
When you’re done, gracefully shut everything down:

bash
Copy code
sudo docker compose down
