from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db, User, Product, UserInteraction
from app.routes.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/dashboard")
def get_dashboard_stats(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # In real world, check if admin. For now, open to logged in users.
    total_users = db.query(User).count()
    total_products = db.query(Product).count()
    total_interactions = db.query(UserInteraction).count()
    
    # Top interacted categories
    top_categories = db.query(
        Product.category, 
        func.count(UserInteraction.id).label('interactions')
    ).join(UserInteraction).group_by(Product.category).order_by(func.count(UserInteraction.id).desc()).limit(5).all()
    
    # Daily interactions (last 7 days - simplified)
    daily_interactions = db.query(
        func.date(UserInteraction.timestamp).label('date'),
        func.count(UserInteraction.id)
    ).group_by(func.date(UserInteraction.timestamp)).order_by(func.date(UserInteraction.timestamp).desc()).limit(7).all()
    
    return {
        "stats": {
            "users": total_users,
            "products": total_products,
            "interactions": total_interactions
        },
        "top_categories": [{"category": c, "count": i} for c, i in top_categories],
        "daily_trends": [{"date": str(d), "count": c} for d, c in daily_interactions]
    }
