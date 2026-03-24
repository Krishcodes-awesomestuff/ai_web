import random
import requests
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, Product, init_db, UserInteraction
from datetime import datetime
import json

def seed_products(db: Session, count: int = 500):
    print(f"Fetching real products to seed {count} entries...")
    try:
        # Fetch real products from DummyJSON
        res = requests.get("https://dummyjson.com/products?limit=100")
        data = res.json()
        base_products = data.get("products", [])
    except Exception as e:
        print("Failed to fetch real items, falling back to dummy list.", e)
        base_products = [
            {"title": "iPhone 15 Pro", "brand": "Apple", "category": "smartphones", "price": 999.0, "description": "Latest Apple smartphone with titanium frame.", "images": ["https://cdn.dummyjson.com/product-images/1/thumbnail.jpg"]},
            {"title": "Galaxy S24 Ultra", "brand": "Samsung", "category": "smartphones", "price": 1199.0, "description": "Samsung flagship phone with AI features.", "images": ["https://cdn.dummyjson.com/product-images/2/thumbnail.jpg"]},
        ]
    
    products = []
    
    for i in range(count):
        base = random.choice(base_products)
        title = str(base.get("title", "Product"))
        brand = str(base.get("brand", "Generic") or "Generic")
        cat = str(base.get("category", "Electronics"))
        desc = str(base.get("description", ""))
        
        # Add random variations
        real_price = float(base.get("price", 100.0))
        price = round(real_price * random.uniform(0.8, 1.2), 2)
        
        name = f"{title} Gen {random.randint(1, 9)}" if count > 200 else title
        imgs = base.get("images", [])
        image_url = str(imgs[0]) if imgs else f"https://source.unsplash.com/300x200/?{cat.replace(' ', '+')}"

        product = Product(
            name=name,
            category=cat,
            brand=brand,
            price=price,
            rating=round(float(random.uniform(3.0, 5.0)), 1),
            description=desc,
            view_count=random.randint(0, 1000),
            image_url=image_url,
            product_url=f"https://www.amazon.com/s?k={name.replace(' ', '+')}"
        )
        products.append(product)
        
        if len(products) >= 1000:
            db.bulk_save_objects(products)
            db.commit()
            print(f"Inserted {i+1} products...")
            products = []

    if products:
        db.bulk_save_objects(products)
        db.commit()
    print("Seeding complete!")

if __name__ == "__main__":
    import os
    db_path = os.path.join(os.path.dirname(__file__), "products.db")
    if os.path.exists(db_path):
        os.remove(db_path)
    init_db()
    db = SessionLocal()
    try:
        seed_products(db)
    finally:
        db.close()