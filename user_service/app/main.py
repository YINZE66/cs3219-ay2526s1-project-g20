from fastapi import FastAPI
from app.api.router import api_router
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI application
app = FastAPI(title="M1 User Service", description="User management service for PeerPrep")
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,   # ← must be explicit if allow_credentials=True
    allow_credentials=True,          # set True only if you use cookies/auth headers
    allow_methods=["*"],             # or ["GET","POST","PUT","DELETE","OPTIONS"]
    allow_headers=["*"],             # include "Authorization", "Content-Type", etc.
)
# Include API routes
app.include_router(api_router)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to User Service API"}
    