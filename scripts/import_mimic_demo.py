import os
import pandas as pd
from pymongo import MongoClient
from tqdm import tqdm

# Conectar con MongoDB dentro del contenedor de Docker
client = MongoClient("mongodb://localhost:27017/")
db = client["mimic_iv_demo"]  # Nombre de la base de datos

# Ruta del dataset
dataset_path = "/home/angel/Documents/github/TFG-Angel-Sanchez/mimic-iv-clinical-database-demo-2.2"

# Función para importar CSVs a MongoDB
def import_csv_to_mongo(folder_path, subfolder):
    full_path = os.path.join(folder_path, subfolder)
    if not os.path.exists(full_path):
        return

    for file in tqdm(os.listdir(full_path), desc=f"Cargando {subfolder}"):
        if file.endswith(".csv"):
            collection_name = f"{subfolder}_{file.replace('.csv', '')}"
            df = pd.read_csv(os.path.join(full_path, file))
            db[collection_name].insert_many(df.to_dict(orient="records"))

# Importar las carpetas principales
import_csv_to_mongo(dataset_path, "hosp")
import_csv_to_mongo(dataset_path, "icu")

# Importar el CSV de demo_subject_id.csv en una colección separada
df_subjects = pd.read_csv(os.path.join(dataset_path, "demo_subject_id.csv"))
db["demo_subject_id"].insert_many(df_subjects.to_dict(orient="records"))

print("Importación completada en MongoDB.")
