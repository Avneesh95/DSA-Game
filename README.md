# DSA 100 Doors

A gamified DSA learning platform — solve 100 curated coding problems, each represented
as a locked door. Collect Keys (test cases) to unlock each door, watch a visual
explanation of the algorithm, and level up.

**All 100 doors are now built and seeded** — authentication, the core data models, the
full game map across all 10 worlds plus the Final Dungeon, a real multi-language code
execution/judging layer, hints, XP/leveling, and a visualization engine — all wired
end-to-end and runnable locally.

## Judging (real execution, 4 languages)

Submissions are judged for real: your Java/Python/C++/C code is compiled/interpreted
and run against each door's test cases, and compared against verified expected output —
it no longer just checks submission length. See `server/execution/` for the engine.

**Sandboxing (no Docker):** submitted code runs directly on the host via
`child_process`, hardened with `ulimit` caps (CPU time, process count, file size —
see `server/execution/runner.js` for exact values and rationale) plus a wall-clock
timeout and output-size cap. This is defense-in-depth, not a real sandbox — there's
no network isolation or filesystem jail the way a locked-down container gives you.
Fine for a personal/portfolio deployment with a handful of trusted users; if you're
opening this to the public internet at real scale, put it behind a proper sandbox
(gVisor/Firecracker, or a dedicated judge API like Piston/Judge0) or run the judge
step inside Docker yourself on a host you control.

**System requirements for judging** (in addition to Node/MongoDB): `python3`,
`g++` (C++17), and `gcc` must be on PATH. Java also needs a JVM (`javac`/`java`) —
see below for how that's handled without Docker.

- **Local dev (Debian/Ubuntu):**
  ```bash
  sudo apt-get install -y default-jdk-headless g++ gcc python3
  ```
