import { PatientData } from '@/types';
import PatientBasicInfo from '@/components/patient/PatientBasicInfo';
import PatientAdmissions from '@/components/patient/PatientAdmissions';
import PatientAISummary from '@/components/patient/PatientAISummary';

async function getPatient(id: string): Promise<PatientData> {
  const res = await fetch(`https://tfg-api.angeloyo.com/api/patients/${id}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Paciente no encontrado');
  }
  
  return res.json();
}

export default async function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  try {
    const { patient, admissions, diagnoses, procedures } = await getPatient(resolvedParams.id);
    
    // Obtener la admisión más reciente para datos demográficos adicionales
    let latestAdmission = null;
    if (admissions.length > 0) {
      latestAdmission = admissions.reduce((latest, current) => {
        if (new Date(current.admittime) > new Date(latest.admittime)) {
          return current;
        } else {
          return latest;
        }
      });
    }

    return (
      <div className="min-h-[calc(100vh-5rem)] bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-light text-black mb-2">
              Paciente {patient.subject_id}
            </h1>
            <p className="text-gray-600">
              {admissions.length} {admissions.length === 1 ? 'ingreso' : 'ingresos'} registrados
            </p>
          </div>

          {/* Información básica */}
          <PatientBasicInfo 
            patient={patient} 
            latestAdmission={latestAdmission} 
          />

          {/* Resumen IA */}
            <PatientAISummary data={{ patient, admissions, diagnoses, procedures }} />

          {/* Historial de ingresos */}
          <PatientAdmissions 
            admissions={admissions} 
            diagnoses={diagnoses} 
            procedures={procedures}
          />
        </div>
      </div>
    );
  } catch {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-white flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-xl sm:text-2xl font-light text-black mb-2">Paciente no encontrado</h1>
          <p className="text-gray-600">El ID {resolvedParams.id} no existe en la base de datos</p>
        </div>
      </div>
    );
  }
}
 