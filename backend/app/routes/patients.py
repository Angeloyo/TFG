from fastapi import APIRouter, HTTPException
from app.utils.mongo import get_db
import math

router = APIRouter(prefix="/api/patients", tags=["patients"])

def clean_data(obj):
    """Limpia valores NaN, null y ObjectId de los datos"""
    if isinstance(obj, dict):
        cleaned = {}
        for key, value in obj.items():
            if key == "_id":  # Excluir _id de MongoDB
                continue
            cleaned_value = clean_data(value)
            if cleaned_value is not None:  # Solo incluir valores válidos
                cleaned[key] = cleaned_value
        return cleaned
    elif isinstance(obj, list):
        return [clean_data(item) for item in obj if clean_data(item) is not None]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None  # Convertir NaN/Inf a None
        return obj
    elif obj == "NaN" or obj == "nan":
        return None  # Convertir strings NaN a None
    else:
        return obj

@router.get("/{subject_id}")
def get_patient(subject_id: int):
    """Obtiene información completa de un paciente"""
    db = get_db(demo=False)
    
    # Buscar datos básicos del paciente
    patient = db["hosp_patients"].find_one({"subject_id": subject_id})
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Buscar historial de ingresos
    admissions = list(db["hosp_admissions"].find({"subject_id": subject_id}))
    
    # Limpiar todos los datos
    clean_patient = clean_data(patient)
    clean_admissions = [clean_data(admission) for admission in admissions]
    
    return {
        "patient": clean_patient,
        "admissions": clean_admissions,
        "total_admissions": len(clean_admissions)
    }

@router.get("/")
def list_patients(limit: int = 10):
    """Lista los primeros pacientes disponibles"""
    db = get_db(demo=True)
    
    patients = list(db["hosp_patients"].find({}).limit(limit))
    
    # Limpiar datos
    clean_patients = [clean_data(patient) for patient in patients]
    
    return {
        "patients": clean_patients,
        "count": len(clean_patients)
    } 