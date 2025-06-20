"""
Script para calcular estancia promedio hospitalaria y agregarla al dashboard.
"""

from pymongo import MongoClient

def get_database():
    """Conectar a la BD full"""
    client = MongoClient("mongodb://localhost:27018/")
    return client["mimic_iv_full"]

def calculate_average_stay(db):
    """Calcular estancia promedio hospitalaria en días"""
    print("Calculando estancia promedio hospitalaria...")
    
    # Agregación para calcular diferencia de fechas y promedio
    pipeline = [
        {
            "$addFields": {
                "admit_date": {"$dateFromString": {"dateString": "$admittime"}},
                "discharge_date": {"$dateFromString": {"dateString": "$dischtime"}}
            }
        },
        {
            "$addFields": {
                "stay_days": {
                    "$divide": [
                        {"$subtract": ["$discharge_date", "$admit_date"]}, 
                        86400000  # milisegundos a días
                    ]
                }
            }
        },
        {
            "$group": {
                "_id": None,
                "avg_stay": {"$avg": "$stay_days"}
            }
        }
    ]
    
    result = list(db["hosp_admissions"].aggregate(pipeline))
    
    if result:
        avg_stay = round(result[0]["avg_stay"], 1)
        print(f"Estancia promedio: {avg_stay} días")
        return avg_stay
    else:
        return 0

def add_to_dashboard(db, avg_stay):
    """Agregar estancia promedio al dashboard existente"""
    current_stats = db["dashboard_stats"].find_one({"_id": "main"})
    
    if current_stats:
        # Agregar nueva métrica usando update_one
        db["dashboard_stats"].update_one(
            {"_id": "main"},
            {"$set": {"stats.avg_length_of_stay": avg_stay}}
        )
        print("Estancia promedio agregada al dashboard")
    else:
        print("Error: No existe dashboard_stats. Ejecuta calculate_dashboard_stats.py primero")

def main():
    """Función principal"""
    print("=== Agregando estancia promedio al dashboard ===")
    
    db = get_database()
    avg_stay = calculate_average_stay(db)
    add_to_dashboard(db, avg_stay)
    
    print("=== Completado ===")

if __name__ == "__main__":
    main() 