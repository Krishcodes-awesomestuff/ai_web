import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "app", "db", "products.db")

# However, looking at the previous list_dir, the DB actually lives in backend/app/db/products.db or backend/products.db?
# Let's check where the db file is actually generated... Oh, the connection string in database.py is "sqlite:///./products.db"
# Wait, let's look at the database.py path: "sqlite:///./products.db" relative to the current working directory where the script is run.
# I saw `products.db` inside `d:/SHERLY/Sherly/PROJ IDEAS/ai recommendation with python/ai_web/backend/` in a previous list_dir step!
# Look at list_dir at Step 26: `backend/products.db` is present.

# So the db path is 'products.db' relative to backend root.

def migrate():
    print("Migrating products.db to add product_url...")
    import sys
    db_path = "products.db"
    if not os.path.exists(db_path):
        print(f"Database {db_path} not found!")
        return
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE products ADD COLUMN product_url VARCHAR DEFAULT 'https://www.amazon.com/'")
        conn.commit()
        print("Migration successful! product_url column added.")
    except sqlite3.OperationalError as e:
        print(f"Error (maybe column already exists?): {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
