from fastapi import APIRouter
from .icu_stay_duration import router as icu_stay_router
from .age_distribution import router as age_router
from .admission_heatmap import router as heatmap_router

# Router principal para todos los charts
router = APIRouter(prefix="/api/charts", tags=["charts"])

# Incluir todos los charts individuales
router.include_router(icu_stay_router)
router.include_router(age_router)
router.include_router(heatmap_router) 