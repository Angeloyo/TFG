from fastapi import APIRouter, HTTPException
from app.db.mongo import get_db

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_dashboard_stats():
    """
    Obtiene las estadísticas del dashboard desde la colección pre-calculada.
    Súper rápido porque lee datos ya calculados.
    """
    # Conectar a la base de datos completa
    db = get_db(demo=False)
    
    # Leer estadísticas pre-calculadas
    cached_stats = db["dashboard_stats"].find_one({"_id": "main"})
    
    if cached_stats and "stats" in cached_stats:
        # Devolver estadísticas cacheadas
        return cached_stats["stats"]
    else:
        # Fallback: calcular en tiempo real si no existen
        raise HTTPException(
            status_code=503, 
            detail="Estadísticas no disponibles. Ejecuta calculate_dashboard_stats.py primero."
        )