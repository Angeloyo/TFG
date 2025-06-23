from fastapi import APIRouter, HTTPException
from app.db.mongo import get_db

router = APIRouter()

@router.get("/admission-heatmap")
def get_admission_heatmap():
    try:
        db = get_db(demo=False)
        
        pipeline = [
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
        ]
        
        result = list(db["hosp_admissions"].aggregate(pipeline))
        
        return {"data": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 