"use client";

import { useState, useEffect } from "react";
import { AgeDistributionData } from "@/types";
import AgeDistributionChart from "@/components/charts/AgeDistributionChart";

export default function AgeDistributionPage() {
  const [dataRanges, setDataRanges] = useState<AgeDistributionData[]>([]);
  const [dataDetailed, setDataDetailed] = useState<AgeDistributionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hacer ambas llamadas en paralelo
        const [responseRanges, responseDetailed] = await Promise.all([
          fetch('https://tfg-api.angeloyo.com/api/charts/age-distribution'),
          fetch('https://tfg-api.angeloyo.com/api/charts/age-distribution?detailed=true')
        ]);

        if (!responseRanges.ok || !responseDetailed.ok) {
          throw new Error('Error al cargar datos');
        }

        const [resultRanges, resultDetailed] = await Promise.all([
          responseRanges.json(),
          responseDetailed.json()
        ]);

        setDataRanges(resultRanges.data);
        setDataDetailed(resultDetailed.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8.6rem)] bg-white py-8 md:py-12 lg:py-16 xl:py-20 justify-center flex">
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-8.6rem)] bg-white py-8 md:py-12 lg:py-16 xl:py-20 justify-center flex">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8.6rem)] py-8 md:py-12 lg:py-16 xl:py-20 justify-center flex">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-xl sm:text-2xl font-light text-black mb-2">
            Distribución por Edad y Género
          </h1>
          <p className="text-gray-600 text-sm">
            Population pyramid
          </p>
        </div>

        {/* Charts Stack */}
        <div className="space-y-16">
          
          {/* Chart 1: Por Rangos */}
          <div className="space-y-4">
            <h3 className="text-lg font-light text-center text-gray-800">
              Por Rangos de Edad
            </h3>
            <div className="flex justify-center">
              <AgeDistributionChart data={dataRanges} />
            </div>
          </div>

          {/* Chart 2: Detallado */}
          <div className="space-y-4">
            <h3 className="text-lg font-light text-center text-gray-800">
              Por Edad Específica (18-90)
            </h3>
            <div className="flex justify-center">
              <AgeDistributionChart data={dataDetailed} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
} 