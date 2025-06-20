#!/usr/bin/env python3
"""
Script para calcular estadísticas del dashboard y guardarlas en MongoDB.
Esto hace que el dashboard sea instantáneo en lugar de tardar 10+ segundos.
"""

from pymongo import MongoClient
from datetime import datetime, timezone

def get_database():
    """Conectar a la BD full"""
    client = MongoClient("mongodb://localhost:27018/")
    return client["mimic_iv_full"]

def calculate_stats(db):
    """Calcular todas las estadísticas del dashboard"""
    print("Calculando estadísticas...")
    
    total_patients = db["hosp_patients"].count_documents({})
    total_admissions = db["hosp_admissions"].count_documents({})
    deaths = db["hosp_admissions"].count_documents({"hospital_expire_flag": 1})
    mortality_rate = round((deaths / total_admissions) * 100, 2) if total_admissions > 0 else 0
    total_icu_stays = db["icu_icustays"].count_documents({})
    total_lab_tests = db["hosp_labevents"].estimated_document_count()
    male_patients = db["hosp_patients"].count_documents({"gender": "M"})
    male_percentage = round((male_patients / total_patients) * 100, 1) if total_patients > 0 else 0
    emergency_admissions = db["hosp_admissions"].count_documents({"admission_type": "EW EMER."})
    emergency_rate = round((emergency_admissions / total_admissions) * 100, 1) if total_admissions > 0 else 0
    total_diagnoses = db["hosp_diagnoses_icd"].count_documents({})
    
    return {
        "total_patients": total_patients,
        "total_admissions": total_admissions,
        "mortality_rate": mortality_rate,
        "total_icu_stays": total_icu_stays,
        "total_lab_tests": total_lab_tests,
        "male_percentage": male_percentage,
        "emergency_rate": emergency_rate,
        "total_diagnoses": total_diagnoses
    }

def save_stats(db, stats):
    """Guardar estadísticas en la colección dashboard_stats"""
    document = {
        "_id": "main",
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "stats": stats
    }
    
    # Usar upsert para reemplazar si ya existe
    db["dashboard_stats"].replace_one(
        {"_id": "main"}, 
        document, 
        upsert=True
    )
    print(f"Estadísticas guardadas en dashboard_stats")

def main():
    """Función principal"""
    print("=== Calculando estadísticas del dashboard ===")
    
    # Conectar a BD
    db = get_database()
    print("Conectado a mimic_iv_full")
    
    # Calcular estadísticas
    stats = calculate_stats(db)
    print(f"Calculadas {len(stats)} métricas")
    
    # Guardar en BD
    save_stats(db, stats)
    
    print("=== Completado ===")
    print(f"Pacientes: {stats['total_patients']:,}")
    print(f"Ingresos: {stats['total_admissions']:,}")
    print(f"Mortalidad: {stats['mortality_rate']}%")

if __name__ == "__main__":
    main() 