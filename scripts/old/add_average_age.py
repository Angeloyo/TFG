"""
Script para calcular edad promedio y agregarla al dashboard.
"""

from pymongo import MongoClient

def get_database():
    """Conectar a la BD full"""
    client = MongoClient("mongodb://localhost:27018/")
    return client["mimic_iv_full"]

def calculate_average_age(db):
    """Calcular edad promedio de pacientes"""
    print("Calculando edad promedio...")
    
    # Agregación simple para calcular promedio
    result = list(db["hosp_patients"].aggregate([
        {"$group": {"_id": None, "avg_age": {"$avg": "$anchor_age"}}}
    ]))
    
    if result:
        avg_age = round(result[0]["avg_age"], 1)
        print(f"Edad promedio: {avg_age} años")
        return avg_age
    else:
        return 0

def add_to_dashboard(db, avg_age):
    """Agregar edad promedio al dashboard existente"""
    # Buscar el documento actual
    current_stats = db["dashboard_stats"].find_one({"_id": "main"})
    
    if current_stats:
        # Agregar nueva métrica
        # current_stats["stats"]["avg_patient_age"] = avg_age
        # Actualizar documento
        # db["dashboard_stats"].replace_one(
        #     {"_id": "main"}, 
        #     current_stats
        # )

        db["dashboard_stats"].update_one(
            {"_id": "main"},
            {"$set": {"stats.avg_patient_age": avg_age}}
        )
        
        print("Edad promedio agregada al dashboard")
    else:
        print("Error: No existe dashboard_stats. Ejecuta calculate_dashboard_stats.py primero")

def main():
    """Función principal"""
    print("=== Agregando edad promedio al dashboard ===")
    
    db = get_database()
    avg_age = calculate_average_age(db)
    add_to_dashboard(db, avg_age)
    
    print("=== Completado ===")

if __name__ == "__main__":
    main() 