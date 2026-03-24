from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routes
from app.routes import auth, products, recommend, chatbot, analytics

# Create app
app = FastAPI(title="AI Recommendation Engine")

# ✅ CORS (VERY IMPORTANT for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include all routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(recommend.router)
app.include_router(chatbot.router)
app.include_router(analytics.router)

# ✅ Root endpoint
@app.get("/")
def home():
    return {
        "message": "AI Recommendation Engine Running 🚀",
        "status": "success"
    }

# ✅ Health check (useful for debugging)
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "backend": "running"
    }