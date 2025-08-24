from fastapi import APIRouter, HTTPException
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path
import os
import asyncio

# Cargar variables de entorno desde app/.env
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

router = APIRouter(prefix="/api/summary", tags=["summary"])
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@router.post("/patient")
async def summarize_patient(request: dict):
    try:
        patient = request.get("patient")
        admissions = request.get("admissions", [])
        diagnoses = request.get("diagnoses", [])
        procedures = request.get("procedures", [])

        if not patient:
            raise HTTPException(status_code=400, detail="Missing 'patient' in request body")

        # Construir prompt conciso con los datos recibidos
        prompt_parts = []
        prompt_parts.append("Resume de forma objetiva y clara el historial del paciente. No inventes datos. Usa viñetas, máximo 8. No des recomendaciones clínicas.")
        prompt_parts.append(f"Demografía: género={patient.get('gender')}, edad={patient.get('anchor_age')}, año_ref={patient.get('anchor_year')}")
        prompt_parts.append(f"Ingresos: total={len(admissions)}")

        if admissions:
            for a in admissions:
                prompt_parts.append(
                    f"Ingreso hadm_id={a.get('hadm_id')}: {a.get('admission_type')} | {a.get('admittime')} → {a.get('dischtime')} | alta={a.get('discharge_location')} | fallec_hosp={a.get('hospital_expire_flag')}"
                )

        if diagnoses:
            dx_lines = [
                f"ICD-{d.get('icd_version')} {d.get('icd_code')}: {d.get('description') or ''}" for d in diagnoses
            ]
            prompt_parts.append("Diagnósticos:\n" + "\n".join(dx_lines))

        if procedures:
            px_lines = [
                f"{p.get('chartdate') or ''} | ICD-{p.get('icd_version')} {p.get('icd_code')}: {p.get('description') or ''}" for p in procedures
            ]
            prompt_parts.append("Procedimientos:\n" + "\n".join(px_lines))

        user_content = "\n".join(prompt_parts)

        messages = [
            {"role": "system", "content": "Eres un asistente clínico. Se te adjuntan datos clínicos de un paciente, debes resumirlos para ayudar a un médico a entender el caso rápidamente. No inventes. Responde en un párrafo, sin bullet points, y en español."},
            {"role": "user", "content": user_content},
        ]

        # Llamada a OpenAI con timeout
        try:
            response = await asyncio.wait_for(
                asyncio.to_thread(
                    client.responses.create,
                    model="gpt-4.1",
                    input=messages,
                ),
                timeout=120.0,
            )
        except asyncio.TimeoutError:
            raise HTTPException(status_code=504, detail="Timeout al generar el resumen")

        summary = getattr(response, "output_text", None)
        if not summary:
            raise HTTPException(status_code=502, detail="Respuesta inválida del modelo")

        return {"summary": summary}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando resumen: {str(e)}")


