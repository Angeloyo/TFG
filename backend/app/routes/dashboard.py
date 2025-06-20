from fastapi import APIRouter
from app.db.mongo import get_db

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_dashboard_stats():
    """
    Obtiene las estadísticas básicas para el dashboard principal.
    Devuelve 4 métricas clave: pacientes, ingresos, mortalidad y UCI.
    """
    # Conectar a la base de datos completa
    db = get_db(demo=False)
    
    # 1. Total de pacientes únicos
    total_patients = db["hosp_patients"].count_documents({})
    
    # 2. Total de ingresos hospitalarios
    total_admissions = db["hosp_admissions"].count_documents({})
    
    # 3. Calcular mortalidad hospitalaria
    deaths = db["hosp_admissions"].count_documents({"hospital_expire_flag": 1})
    mortality_rate = round((deaths / total_admissions) * 100, 2) if total_admissions > 0 else 0
    
    # 4. Total de estancias en UCI
    total_icu_stays = db["icu_icustays"].count_documents({})
    
    return {
        "total_patients": total_patients,
        "total_admissions": total_admissions,
        "mortality_rate": mortality_rate,
        "total_deaths": deaths,
        "total_icu_stays": total_icu_stays
    } 