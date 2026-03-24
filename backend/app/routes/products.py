from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db, Product, UserInteraction
from app.routes.auth import get_current_user
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/products", tags=["products"])

class ProductSchema(BaseModel):
    id: int
    name: str
    category: str
    brand: str
    price: float
    rating: float
    image_url: str
    product_url: str

    class Config:
        orm_mode = True

@router.get("/", response_model=List[ProductSchema])
def get_products(
    skip: int = 0, 
    limit: int = 20, 
    q: str = None, 
    brand: str = None, 
    sort_by: str = None, 
    order: str = "asc", 
    semantic: bool = False,
    db: Session = Depends(get_db)
):
    if q:
        from app.logic.recommend_engine import recommender
        # Get enough results to allow for filtering
        products = recommender.get_semantic_recommendations(q, db, top_k=50)
        
        # Manually apply filters on the semantic list
        if brand:
            products = [p for p in products if brand.lower() in p.brand.lower()]
            
        if sort_by == "price":
            products.sort(key=lambda x: x.price, reverse=(order == "desc"))
            
        return products[skip:skip+limit]

    query = db.query(Product)
    
    if brand:
        query = query.filter(Product.brand.ilike(f"%{brand}%"))
        
    if sort_by == "price":
        if order == "desc":
            query = query.order_by(Product.price.desc())
        else:
            query = query.order_by(Product.price.asc())
            
    return query.offset(skip).limit(limit).all()

@router.get("/trending", response_model=List[ProductSchema])
def get_trending(limit: int = 10, db: Session = Depends(get_db)):
    # Simple trending logic based on view count
    return db.query(Product).order_by(Product.view_count.desc()).limit(limit).all()

@router.post("/{product_id}/interact")
def interact(product_id: int, type: str, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    interaction = UserInteraction(
        user_id=current_user.id,
        product_id=product_id,
        interaction_type=type
    )
    
    if type == "view":
        product.view_count += 1
        
    db.add(interaction)
    db.commit()
    return {"status": "success"}

@router.get("/history", response_model=List[ProductSchema])
def get_history(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    interactions = db.query(UserInteraction).filter(UserInteraction.user_id == current_user.id).order_by(UserInteraction.timestamp.desc()).limit(20).all()
    product_ids = [i.product_id for i in interactions]
    # Keep order of interaction
    products = {p.id: p for p in db.query(Product).filter(Product.id.in_(product_ids)).all()}
    return [products[pid] for pid in product_ids if pid in products]