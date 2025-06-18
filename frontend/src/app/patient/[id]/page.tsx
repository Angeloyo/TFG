interface Patient {
  subject_id: number;
  gender: string;
  anchor_age: number;
  anchor_year: number;
  anchor_year_group: string;
  dod?: string;
}

interface Admission {
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
  hospital_expire_flag: number;
}

interface PatientData {
  patient: Patient;
  admissions: Admission[];
  total_admissions: number;
}

async function getPatient(id: string): Promise<PatientData> {
  const res = await fetch(`http://localhost:8088/api/patients/${id}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Paciente no encontrado');
  }
  
  return res.json();
}

export default async function PatientPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  try {
    const data = await getPatient(params.id);
    const { patient, admissions, total_admissions } = data;

    return (
      <div className="h-[calc(100vh-4.3rem)] bg-white pt-16">
        <div className="pb-8">
          <div className="max-w-4xl mx-auto px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-light text-black mb-2">
                Paciente {patient.subject_id}
              </h1>
              <p className="text-gray-600">
                {total_admissions} {total_admissions === 1 ? 'ingreso' : 'ingresos'} registrados
              </p>
            </div>

            {/* Datos básicos */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-medium text-black mb-4">Información básica</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Género</p>
                  <p className="font-medium">{patient.gender === 'M' ? 'Masculino' : 'Femenino'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Edad</p>
                  <p className="font-medium">{patient.anchor_age} años</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Año de referencia</p>
                  <p className="font-medium">{patient.anchor_year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <p className="font-medium">{patient.dod ? '†' : 'Vivo'}</p>
                </div>
              </div>
            </div>

            {/* Historial de ingresos */}
            <div>
              <h2 className="text-xl font-medium text-black mb-4">Historial de ingresos</h2>
              <div className="space-y-4">
                {admissions.map((admission) => (
                  <div key={admission.hadm_id} className="border border-gray-200 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Fechas</p>
                        <p className="font-medium">{new Date(admission.admittime).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">→ {new Date(admission.dischtime).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tipo</p>
                        <p className="font-medium">{admission.admission_type}</p>
                        <p className="text-sm text-gray-500">{admission.insurance}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Resultado</p>
                        <p className="font-medium">{admission.discharge_location}</p>
                        {admission.hospital_expire_flag === 1 && (
                          <p className="text-sm text-red-600">Fallecimiento hospitalario</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-black mb-2">Paciente no encontrado</h1>
          <p className="text-gray-600">El ID {params.id} no existe en la base de datos</p>
        </div>
      </div>
    );
  }
} 