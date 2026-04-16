import uvicorn
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.health import route as health_route
from src.routes import premium, triggers, claims, evidence

app = FastAPI(title="ShiftSafeguard API", description="Main orchestrator backend for ShiftSafeguard")

# Enable CORS dynamically for deployment
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(health_route.router, prefix="/api/health", tags=["Health"])
app.include_router(premium.router, prefix="/api", tags=["Premium"])
app.include_router(triggers.router, prefix="/api", tags=["Triggers"])
app.include_router(claims.router, prefix="/api", tags=["Claims"])
app.include_router(evidence.router, prefix="/api", tags=["Evidence"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "ShiftSafeguard API is running."}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 7860))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)