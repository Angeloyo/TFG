// ====================================
// MIMIC-IV Types
// ====================================

/**
 * Datos básicos de un paciente de MIMIC-IV
 */
export interface Patient {
  subject_id: number;
  gender: 'M' | 'F';
  anchor_age: number;
  anchor_year: number;
  anchor_year_group: string;
  dod?: string; // Fecha de muerte (si aplica)
}

/**
 * Información de un ingreso hospitalario
 */
export interface Admission {
  subject_id: number;
  hadm_id: number;
  admittime: string;
  dischtime: string;
  deathtime?: string;
  admission_type: string;
  admission_location: string;
  discharge_location: string;
  insurance: string;
  language: string;
  marital_status: string;
  race: string;
  hospital_expire_flag: 0 | 1;
}

/**
 * Respuesta completa de la API para un paciente
 */
export interface PatientData {
  patient: Patient;
  admissions: Admission[];
  total_admissions: number;
}

/**
 * Respuesta de la API para listar pacientes
 */
export interface PatientsListData {
  patients: Patient[];
  count: number;
}

/**
 * Estadísticas categorizadas del dashboard
 */
export interface DashboardCategorizedStats {
  categories: {
    demograficos_admisiones: {
      total_patients: number;
      total_admissions: number;
      mortality_rate: number;
    };
    icu: {
      total_icu_stays: number;
      icu_mortality_rate: number;
      avg_icu_stay: number;
    };
    laboratorio: {
      total_lab_tests: number;
      total_prescriptions: number;
      avg_tests_per_patient: number;
    };
    diagnosticos: {
      total_diagnoses: number;
      total_procedures: number;
      avg_diagnoses_per_patient: number;
    };
    flujos: {
      transfer_rate: number;
      avg_moves_per_admission: number;
      most_common_destination: string;
    };
  };
  last_updated: string;
}

// ====================================
// API Response Types
// ====================================

/**
 * Estructura base para respuestas de error de la API
 */
export interface ApiError {
  detail: string;
}

/**
 * Estados de carga comunes
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Datos de estancia por UCI para gráficos
 */
export interface ICUStayData {
  careunit: string;
  avg_stay_days: number;
  total_stays: number;
  min_stay: number;
  max_stay: number;
}

/**
 * Datos de distribución por edad para population pyramid
 */
export interface AgeDistributionData {
  age_group: string;
  gender: 'M' | 'F';
  count: number;
}

/**
 * Datos del heatmap de ingresos por hora y día
 */
export interface AdmissionHeatmapData {
  hour: number;
  dayOfWeek: number;
  count: number;
}
