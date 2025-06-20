"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [patientId, setPatientId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (patientId.trim() && /^\d+$/.test(patientId.trim())) {
      router.push(`/patient/${patientId.trim()}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8.6rem)] bg-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-light text-black mb-2">
              Buscar Paciente
            </h1>
            <p className="text-gray-600">
              Introduce el ID del paciente para ver su información
            </p>
          </div>

          {/* Formulario de búsqueda */}
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
                ID del Paciente
              </label>
              <input
                type="text"
                id="patientId"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Ej: 10003400"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-colors"
              />
            </div>
            
            <button
              type="submit"
              disabled={!patientId.trim() || !/^\d+$/.test(patientId.trim())}
              className="w-full py-3 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Buscar Paciente
            </button>
          </form>

          {/* Validación visual */}
          {patientId.trim() && !/^\d+$/.test(patientId.trim()) && (
            <p className="mt-2 text-sm text-red-600">
              El ID debe contener solo números
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 