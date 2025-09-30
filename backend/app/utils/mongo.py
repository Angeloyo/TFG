import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def get_db(demo: bool = None):
    """
    Devuelve una conexión a la base de datos MIMIC-IV.
    demo=True conecta al dataset reducido.
    demo=False conecta al dataset completo.
    Si no se especifica, usa la variable USE_DEMO del .env
    """
    if demo is None:
        demo = os.getenv("USE_DEMO", "false").lower() == "true"
    
    if demo:
        client = MongoClient("mongodb://localhost:27017/")
        db = client["mimic_iv_demo"]
    else:
        client = MongoClient("mongodb://localhost:27018/")
        db = client["mimic_iv_full"]
    
    return db