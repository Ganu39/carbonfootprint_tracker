# 🌿 EcoStep — Carbon Footprint Tracker

> **Track your carbon footprint. Understand your impact. Save the planet.**

EcoStep is a full-stack web application that empowers individuals to understand, track, and reduce their personal carbon footprint through intuitive activity logging and personalized AI-powered insights powered by Google Gemini.

---

## 🌍 Problem Statement

Climate change is the defining challenge of our generation. While systemic change is essential, **individual action matters** — the average person generates approximately **4 tonnes of CO₂ per year** globally, and even small behavioral changes can compound into meaningful impact.

However, most people have **no visibility** into their personal carbon footprint. They don't know which daily activities contribute most to their emissions, and they lack actionable guidance on how to reduce their impact.

---

## 💡 Solution

**EcoStep** bridges this gap by providing:

- 📊 **Simple Activity Logging** — Log transport, food, energy, and shopping activities in seconds
- 📈 **Beautiful Analytics** — Visualize your emissions with interactive charts and trend analysis
- 🤖 **AI-Powered Insights** — Get personalized tips from Google Gemini based on your actual behavior
- 🎯 **Goal Tracking** — Set monthly CO₂ goals and track progress with a beautiful circular dashboard
- 🔥 **Streak System** — Stay motivated with daily logging streaks
- 🌙 **Dark Mode** — Easy on the eyes, day or night

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS v4 |
| **Charts** | Chart.js + react-chartjs-2 |
| **Routing** | React Router v7 |
| **Icons** | Lucide React |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose ODM |
| **Authentication** | JWT + bcrypt |
| **AI Layer** | Google Gemini 1.5 Flash API |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 📸 Screenshots

| Dashboard | Activity Logger | Analytics |
|-----------|----------------|-----------|
| *Coming Soon* | *Coming Soon* | *Coming Soon* |

| AI Insights | Profile | Login |
|------------|---------|-------|
| *Coming Soon* | *Coming Soon* | *Coming Soon* |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/carbon-footprint-tracker.git
cd carbon-footprint-tracker
```

### 2. Set Up Environment Variables
```bash
cp .env.example backend/.env
```

Edit `backend/.env` with your values:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecostep
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run the Application
```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and get JWT token | ❌ |
| `GET` | `/api/activities` | Get all activities for user | ✅ |
| `POST` | `/api/activities` | Log a new activity | ✅ |
| `DELETE` | `/api/activities/:id` | Delete an activity | ✅ |
| `GET` | `/api/stats/weekly` | Weekly CO₂ aggregation | ✅ |
| `GET` | `/api/stats/monthly` | Monthly CO₂ aggregation | ✅ |
| `GET` | `/api/stats/categories` | Category breakdown | ✅ |
| `POST` | `/api/insights/generate` | Generate AI insight via Gemini | ✅ |
| `GET` | `/api/insights/latest` | Get cached latest insight | ✅ |
| `GET` | `/api/profile` | Get user profile | ✅ |
| `PUT` | `/api/profile` | Update profile and goals | ✅ |

---

## 🌱 Carbon Emission Factors

| Activity | Emission Factor |
|----------|----------------|
| 🚗 Car | 0.21 kg CO₂/km |
| 🚌 Bus | 0.089 kg CO₂/km |
| ✈️ Flight | 0.255 kg CO₂/km |
| 🚲 Bike | 0 kg CO₂/km |
| 🥩 Beef meal | 6.61 kg CO₂ |
| 🍗 Chicken meal | 1.24 kg CO₂ |
| 🥗 Vegetarian meal | 0.50 kg CO₂ |
| 🌱 Vegan meal | 0.30 kg CO₂ |
| ⚡ Electricity | 0.82 kg CO₂/kWh |
| 🔥 Natural Gas | 2.04 kg CO₂/m³ |
| 👕 Clothing | 15 kg CO₂/item |
| 📱 Electronics | 50 kg CO₂/item |
| 🛒 General purchase | 5 kg CO₂/item |

---

## 📁 Project Structure

```
carbon-footprint-tracker/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/             # Axios configuration
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth & Theme contexts
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Root component with routing
│   │   └── index.css        # Tailwind + design system
│   ├── index.html
│   └── vite.config.js
├── backend/                  # Express.js API
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route handlers
│   ├── middleware/          # JWT auth middleware
│   ├── utils/               # Emission factors utility
│   └── server.js            # Entry point
├── .env.example             # Environment variable template
├── .gitignore
└── README.md
```

---

## 🔗 Live Demo

🌐 **Frontend**: [Coming Soon — Vercel Deployment]()  
🖥️ **Backend API**: [Coming Soon — Render Deployment]()

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 🏆 Built For

**Google Virtual Prompt 2026**

---

<p align="center">
  Made with 💚 for a greener planet
</p>
