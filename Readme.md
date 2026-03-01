<p align="center">
  <h1 align="center">🍋 LemonadeFlow</h1>
  <p align="center"><strong>No-Code AI Workflow Automation — Powered by AMD Lemonade Runtime</strong></p>
  <p align="center"><em>"Local Zapier. Zero Cloud. NPU-Powered."</em></p>
  <p align="center">Built for the <strong>AMD Slingshot Hackathon 2025</strong></p>
</p>

---

## 🎯 What is LemonadeFlow?

LemonadeFlow is a **visual, drag-and-drop workflow automation desktop app** that runs **100% locally**. It routes all AI computation to the **AMD Ryzen AI NPU** via the [AMD Lemonade SDK](https://github.com/amd/lemonade), achieving sub-200ms inference latency — with zero cloud dependencies.

Think of it as a **local Zapier** where every AI step runs on-device, privately, and blazing fast.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔒 **100% Private & Air-Gapped** | No external API calls. All data stays on your machine. |
| ⚡ **NPU Accelerated** | Utilizes `Llama-3.2-1B-Instruct-Hybrid`, `Whisper-Large-v3-Turbo`, and `Kokoro-v1` at **<200ms** latency. |
| 🧩 **Drag & Drop Nodes** | Visual pipeline builder using ReactFlow — connect triggers → AI actions → outputs. |
| 📊 **Real-Time Execution Log** | Watch each node execute with latency metrics and payload data. |
| 🖼️ **Template Gallery** | Pre-built workflow templates to get started instantly. |
| ⚡ **Benchmark Mode** | Measure and compare node execution latency in real-time. |

---

## 🧱 Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Electron Desktop App               │
│  ┌─────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │ Sidebar  │  │ ReactFlow Canvas │  │  Execution  │ │
│  │ (Nodes)  │  │  (Drag & Drop)   │  │    Log      │ │
│  └─────────┘  └──────────────────┘  └─────────────┘ │
│                       TopBar (Run, Save, Gallery)    │
└──────────────────────┬───────────────────────────────┘
                       │ HTTP /api/*
                       ▼
┌──────────────────────────────────────────────────────┐
│              FastAPI Orchestrator (:8001)             │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────┐ │
│  │ Pipeline  │  │  Executor  │  │  Node Registry   │ │
│  │   CRUD    │  │ (Topo Sort)│  │ (AI Integrations)│ │
│  └──────────┘  └────────────┘  └────────┬─────────┘ │
│                                          │           │
│  SQLite DB          ChromaDB (RAG)       │           │
└──────────────────────────────────────────┼───────────┘
                                           │ OpenAI-compatible API
                                           ▼
┌──────────────────────────────────────────────────────┐
│          AMD Lemonade Runtime (:8000)                 │
│  Llama-3.2-1B │ Whisper-v3-Turbo │ Kokoro-v1 (TTS)  │
│              Running on AMD Ryzen AI NPU             │
└──────────────────────────────────────────────────────┘
```

---

## 🧩 Available Nodes

### Triggers (Input)
| Node | Backend Type | Description |
|------|-------------|-------------|
| 📧 Gmail Trigger | `gmail_trigger` | Polls Gmail via OAuth for new emails |
| 🎤 Voice Trigger | `voice_trigger` | Captures audio → Whisper-v3-Turbo transcription |
| 📁 File Watcher | `file_watcher` | Monitors directories for new/modified files |

### AI Actions (NPU-Accelerated)
| Node | Backend Type | Model | Description |
|------|-------------|-------|-------------|
| 🤖 Llama Summarize | `llama_summarize` | Llama-3.2-1B-Instruct-Hybrid | Summarizes input text |
| 📋 Entity Extract | `entity_extract` | Llama-3.2-1B-Instruct-Hybrid | Extracts structured JSON entities |
| 📝 Auto-Draft Reply | `auto_draft` | Llama-3.2-1B-Instruct-Hybrid | Generates professional email replies |
| 🗂️ Smart File Router | `smart_file_router` | Llama-3.2-1B-Instruct-Hybrid | Classifies and routes files to folders |

### Outputs
| Node | Backend Type | Description |
|------|-------------|-------------|
| 🔊 Kokoro TTS | `kokoro_tts` | Text-to-speech via Kokoro-v1 (af_sky voice) |
| 📌 Jira Create Task | `jira_post` | Creates a Jira ticket via REST API |

---

## 🛠️ Installation & Setup (For Judges)

LemonadeFlow requires both a **Python backend** and a **React/TypeScript Electron frontend**. Follow these steps to run the demo locally on **Windows**.

### Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | v18 or higher |
| **Python** | 3.9 – 3.11 |
| **pip** | Latest |
| **Git** | Latest |

### Option A: One-Click Start (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Thiruvarasamurthy/AMD-Slingshot.git
cd AMD-Slingshot

# 2. Run the start script (installs everything automatically)
start.bat
```

The `start.bat` script will:
- ✅ Create `.env` from `.env.example` if it doesn't exist
- ✅ Install root npm dependencies (`concurrently`)
- ✅ Install frontend dependencies (`React`, `Electron`, `Vite`, etc.)
- ✅ Create a Python virtual environment and install backend dependencies
- ✅ Launch both the FastAPI backend and the Electron frontend

### Option B: Manual Setup

```bash
# 1. Clone the repository
git clone https://github.com/Thiruvarasamurthy/AMD-Slingshot.git
cd AMD-Slingshot

# 2. Create environment file
copy .env.example .env

# 3. Install root dependencies
npm install

# 4. Install frontend dependencies
cd frontend
npm install
cd ..

# 5. Set up Python backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# 6. Start the application
npm run start
```

### 🎮 Demo Mode (Without AMD Hardware)

By default, `USE_MOCK_LEMONADE=true` is set in `.env`. This enables **mock mode**, which simulates NPU responses with realistic <200ms latency — so you can **demo the full workflow without an AMD Ryzen AI processor**.

To use real AMD Lemonade Runtime:
1. Install and start the [AMD Lemonade Server](https://github.com/amd/lemonade)
2. Set `USE_MOCK_LEMONADE=false` in `.env`
3. Ensure `http://localhost:8000/api/v1` is accessible

---

## 🚀 Usage

1. **Drag nodes** from the left sidebar onto the canvas
2. **Connect them** by dragging edges from one node's handle to another
3. **Click ▶ RUN PIPELINE** (or press `Ctrl+Enter`) to execute
4. **View results** in the Execution Log panel on the right

### Example Pipeline
```
📧 Gmail Trigger → 🤖 Llama Summarize → 📝 Auto-Draft Reply → 🔊 Kokoro TTS
```
*Fetches a new email → Summarizes it → Drafts a reply → Reads it aloud — all on the NPU in <600ms total.*

---

## 📁 Project Structure

```
lemonade-flow/
├── .env.example              # Environment config template
├── package.json              # Root runner (concurrently)
├── requirements.txt          # Python dependencies
├── start.bat                 # One-click Windows launcher
├── start.sh                  # Linux/Mac launcher
├── frontend/                 # React + Electron + Vite
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   ├── electron/
│   │   ├── main.ts           # Electron main process
│   │   └── preload.ts
│   └── src/
│       ├── App.tsx            # Main React app with ReactFlow
│       ├── main.tsx           # React entry point
│       ├── index.css          # Tailwind CSS
│       └── components/
│           ├── TopBar.tsx     # Run, Save, Gallery, Benchmark
│           ├── Sidebar.tsx    # Node palette (drag source)
│           ├── CustomNodes.tsx # ReactFlow node visuals
│           ├── ExecutionLog.tsx # Pipeline output viewer
│           ├── GalleryModal.tsx # Template gallery
│           └── BenchmarkModal.tsx # Latency benchmarks
└── backend/                  # FastAPI Orchestrator
    ├── main.py               # Server entry & /health
    ├── executor.py            # Pipeline engine (Kahn's topo-sort)
    ├── database.py            # SQLite setup
    └── nodes/
        └── registry.py        # All AI node implementations
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, ReactFlow, Tailwind CSS |
| **Desktop** | Electron 30, Vite 5, `vite-plugin-electron` |
| **Backend** | FastAPI, SQLAlchemy (SQLite), ChromaDB |
| **AI Runtime** | AMD Lemonade SDK (OpenAI-compatible local API) |
| **AI Models** | Llama-3.2-1B-Instruct-Hybrid, Whisper-Large-v3-Turbo, Kokoro-v1 |
| **Hardware** | AMD Ryzen AI NPU (XDNA architecture) |

---

## 📜 License

Built for the AMD Slingshot Hackathon 2025. All rights reserved.
