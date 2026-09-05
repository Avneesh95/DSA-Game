# 🚪 DSA 100 Doors — Gamified DSA Learning Platform

<div align="center">

![DSA 100 Doors Banner](https://img.shields.io/badge/DSA-100%20Doors-FF9500?style=for-the-badge&logo=codeforces&logoColor=white)
![Built By Avneesh](https://img.shields.io/badge/Built%20by-Avneesh-black?style=for-the-badge&logo=github)
![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

<p align="center">
  <b>A modern, gamified Data Structures & Algorithms learning platform.</b><br/>
  Solve 100 curated DSA problems across 10 themed worlds, collect test-case Keys, inspect live step-by-step visualizations, and master interview patterns.
</p>

---
**Created with ❤️ by Avneesh**
---

</div>

## 🌟 Key Highlights & Features

### 1. 🔍 Dual-Mode Interactive Execution Visualizer
- **"How to Solve" Mode**: Canonical, step-by-step algorithmic trace showing optimal pointer movements and state transitions before or during problem solving.
- **"My Code" Mode**: Client-side execution tracer ([`codeInterpreter.js`](client/src/visualizers/codeInterpreter.js)) that interprets and steps through the user's actual written code line-by-line in real-time, displaying dynamic variable mutations, pointers, and array states.
- **Monaco Editor Integration**: Active lines in the visualizer automatically highlight and track inside the code editor without latency.

### 2. 💡 Easy Step-by-Step Algorithm in Hint Panel
- **Progressive Hints**: Unlock hints one by one without spoiling the solution.
- **Step-by-Step Algorithm Breakdown**:
  - **Step 1: Setup & Initialization**: Boundary placement, tracking variables, and base cases.
  - **Step 2: Traversal & Loop Strategy**: Iteration direction and pointer convergence criteria.
  - **Step 3: Condition Check & Decision Logic**: Plain-English comparison and invariant rules.
  - **Step 4: State Update**: Variable updates, swaps, or pointer advances.
  - **Step 5: Completion & Return**: Output construction.
- **Canonical Pattern Blueprints**: Built-in 5-step blueprints for *Two Pointers*, *Sliding Window*, *Binary Search*, *Dutch National Flag*, *Kadane's Algorithm*, *Fast & Slow Pointers*, *Monotonic Stack*, and *Hashing*.

### 3. 🎨 Apple-Inspired Design System
- **Pure Black Dark Mode**: Deep `#000000`, card grays (`#1c1c1e`), translucent frosted glass (`backdrop-blur-xl`), and vibrant **Apple Orange (`#ff9500`)** primary CTA accents.
- **Crisp Light Mode**: Minimalist pure white (`#ffffff`) and soft gray (`#f5f5f7`) surface hierarchy with dark contrast typography.
- **Polished Monaco Editor**: Rounded 2xl borders, line highlight decorations, instant compiler/runtime error console, and responsive fullscreen mode.

### 4. ⚡ Real Multi-Language Code Judging (4 Languages)
- Real compiler and interpreter execution on backend for **Java**, **Python**, **C++**, and **C**.
- Validates submissions against test cases (Basic Keys, Edge Case Keys, Boundary Keys, Performance Keys).
- Hardened execution runner with strict timeouts and memory caps.

### 5. 🎮 100 Doors Progression & Gamification
- **10 Worlds + Final Dungeon**: 100 sequential doors unlocking as you solve problems.
- **XP, Levels, & Streaks**: Earn XP per door, level up your adventurer profile, and maintain daily streaks.
- **Boss Doors**: Challenging milestone doors at the end of every world with elevated XP rewards.

---

## 🗺️ Curriculum & Worlds

| World | Doors | Topic | Focus Patterns |
|---|---|---|---|
| **World 1** | Doors 1–15 | Arrays | Linear Scan, Two Pointers, Prefix Sum, Dutch National Flag |
| **World 2** | Doors 16–22 | Hashing | Frequency Map, Complements, Anagrams, Sets |
| **World 3** | Doors 23–29 | Two Pointers | Sorted Pair Sum, Container With Most Water, 3Sum, Inward Convergence |
| **World 4** | Doors 30–36 | Sliding Window | Fixed Window, Dynamic Window, Character Replacement, Deque Max |
| **World 5** | Doors 37–44 | Binary Search | Search Space Reduction, Rotated Arrays, Search on Answer |
| **World 6** | Doors 45–52 | Linked Lists | Reversal, Floyd's Cycle Detection, Fast & Slow Pointers, Merge |
| **World 7** | Doors 53–60 | Stack & Queue | Monotonic Stack, Valid Parentheses, Next Greater Element, Min Stack |
| **World 8** | Doors 61–68 | Recursion & Backtracking | Subsets, Permutations, Combination Sum, N-Queens |
| **World 9** | Doors 69–80 | Trees & BST | DFS / BFS, Tree Inversion, Diameter, Path Sum, LCA |
| **World 10** | Doors 81–90 | Graphs | Adjacency Traversal, Topological Sort, Island Count, Shortest Path |
| **Final Dungeon** | Doors 91–100 | Dynamic Programming | Knapsack, Longest Common Subsequence, Edit Distance (Final Boss) |

---

## 🛠️ Tech Stack

### Client (Frontend)
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (Apple Minimalist Theme)
- **Editor**: Monaco Editor (`@monaco-editor/react`)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios

### Server (Backend)
- **Runtime**: Node.js + Express
- **Database**: MongoDB Atlas via Mongoose
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs password hashing
- **Execution Engine**: `child_process` compiler/runner for Java (`javac`/`java`), Python (`python3`), C++ (`g++`), and C (`gcc`)
- **Seed System**: Automated generator for 100 doors, starter code, and verified test cases

---

## 🚀 Getting Started Locally

### Prerequisites
1. **Node.js** (v18 or higher)
2. **MongoDB** (local community server or MongoDB Atlas URI)
3. **Compilers** (for judging code):
   - Python 3 (`python3`)
   - GCC / G++ (`gcc`, `g++`)
   - JDK (`javac`, `java`)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/avneesh952000/dsa-100-doors.git
cd dsa-100-doors
```

### Step 2: Configure & Run Server
```bash
cd server
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/100_Door_game
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

Install dependencies and seed the database:
```bash
npm install
npm run seed      # Seeds all 100 doors, test cases, and achievements
npm run dev       # Starts Express API at http://localhost:5000
```

### Step 3: Configure & Run Client
```bash
cd ../client
npm install
npm run dev       # Starts Vite dev server at http://localhost:5173
```

Open **http://localhost:5173** in your browser, create an account, and start unlocking doors!

---

## 📂 Project Structure

```
dsa-100-doors/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, HintPanel, KeysPanel, DoorUnlockOverlay, etc.
│   │   ├── layouts/            # MainLayout
│   │   ├── pages/              # GameMap, DoorPage, Login, Register
│   │   ├── services/           # Axios API services
│   │   ├── store/              # Zustand stores (useAuthStore, useThemeStore)
│   │   ├── utils/              # algorithmSteps.js (Step-by-step algorithm generator)
│   │   ├── visualizers/        # StepVisualizer.jsx & codeInterpreter.js (Real-time code tracer)
│   │   ├── index.css           # Apple-inspired CSS design system
│   │   └── App.jsx
│   ├── tailwind.config.js      # Palette: Pure Black (#000000), Apple Card (#1c1c1e), Orange (#ff9500)
│   └── package.json
│
├── server/                     # Express Backend
│   ├── config/                 # DB configuration
│   ├── controllers/            # doorController, authController, submissionController, progressController
│   ├── execution/              # Multi-language execution runner & test case judge
│   ├── middleware/             # authMiddleware, rateLimiter, errorHandler
│   ├── models/                 # Problem, Door, User, UserProgress, Achievement
│   ├── routes/                 # doorRoutes, authRoutes, submissionRoutes, progressRoutes
│   ├── seed/                   # problemsData (1-100), achievementsData, starterCodeGenerator
│   └── server.js
│
├── README.md
├── render.yaml                 # Render backend deployment config
└── netlify.toml                # Netlify frontend deployment config
```

---

## 🚢 Live Deployments

- **Live Application (Frontend)**: [**https://fundsa.netlify.app/**](https://fundsa.netlify.app/)
- **Live Backend API**: [`https://dsa-game.onrender.com/`](https://dsa-game.onrender.com/) (Health: [`/api/health`](https://dsa-game.onrender.com/api/health))
- **Database (MongoDB Atlas)**: Cloud-hosted MongoDB cluster.

---

## 👨‍💻 Author & Credits

- **Creator & Lead Developer**: **Avneesh**
- **Project**: DSA 100 Doors
- Designed and engineered with focus on interactive learning, clean architecture, and modern Apple-inspired aesthetics.

---

## 📄 License

This project is licensed under the MIT License — feel free to use it for learning and portfolio reference.
