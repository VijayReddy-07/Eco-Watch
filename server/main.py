from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time
import random
import datetime

app = FastAPI(title="AcousticVault ML Server")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SoundPrediction(BaseModel):
    label: str
    confidence: float
    risk_level: str
    timestamp: str
    details: Optional[str] = None

class HistoryLog(BaseModel):
    id: int
    label: str
    confidence: float
    timestamp: str

# In-memory history for demo purposes
history = []

SOUND_CATEGORIES = [
    {"label": "Frog Calls", "risk": "Low", "details": "Healthy ecosystem indicator"},
    {"label": "Traffic Noise", "risk": "Moderate", "details": "Urban pollution interference"},
    {"label": "Machinery", "risk": "High", "details": "Industrial noise pollution"},
    {"label": "Bird Song", "risk": "Low", "details": "Biodiversity positive signal"},
    {"label": "Silence", "risk": "Low", "details": "Background ambient noise"}
]

@app.get("/")
async def root():
    return {"status": "online", "system": "AcousticVault"}

@app.post("/predict", response_model=SoundPrediction)
async def predict_audio(file: UploadFile = File(...)):
    # Simulate processing time
    time.sleep(1.2)
    
    # Mock inference logic
    selected = random.choice(SOUND_CATEGORIES)
    confidence = random.uniform(0.85, 0.99)
    timestamp = datetime.datetime.now().isoformat()
    
    prediction = SoundPrediction(
        label=selected["label"],
        confidence=float(round(confidence, 4)),
        risk_level=selected["risk"],
        timestamp=timestamp,
        details=selected["details"]
    )
    
    # Add to history
    history.append({
        "id": len(history) + 1,
        "label": prediction.label,
        "confidence": prediction.confidence,
        "timestamp": prediction.timestamp
    })
    
    return prediction

@app.get("/history", response_model=List[HistoryLog])
async def get_history():
    # Safe slicing for lint friendliness
    start_idx = max(0, len(history) - 10)
    return history[start_idx:]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
