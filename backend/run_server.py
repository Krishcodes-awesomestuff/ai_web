import os
import sys

# Ensure PYTHONPATH is set
sys.path.append(os.getcwd())

print("Pre-downloading models...")
try:
    from sentence_transformers import SentenceTransformer
    # This will download the models if they are not present
    model = SentenceTransformer('all-MiniLM-L6-v2') 
    print("Models ready.")
except Exception as e:
    print(f"Error downloading models: {e}")
    sys.exit(1)

print("Starting server...")
import uvicorn
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
