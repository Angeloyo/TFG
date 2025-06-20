"use client";

import { useState, useEffect } from "react";
import { DashboardStats } from "@/types"; 


export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://tfg-api.angeloyo.com/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('Error al cargar estadísticas');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8.6rem)] bg-white flex py-8 md:py-12 lg:py-16 xl:py-20 justify-center ">
        {/* <p className="text-gray-600">Cargando estadísticas...</p> */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-8.6rem)] bg-white flex py-8 md:py-12 lg:py-16 xl:py-20 justify-center ">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-[calc(100vh-8.6rem)] bg-white flex py-8 md:py-12 lg:py-16 xl:py-20 justify-center ">
        <p className="text-gray-600">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8.6rem)] bg-white py-8 md:py-12 lg:py-16 xl:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-xl sm:text-2xl font-light text-black mb-2">
            Dashboard
          </h1>
        </div>

        {/* Estadísticas principales - Grid de 2 columnas en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl mx-auto">
          
          {/* Pacientes totales */}
          <div className="flex justify-between items-center">
            <span className="text-base font-light text-gray-700">
              Pacientes totales
            </span>
            <span className="text-lg font-light text-black">
              {stats.total_patients.toLocaleString()}
            </span>
          </div>

          {/* Ingresos hospitalarios */}
          <div className="flex justify-between items-center">
            <span className="text-base font-light text-gray-700">
              Ingresos hospitalarios
            </span>
            <span className="text-lg font-light text-black">
              {stats.total_admissions.toLocaleString()}
            </span>
          </div>

          {/* Estancias en UCI */}
          <div className="flex justify-between items-center">
            <span className="text-base font-light text-gray-700">
              Estancias en UCI
            </span>
            <span className="text-lg font-light text-black">
              {stats.total_icu_stays.toLocaleString()}
            </span>
          </div>

          {/* Total análisis laboratorio */}
          <div className="flex justify-between items-center">
            <span className="text-base font-light text-gray-700">
              Análisis de laboratorio
            </span>
            <span className="text-lg font-light text-black">
              {stats.total_lab_tests.toLocaleString()}
            </span>
          </div>

          {/* Total diagnósticos */}
          <div className="flex justify-between items-center">
            <span className="text-base font-light text-gray-700">
              Diagnósticos registrados
            </span>
            <span className="text-lg font-light text-black">
              {stats.total_diagnoses.toLocaleString()}
            </span>
          </div>

          {/* Mortalidad hospitalaria */}
          <div className="flex justify-between items-center">
            <span className="text-base font-light text-gray-700">
              Mortalidad hospitalaria
            </span>
            <span className="text-lg font-light text-black">
              {stats.mortality_rate}%
            </span>
          </div>

          {/* Pacientes masculinos */}
          <div className="flex justify-between items-center">
            <span className="text-base font-light text-gray-700">
              Pacientes masculinos
            </span>
            <span className="text-lg font-light text-black">
              {stats.male_percentage}%
            </span>
          </div>

          {/* Ingresos de emergencia */}
          <div className="flex justify-between items-center">
            <span className="text-base font-light text-gray-700">
              Ingresos de emergencia
            </span>
            <span className="text-lg font-light text-black">
              {stats.emergency_rate}%
            </span>
          </div>

          {/* Edad promedio */}
          <div className="flex justify-between items-center">
            <span className="text-base font-light text-gray-700">
              Edad promedio
            </span>
            <span className="text-lg font-light text-black">
              {stats.avg_patient_age.toLocaleString()} años
            </span>
          </div>

          {/* Estancia promedio */}
          <div className="flex justify-between items-center">
            <span className="text-base font-light text-gray-700">
              Estancia promedio
            </span>
            <span className="text-lg font-light text-black">
              {stats.avg_length_of_stay.toLocaleString()} días
            </span>
          </div>

        </div>

        {/* Espacio para futuras adiciones */}
        <div className="mt-16">
          {/* Aquí irán los enlaces a gráficas específicas */}
        </div>

      </div>
    </div>
  );
} 