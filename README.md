## 🚀 Quick Start — Run via Docker

Easily spin up the entire **AI Diet Planner (MERN)** stack using **Docker Compose** 🐳  
This will launch both the **frontend (React + Vite + NGINX)** and **backend (Node.js + Express)** containers in one go.

---

### 🧩 Step 1 — Clone the Repository

```bash
git clone https://github.com/Gowthamkvdl/Smart-Budget-Diet-Planner.git
cd diet-planner
```
---

### 🔑 Step 2 — Get and Add Your Google Gemini API Key
The backend uses the Google Gemini API to generate personalized diet plans.
Follow these steps to obtain your own key 🔐:

  1. Visit https://makersuite.google.com/app/apikey (or search Google AI Studio API Key).

  2. Sign in with your Google account.

  3. Click “Create API Key”.

  4. Copy the generated key 

Now, create a .env file inside the api folder and add your key:

```
GEMINI_API_KEY=your_api_key_here
```


### ⚙️ Step 3 — Build & Start Containers

```bash
sudo docker compose up --build
```

### 🌐 Step 4 — Access the App
Once containers are running, open the app in your browser:
| Service            | URL                                            | Description                       |
| ------------------ | ---------------------------------------------- | --------------------------------- |
| 🖥️ **Frontend**   | [http://localhost:7000](http://localhost:7000) | React + Vite served through NGINX |
| ⚙️ **Backend API** | [http://localhost:3000](http://localhost:3000) | Node.js + Express server          |

### 🧹 Step 5 — Stop Containers
When you’re done, gracefully shut down everything with:
```bash
sudo docker compose down
```
