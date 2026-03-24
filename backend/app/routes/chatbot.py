from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.logic.chatbot_engine import chatbot_engine
from app.logic.recommend_engine import recommender
from app.routes.auth import get_current_user
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/chat", tags=["chatbot"])

class ChatRequest(BaseModel):
    message: str

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    category: str
    image_url: str

    class Config:
        orm_mode = True
        from_attributes = True

class ChatResponse(BaseModel):
    reply: str
    products: List[ProductResponse]

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. First get relevant products via semantic search
    relevant_products = recommender.get_semantic_recommendations(request.message, db, top_k=5)
    
    # 2. Get AI response with product context
    ai_response = await chatbot_engine.get_response(request.message, relevant_products)
    
    return ai_response