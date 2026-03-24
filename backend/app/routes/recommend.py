from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db, Product
from app.logic.recommend_engine import recommender
from app.routes.auth import get_current_user
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/recommend", tags=["recommend"])

class ProductSchema(BaseModel):
    id: int
    name: str
    category: str
    brand: str
    price: float
    rating: float
    image_url: str

    class Config:
        orm_mode = True

@router.get("/semantic", response_model=List[ProductSchema])
def recommend_semantic(query: str, db: Session = Depends(get_db)):
    return recommender.get_semantic_recommendations(query, db)

@router.get("/personalized", response_model=List[ProductSchema])
def recommend_personalized(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    return recommender.get_hybrid_recommendations(current_user.id, db)

@router.get("/because-viewed", response_model=List[ProductSchema])
def recommend_because_viewed(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # Hybrid already does this, but can be specialized
    return recommender.get_hybrid_recommendations(current_user.id, db)