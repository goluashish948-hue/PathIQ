# 🚀 PathIQ Deployment Guide

PathIQ is ready to be deployed to the cloud. You have three primary deployment options depending on your preference.

**GitHub Repository:** [https://github.com/goluashish948-hue/PathIQ](https://github.com/goluashish948-hue/PathIQ)

---

## 🌟 Option 1: 1-Click Full-Stack Deployment on Render (Recommended & Free)

The repository includes a ready-to-use [`render.yaml`](./render.yaml) blueprint that deploys the entire full-stack app (React SPA + Express API + Neon PostgreSQL cloud database) as a single unified service.

### Steps:
1. Go to [https://dashboard.render.com](https://dashboard.render.com) and log in (or sign up with GitHub).
2. Click **New +** in the top right and select **Blueprint**.
3. Connect your GitHub repository: `goluashish948-hue/PathIQ`.
4. Render will automatically detect `render.yaml`.
5. Render will prompt you for `DATABASE_URL`:
   - Paste your Neon PostgreSQL connection string:
     `postgresql://neondb_owner:npg_6JScFkW0azdb@ep-fragrant-frost-b50109ir-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
6. Click **Apply**.
7. Render will:
   - Run `npm install`
   - Build both the React frontend and Express backend (`npm run build`)
   - Synchronize database schema with Neon (`npx prisma db push`)
   - Start the service with `npm start`
8. Once finished (typically 2-3 minutes), Render provides a live public URL (e.g., `https://pathiq-web.onrender.com`).

---

## ⚡ Option 2: Deploy Frontend on Vercel + Backend on Render / Railway

If you prefer hosting the client on Vercel's global CDN edge network:

### Step A: Deploy Backend API on Render or Railway
1. In Render, select **New +** $\rightarrow$ **Web Service**.
2. Connect `goluashish948-hue/PathIQ`.
3. Set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build && npx prisma db push && npm run seed`
   - **Start Command**: `npm run start`
4. In Environment Variables, set:
   - `NODE_ENV=production`
   - `JWT_SECRET=any_random_32_char_secret`
5. Note your deployed API URL (e.g., `https://pathiq-api.onrender.com`).

### Step B: Deploy Frontend on Vercel
1. Go to [https://vercel.com](https://vercel.com) and click **Add New...** $\rightarrow$ **Project**.
2. Import the `PathIQ` GitHub repository.
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://pathiq-api.onrender.com`)
5. Click **Deploy**. Vercel will build and give you an instant live URL (e.g., `https://pathiq.vercel.app`).

---

## 🐳 Option 3: Deploy with Docker on Any VPS (AWS, DigitalOcean, Hetzner)

The project includes production-ready Dockerfiles ([`server/Dockerfile`](./server/Dockerfile) and [`client/Dockerfile`](./client/Dockerfile)) and [`docker-compose.yml`](./docker-compose.yml).

### Steps on your server:
```bash
# 1. Clone the repository
git clone https://github.com/goluashish948-hue/PathIQ.git
cd PathIQ

# 2. Build and run the unified container
docker build -f server/Dockerfile -t pathiq-app .
docker run -d -p 5001:5001 --name pathiq pathiq-app

# 3. Access the app
# Open your browser at http://YOUR_SERVER_IP:5001
```

---

## 🔑 Demo Login Accounts

Once deployed, you can log in immediately using the pre-seeded accounts:

### 1. Admin Account
- **Email:** `admin@pathiq.dev`
- **Password:** `AdminPass123!`

### 2. Demo Student (Fraud Detection ML Engineer)
- **Email:** `fraud.student@pathiq.dev`
- **Password:** `StudentPass123!`

### 3. Other Student Profiles
- **Data Scientist:** `data.scientist@pathiq.dev` / `StudentPass123!`
- **Robotics Engineer:** `robotics.engineer@pathiq.dev` / `StudentPass123!`
- **UI/UX Designer:** `uiux.designer@pathiq.dev` / `StudentPass123!`
