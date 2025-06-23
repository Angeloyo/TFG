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
 * Estadísticas completas del dashboard
 */
export interface DashboardStats {
  total_patients: number;
  total_admissions: number;
  mortality_rate: number;
  total_icu_stays: number;
  total_lab_tests: number;
  male_percentage: number;
  emergency_rate: number;
  total_diagnoses: number;
  avg_patient_age: number;
  avg_length_of_stay: number;
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
