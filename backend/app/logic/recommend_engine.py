import os
import numpy as np
import pandas as pd
from sqlalchemy.orm import Session
from app.db.database import Product, UserInteraction

try:
    from sentence_transformers import SentenceTransformer
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False

try:
    import faiss
    HAS_FAISS = True
except ImportError:
    HAS_FAISS = False

try:
    from surprise import SVD, Dataset, Reader
    HAS_SURPRISE = True
except ImportError:
    HAS_SURPRISE = False

class RecommenderEngine:
    def __init__(self):
        # Load semantic search model
        if HAS_TRANSFORMERS:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
        else:
            self.model = None
        self.index = None
        self.product_ids = []
        
    def build_vector_index(self, db: Session):
        if not HAS_TRANSFORMERS or not HAS_FAISS:
            print("AI libraries not available for vector index.")
            return

        print("Building FAISS index...")
        products = db.query(Product).all()
        if not products:
            return
        
        descriptions = [f"{p.name} {p.category} {p.description}" for p in products]
        self.product_ids = [p.id for p in products]
        
        embeddings = self.model.encode(descriptions, show_progress_bar=False)
        dimension = embeddings.shape[1]
        
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(np.array(embeddings).astype('float32'))
        print(f"FAISS index built with {len(self.product_ids)} items.")

    def get_semantic_recommendations(self, query: str, db: Session, top_k: int = 10):
        if not HAS_TRANSFORMERS or not HAS_FAISS:
            return db.query(Product).filter(Product.name.ilike(f"%{query}%")).limit(top_k).all()

        if self.index is None:
            if not getattr(self, '_is_building', False):
                self._is_building = True
                print("Starting asynchronous FAISS index build...")
                import threading
                from app.db.database import SessionLocal
                def _build():
                    try:
                        with SessionLocal() as db_session:
                            self.build_vector_index(db_session)
                    except Exception as e:
                        print(f"Error building FAISS index: {e}")
                    finally:
                        self._is_building = False
                threading.Thread(target=_build, daemon=True).start()
            
            # Fallback to direct DB query while building
            return db.query(Product).filter(
                (Product.name.ilike(f"%{query}%")) | 
                (Product.category.ilike(f"%{query}%")) | 
                (Product.brand.ilike(f"%{query}%"))
            ).limit(top_k).all()

        query_vector = self.model.encode([query]).astype('float32')
        distances, indices = self.index.search(query_vector, top_k)
        
        recommended_ids = [self.product_ids[idx] for idx in indices[0] if idx < len(self.product_ids)]
        
        # Ensure order is preserved as FAISS returned 
        products_dict = {p.id: p for p in db.query(Product).filter(Product.id.in_(recommended_ids)).all()}
        return [products_dict[pid] for pid in recommended_ids if pid in products_dict]

    def get_collaborative_recommendations(self, user_id: int, db: Session, top_k: int = 10):
        if not HAS_SURPRISE:
            return db.query(Product).order_by(Product.rating.desc()).limit(top_k).all()

        interactions = db.query(UserInteraction).all()
        if not interactions:
            return []
            
        data = [(i.user_id, i.product_id, i.rating or 3.0) for i in interactions]
        df = pd.DataFrame(data, columns=['user', 'item', 'rating'])
        
        reader = Reader(rating_scale=(1, 5))
        dataset = Dataset.load_from_df(df, reader)
        trainset = dataset.build_full_trainset()
        
        algo = SVD()
        algo.fit(trainset)
        
        all_product_ids = [p.id for p in db.query(Product.id).all()]
        user_interacted = [i.product_id for i in db.query(UserInteraction).filter_by(user_id=user_id).all()]
        
        predictions = []
        for p_id in all_product_ids:
            if p_id not in user_interacted:
                est = algo.predict(user_id, p_id).est
                predictions.append((p_id, est))
                
        predictions.sort(key=lambda x: x[1], reverse=True)
        top_ids = [x[0] for x in predictions[:top_k]]
        
        return db.query(Product).filter(Product.id.in_(top_ids)).all()

    def get_hybrid_recommendations(self, user_id: int, db: Session, top_k: int = 10):
        cf_recs = self.get_collaborative_recommendations(user_id, db, top_k // 2)
        
        if cf_recs:
            last_interaction = db.query(UserInteraction).filter_by(user_id=user_id).order_by(UserInteraction.timestamp.desc()).first()
            if last_interaction:
                product = db.query(Product).filter_by(id=last_interaction.product_id).first()
                cb_recs = self.get_semantic_recommendations(f"{product.name} {product.category}", db, top_k // 2)
            else:
                cb_recs = []
        else:
            cb_recs = db.query(Product).order_by(Product.rating.desc()).limit(top_k).all()
            
        return list(set(cf_recs + cb_recs))[:top_k]

recommender = RecommenderEngine()
