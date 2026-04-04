import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.health import route as health_route
from src.routes import premium, triggers, claims

app = FastAPI(title="GigShield API", description="Main orchestrator backend for GigShield")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(health_route.router, prefix="/api/health", tags=["Health"])
app.include_router(premium.router, prefix="/api", tags=["Premium"])
app.include_router(triggers.router, prefix="/api", tags=["Triggers"])
app.include_router(claims.router, prefix="/api", tags=["Claims"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "FastAPI service is running."}

if __name__ == "__main__":
    # Changed "src.main:app" to "main:app"
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)