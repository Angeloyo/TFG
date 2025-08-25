'use client';

import { Admission, Diagnosis, Procedure } from '@/types';
import { useState } from 'react';

interface PatientAdmissionsProps {
  admissions: Admission[];
  diagnoses: Diagnosis[];
  procedures: Procedure[];
}

export default function PatientAdmissions({ admissions, diagnoses, procedures }: PatientAdmissionsProps) {
  const [expandedAdmissions, setExpandedAdmissions] = useState<Set<number>>(new Set());

  const toggleAdmission = (hadmId: number) => {
    const newExpanded = new Set(expandedAdmissions);
    if (newExpanded.has(hadmId)) {
      newExpanded.delete(hadmId);
    } else {
      newExpanded.add(hadmId);
    }
    setExpandedAdmissions(newExpanded);
  };

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-medium text-black mb-4">Historial de ingresos ({admissions.length})</h2>
      {admissions.length === 0 ? (
        <div className="p-4 sm:p-6 border border-gray-200 rounded-lg text-gray-600">
          No hay ingresos registrados para este paciente.
        </div>
      ) : (
        <div className="space-y-4">
          {admissions.map((admission: Admission) => {
          const admissionDiagnoses = diagnoses.filter(d => d.hadm_id === admission.hadm_id);
          const admissionProcedures = procedures.filter(p => p.hadm_id === admission.hadm_id);
          const isExpanded = expandedAdmissions.has(admission.hadm_id);

          return (
            <div key={admission.hadm_id} className="border border-gray-200 rounded-lg">
              {/* Header clickeable */}
              <button
                onClick={() => toggleAdmission(admission.hadm_id)}
                className="w-full p-4 sm:p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-black mb-2">
                      Ingreso {new Date(admission.admittime).toLocaleDateString()}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {/* <span>{admission.admission_type}</span>
                      <span>•</span>
                      <span>{admission.insurance}</span>
                      <span>•</span> */}
                      <span>{Math.max(1, Math.ceil((new Date(admission.dischtime).getTime() - new Date(admission.admittime).getTime()) / 86400000))} días</span>
                      {admissionDiagnoses.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{admissionDiagnoses.length} diagnósticos</span>
                        </>
                      )}
                      {admissionProcedures.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{admissionProcedures.length} procedimientos</span>
                        </>
                      )}
                      {(admission.labevents?.length ?? 0) > 0 && (
                        <>
                          <span>•</span>
                          <span>{admission.labevents?.length} tests</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              {/* Contenido expandible */}
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
                  {/* Información detallada del ingreso */}
                  <div className="mb-4 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
                      <div className="sm:col-span-2 lg:col-span-1">
                        <p className="text-sm text-gray-600">Discharge Location</p>
                        <p className="font-medium">{admission.discharge_location}</p>
                        {admission.hospital_expire_flag === 1 && (
                          <p className="text-sm text-red-600">Fallecimiento hospitalario</p>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-400">ID: {admission.hadm_id}</p>
                  </div>
                  
                  {/* Diagnósticos del ingreso */}
                  {admissionDiagnoses.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Diagnósticos ({admissionDiagnoses.length})
                      </h4>
                      <div className="space-y-2">
                        {admissionDiagnoses.map((diagnosis: Diagnosis) => (
                          <div key={`${diagnosis.hadm_id}-${diagnosis.seq_num}`} 
                               className="p-3 rounded bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-black">
                                  {diagnosis.description || `Código ICD ${diagnosis.icd_code}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                  ICD-{diagnosis.icd_version}: {diagnosis.icd_code}
                                </p>
                              </div>
                              <span className="text-sm font-medium text-gray-600 ml-2">#{diagnosis.seq_num}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Procedimientos del ingreso */}
                  {admissionProcedures.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Procedimientos ({admissionProcedures.length})
                      </h4>
                      <div className="space-y-2">
                        {admissionProcedures.map((procedure: Procedure) => (
                          <div key={`${procedure.hadm_id}-${procedure.seq_num}`} 
                               className="p-3 rounded bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-black">
                                  {procedure.description || `Código ICD ${procedure.icd_code}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                  ICD-{procedure.icd_version}: {procedure.icd_code}
                                </p>
                              </div>
                              {procedure.chartdate && (
                                <span className="text-sm text-gray-500 ml-2">{new Date(procedure.chartdate).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Laboratorio del ingreso */}
                  {Array.isArray(admission.labevents) && admission.labevents.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Laboratorio ({admission.labevents.length})
                      </h4>
                      <div className="overflow-x-auto border border-gray-100 rounded-md">
                        <table className="min-w-full text-sm table-fixed">
                          <thead>
                            <tr className="text-left text-gray-500">
                              <th className="py-2 pr-4 w-40 pl-4">Fecha</th>
                              <th className="py-2 pr-4 w-56 sm:w-72">Test</th>
                              <th className="py-2 pr-4 w-24">Valor</th>
                              <th className="py-2 pr-4 w-20">Unidad</th>
                              <th className="py-2 pr-4 w-24 text-center">Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {admission.labevents.slice(0, 20).map((ev) => (
                              <tr key={ev.labevent_id} className="border-t border-gray-200">
                                <td className="py-2 pr-4 pl-4 text-gray-700 whitespace-nowrap">{new Date(ev.charttime).toLocaleString()}</td>
                                <td className="py-2 pr-4 text-gray-900 whitespace-nowrap max-w-[180px] sm:max-w-[280px] truncate">{ev.label || ev.itemid}</td>
                                <td className="py-2 pr-4 text-gray-900 whitespace-nowrap">{(ev.valuenum ?? ev.value ?? '-').toString()}</td>
                                <td className="py-2 pr-4 text-gray-700 whitespace-nowrap">{ev.valueuom || '-'}</td>
                                <td className="py-2 pr-4 text-center whitespace-nowrap">
                                  {ev.flag ? (
                                    <span className="inline-block px-2 py-1 text-xs rounded bg-red-100 text-red-700">Anormal</span>
                                  ) : (
                                    <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700">Normal</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
}
