"use client";

import { useState, useEffect } from "react";
import ICUStayChart from "@/components/charts/ICUStayChart";
import { ICUStayData } from "@/types";

export default function ICUStayDurationPage() {
  const [data, setData] = useState<ICUStayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://tfg-api.angeloyo.com/api/charts/icu-stay-duration');
        if (!response.ok) throw new Error('Error al cargar datos');
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="py-8 md:py-12 lg:py-16 xl:py-20 justify-center flex">Cargando...</div>;
  if (error) return <div className="py-8 md:py-12 lg:py-16 xl:py-20 justify-center flex text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-[calc(100vh-8.6rem)] bg-white py-8 md:py-12 lg:py-16 xl:py-20 justify-center flex">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-xl font-light text-black mb-8">
          Estancia Promedio por Unidad UCI
        </h1>
        <ICUStayChart data={data} />
      </div>
    </div>
  );
} 