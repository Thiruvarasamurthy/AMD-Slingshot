import os
import json
import requests
import chromadb
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from dotenv import load_dotenv

from database import Pipeline, get_db
from executor import PipelineExecutor

# Load environment variables
load_dotenv(dotenv_path="../.env")

app = FastAPI(title="LemonadeFlow Orchestrator")

# Enable CORS for the Vite React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Local Vector DB (ChromaDB) for smart file routing/RAG
chroma_client = chromadb.PersistentClient(path="./chroma_db")
rag_collection = chroma_client.get_or_create_collection(name="lemonade_memory")

# Environment Configurations
USE_MOCK_LEMONADE = os.getenv("USE_MOCK_LEMONADE", "false").lower() == "true"
LEMONADE_API_BASE = os.getenv("LEMONADE_API_BASE", "http://localhost:8000/api/v1")

class PipelineCreate(BaseModel):
    name: str
    description: str = ""
    nodes_json: str
    edges_json: str

@app.get("/api/health")
def health_check():
    """Checks the status of the local AMD Lemonade Runtime."""
    if USE_MOCK_LEMONADE:
        return {
            "status": "ok",
            "lemonade_status": "MOCK_MODE_ACTIVE",
            "backend": "MOCK_NPU (Simulated)",
            "latency_target": "<200ms"
        }
    
    try:
        # AMD LEMONADE INTEGRATION POINT
        # Polling the local OpenAI-compatible endpoint for active models
        response = requests.get(f"{LEMONADE_API_BASE}/models", timeout=2.0)
        response.raise_for_status()
        
        # In a real scenario, we might parse xrt-smi output here for exact NPU load.
        return {
            "status": "ok",
            "lemonade_status": "ONLINE",
            "backend": "AMD_RYZEN_AI_NPU",
            "latency_target": "<200ms"
        }
    except Exception as e:
        return {
            "status": "warning",
            "lemonade_status": "OFFLINE",
            "backend": "UNKNOWN",
            "error": str(e)
        }

@app.post("/api/pipelines")
def create_pipeline(pipeline: PipelineCreate, db: Session = Depends(get_db)):
    db_pipeline = Pipeline(**pipeline.model_dump())
    db.add(db_pipeline)
    db.commit()
    db.refresh(db_pipeline)
    return {"id": db_pipeline.id, "name": db_pipeline.name}

@app.get("/api/pipelines")
def get_pipelines(db: Session = Depends(get_db)):
    return db.query(Pipeline).all()

@app.post("/api/pipelines/{pipeline_id}/execute")
async def execute_pipeline(pipeline_id: int, db: Session = Depends(get_db)):
    pipeline = db.query(Pipeline).filter(Pipeline.id == pipeline_id).first()
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    nodes = json.loads(pipeline.nodes_json)
    edges = json.loads(pipeline.edges_json)
    
    executor = PipelineExecutor(nodes, edges)
    try:
        result = await executor.execute()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)