from fastapi import APIRouter, HTTPException, Query
from app.utils.mongo import get_db

router = APIRouter()

@router.get("/admission-heatmap")
def get_admission_heatmap(filter_midnight: bool = Query(True, description="Filter out midnight records (00:00:00)")):
    try:
        db = get_db(demo=False)
        
        pipeline = []
        
        # Añadir filtro de medianoche solo si se solicita
        if filter_midnight:
            pipeline.append({
                "$match": {
                    "admittime": {"$not": {"$regex": "00:00:00$"}}
                }
            })
        
        pipeline.extend([
            {
                "$addFields": {
                    "admitdate": {"$dateFromString": {"dateString": "$admittime"}}
                }
            },
            {
                "$group": {
                    "_id": {
                        "hour": {"$hour": "$admitdate"},
                        "dayOfWeek": {"$dayOfWeek": "$admitdate"}
                    },
                    "count": {"$sum": 1}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "hour": "$_id.hour",
                    "dayOfWeek": "$_id.dayOfWeek",
                    "count": 1
                }
            }
        ])
        
        result = list(db["hosp_admissions"].aggregate(pipeline))
        
        return {"data": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 