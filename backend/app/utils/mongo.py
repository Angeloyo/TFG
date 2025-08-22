from pymongo import MongoClient

def get_db(demo: bool = True):
    """
    Devuelve una conexión a la base de datos MIMIC-IV.
    demo=True conecta al dataset reducido.
    demo=False conecta al dataset completo.
    """
    if demo:
        client = MongoClient("mongodb://localhost:27017/")
        db = client["mimic_iv_demo"]
    else:
        client = MongoClient("mongodb://localhost:27018/")
        db = client["mimic_iv_full"]
    
    return db
