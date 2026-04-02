import uvicorn
from fastapi import FastAPI
from src.routes.health import route as health_route
from src.routes import premium, triggers, claims

app = FastAPI(title="FastAPI Microservice", description="Main orchestrator backend")

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