- **Render deploy:** `g++`/`gcc`/`python3` are preinstalled in Render's native
  Node runtime, but it has no JVM and no apt/root access to install one. Instead,
  `server/package.json`'s `postinstall` script runs
  `server/scripts/install-jdk.sh`, which downloads a portable Eclipse Temurin JDK
  tarball into `server/.jdk/` — no Docker, no root, no package manager involved.
  `server/execution/languages.js` picks it up automatically. This runs on every
  Render build (it's a no-op if `server/.jdk/` is already populated).

Test data (the machine-checkable form of each door's Keys) is pre-generated into
`server/seed/generatedTestData.json` and merged in by `npm run seed`. If you ever edit
a problem's Keys, starter signature, or reference solution, regenerate it with:
```bash
node server/seed/generateTestData.js
```
This needs `javac`/`java` on PATH (it's a one-time dev-time step, not needed at deploy).

**Coverage:** all 100 doors are judgeable in Java/Python/C++/C for their concrete,
literal test cases. A few doors' original "Large Input"/"Performance" Keys were only
descriptive placeholders (e.g. `"10^5 elements, large k"`) rather than real values —
those were synthesized and verified against a reference solution where one existed
(doors 1–10), and otherwise dropped rather than stored as fake data (see the console
output of `generateTestData.js` for exactly which). The 4 multi-method "design" doors
(Min Stack #54, Implement Queue using Stacks #55, Serialize/Deserialize Binary Tree #80,
Clone Graph #83) use dedicated harnesses; #80 and #83 currently support Java/Python/C++
only (not C). A handful of "generate all valid answers" problems (subsets, permutations,
N-Queens, topological sort, etc.) compare output structurally/exactly, so a correct
solution that produces the same results in a different valid order may be marked wrong —
worth knowing about if you hit it.

## Stack

- **Frontend:** React + Vite, React Router, Tailwind CSS, Framer Motion, Monaco Editor, Axios, Zustand
- **Backend:** Node.js, Express, MongoDB + Mongoose, JWT auth, bcrypt

## Project structure

```
dsa-100-doors/
├── server/           # Express API
│   ├── config/        # DB connection
│   ├── controllers/   # Route handlers
│   ├── models/        # Mongoose schemas
│   ├── routes/         
│   ├── middleware/    # auth, rate limiting, error handling
│   ├── execution/      # real multi-language (Java/Python/C++/C) judge engine
│   ├── services/       # XP calculation, etc.
│   ├── validators/
│   └── seed/           # seed script + all 100 problems (split across 4 data files) + achievements
└── client/            # React app
    └── src/
        ├── pages/       # Login, Register, GameMap, DoorPage
        ├── components/  # DoorCard, KeysPanel, HintPanel, etc.
        ├── layouts/
        ├── store/       # Zustand auth store
        ├── services/    # Axios API client
        └── visualizers/ # generic step-based algorithm visualizer
```

## Getting started

### 1. Backend

```bash
cd server
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET as needed
npm install
npm run seed                # populates all 100 doors, achievements, and a demo admin
npm run dev                 # starts on http://localhost:5000
```

You need a MongoDB instance running locally (or a MongoDB Atlas connection string)
at the `MONGO_URI` in your `.env`.

### 2. Frontend

```bash
cd client
npm install
npm run dev                 # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so no
extra frontend env config is needed for local development.

### 3. Play

Open http://localhost:5173, register an account, and Door 1 will be available.
Complete a door to unlock the next one. The full curriculum spans all 10 worlds:

| Doors | World | Topic |
|---|---|---|
| 1–15 | World 1 | Arrays |
| 16–22 | World 2 | Hashing |
| 23–29 | World 3 | Two Pointers |
| 30–36 | World 4 | Sliding Window |
| 37–44 | World 5 | Binary Search |
| 45–52 | World 6 | Linked List |
| 53–60 | World 7 | Stack & Queue |
| 61–68 | World 8 | Recursion & Backtracking |
| 69–80 | World 9 | Trees & BST |
| 81–90 | World 10 | Graphs |
| 91–100 | Final Dungeon | Heap & DP (Door 100 is the final boss: Edit Distance) |

The last door of every world (15, 22, 29, 36, 44, 52, 60, 68, 80, 90) is flagged as a
Boss Door with elevated XP. Door 100 is the ultimate final boss.

A demo admin account is also seeded: `admin@dsa100doors.dev` / `Admin1234`
(the admin panel itself is a later phase — this account is for future use).

## Important architectural notes

- **Code execution is isolated behind one function.** `server/execution/executionService.js`
  exposes a single `runAgainstKeys` function; every controller only talks to that
  function. Swapping the judge internals (e.g. for a real container-based sandbox
  later) is a drop-in replacement with no other code changes.
- **Hidden Keys are never leaked.** Both `GET /api/doors/:doorNumber` and
  `GET /api/problems/:id` strip hidden keys' `input`/`expectedOutput` before
  sending to the client, and submission results never echo a hidden key's
  expected output.
- **Visualizations are data-driven**, not per-problem video/animation code. Each
  problem stores `visualizationSteps` (an algorithm name + an array of state
  snapshots); `StepVisualizer.jsx` renders any of them generically.

## Deploying (Render + Netlify, no Docker)

This repo has no Docker files — the backend runs entirely on Render's native Node
runtime, and the frontend is a static Vite build on Netlify.

### 1. Database — MongoDB Atlas

Render doesn't offer a MongoDB add-on. Create a free cluster at
[mongodb.com/atlas](https://www.mongodb.com/cloud/atlas), allow network access from
anywhere (`0.0.0.0/0`, since Render's outbound IPs aren't static on the free plan),
and copy the connection string — you'll paste it in as `MONGO_URI` below.

### 2. Backend — Render

`render.yaml` at the repo root is a ready-to-use Blueprint.

1. Push this repo to GitHub/GitLab.
2. In the Render dashboard: **New → Blueprint**, pick the repo. Render reads
   `render.yaml` automatically (root dir `server`, build `npm ci --omit=dev`, start
   `npm start`, native Node runtime — no Docker involved).
3. When prompted for the `sync: false` variables, provide:
   - `MONGO_URI` — your Atlas connection string
   - `CLIENT_URL` — your Netlify site's URL once you have it (step 3); you can
     redeploy later to update this once Netlify gives you a domain
4. `JWT_SECRET` is auto-generated by the Blueprint (`generateValue: true`).
5. Deploy. The build step downloads a portable JDK automatically (see the Judging
   section above) — the first build takes a bit longer for that; later builds skip
   it if cached.
6. Note the resulting service URL, e.g. `https://dsa-100-doors-api.onrender.com`.

Seed the database once, after the first deploy: run `npm run seed` locally with
`MONGO_URI` in your shell env pointed at the same Atlas cluster (Render's free plan
has no shell access), or use `render exec`/a Render one-off job on a paid plan.

### 3. Frontend — Netlify

`netlify.toml` at the repo root configures the build for you.

1. In Netlify: **Add new site → Import an existing project**, pick the repo. It
   picks up `netlify.toml` (base dir `client`, build `npm install && npm run
   build`, publish `client/dist`, SPA redirect included).
2. Set one environment variable in Netlify's UI (**Site settings → Environment
   variables**): `VITE_API_URL` = `https://<your-render-service>.onrender.com/api`
   (the trailing `/api` matters — see `client/src/services/api.js`).
3. Deploy. Then go back to Render and set `CLIENT_URL` to this Netlify URL (comma-
   separate it with any Netlify deploy-preview domain you want to allow too) so
   CORS accepts requests from it.

### Notes

- Render's free-tier web services spin down after inactivity; the first request
  after idling will be slow (cold start) while it spins back up.
- The judge's sandboxing is `ulimit`-based, not container-based — see the
  "Sandboxing" note above for what that does and doesn't protect against.
- Set real values everywhere: `NODE_ENV=production` (set by the Blueprint already),
  a real `MONGO_URI` (not localhost), and a `CLIENT_URL` that matches your actual
  Netlify domain exactly (CORS is an exact-match allowlist, not a wildcard).

## What's next (not yet built)

- Phase 3: dedicated visual-hint mode (separate from the post-completion visualization)
- Phase 5: Admin panel UI (backend models already support it — `isLockedByAdmin`, etc.)
- Phase 6: Real sandboxed code execution service

## Multi-language support

Every problem ships with starter code in **Java, Python, C++, and C**. Rather than
hand-writing ~400 snippets, `server/seed/starterCodeGenerator.js` mechanically derives
the Python/C++/C stubs from each problem's single authored Java signature — parsing the
method name, parameter types, and return type, then mapping them per language (including
LeetCode-style C conventions like appending `numsSize` / `returnSize` parameters for
array arguments). Three multi-method "design" problems (Min Stack, Implement Queue using
Stacks, Serialize/Deserialize Binary Tree) don't fit that single-method pattern and have
their multi-language stubs written directly instead.

Switch languages from the dropdown above the code editor on any door page — the editor
and starter code update immediately, and your language choice is remembered for next time.
