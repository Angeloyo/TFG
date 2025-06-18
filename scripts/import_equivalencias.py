import pandas as pd
from pymongo import MongoClient
from tqdm import tqdm

# Conexiones a ambas bases de datos
client_demo = MongoClient("mongodb://localhost:27017/")
db_demo = client_demo["mimic_iv_demo"]

client_full = MongoClient("mongodb://localhost:27018/")
db_full = client_full["mimic_iv_full"]

# Ruta del archivo CSV
csv_path = "icd_con_equivalencia_ic10_extended.csv"

def importar_equivalencias():
    """Importa las equivalencias ICD a ambas bases de datos"""
    
    print("📁 Cargando archivo de equivalencias ICD...")
    
    try:
        # Cargar todas las columnas del CSV
        df_equiv = pd.read_csv(csv_path)
        
        print(f"✅ Cargadas {len(df_equiv)} equivalencias ICD")
        
        # Convertir a lista de documentos
        records = df_equiv.to_dict(orient="records")
        
        # Importar a base de datos demo
        print("📥 Importando a base de datos demo...")
        
        # Borrar colección existente si existe
        db_demo.drop_collection("icd_equivalencias")
        
        # Insertar datos
        db_demo["icd_equivalencias"].insert_many(records)
        print(f"✅ Importadas {len(records)} equivalencias a BD demo")
        
        # Importar a base de datos completa
        print("📥 Importando a base de datos completa...")
        
        # Borrar colección existente si existe
        db_full.drop_collection("icd_equivalencias")
        
        # Insertar datos
        db_full["icd_equivalencias"].insert_many(records)
        print(f"✅ Importadas {len(records)} equivalencias a BD completa")
        
        # Crear índices para consultas rápidas
        print("🔍 Creando índices...")
        
        # Índices en BD demo
        db_demo["icd_equivalencias"].create_index([("icd_code", 1), ("icd_version", 1)])
        db_demo["icd_equivalencias"].create_index("chapter")
        db_demo["icd_equivalencias"].create_index("super_section")
        db_demo["icd_equivalencias"].create_index("section")
        
        # Índices en BD completa
        db_full["icd_equivalencias"].create_index([("icd_code", 1), ("icd_version", 1)])
        db_full["icd_equivalencias"].create_index("chapter")
        db_full["icd_equivalencias"].create_index("super_section")
        db_full["icd_equivalencias"].create_index("section")
        
        print("✅ Índices creados en ambas bases de datos")
        
        # Mostrar estadísticas
        print("\n📊 Estadísticas:")
        print(f"  - Total equivalencias: {len(records)}")
        print(f"  - Columnas disponibles: {list(df_equiv.columns)}")
        print(f"  - Capítulos únicos: {df_equiv['chapter'].nunique()}")
        print(f"  - Super secciones únicas: {df_equiv['super_section'].nunique()}")
        print(f"  - Secciones únicas: {df_equiv['section'].nunique()}")
        
        print("\n🎉 Importación completada exitosamente")
        
    except Exception as e:
        print(f"❌ Error durante la importación: {e}")

if __name__ == "__main__":
    importar_equivalencias() 