import sys
import os

print("Python version:", sys.version)
print("Executable:", sys.executable)
print("PYTHONPATH:", os.environ.get("PYTHONPATH", "Not set"))
print("sys.path:")
for path in sys.path:
    print(f"  {path}")

try:
    import sqlalchemy
    print("SQLAlchemy version:", sqlalchemy.__version__)
    print("SQLAlchemy path:", sqlalchemy.__file__)
except ImportError as e:
    print("SQLAlchemy Import Error:", e)
