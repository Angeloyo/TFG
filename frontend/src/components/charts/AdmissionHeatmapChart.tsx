"use client";

import { useEffect, useState } from 'react';
import * as Plot from '@observablehq/plot';
import { AdmissionHeatmapData } from '@/types';
import ChartTooltip from '@/components/ui/ChartTooltip';
import { useChartTooltip } from '@/hooks/useChartTooltip';

export default function AdmissionHeatmapChart() {
  const { hoveredData, tooltipPosition, showTooltip, containerRef } = useChartTooltip<AdmissionHeatmapData>({ autoHide: true });
  const [data, setData] = useState<AdmissionHeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [filterMidnight, setFilterMidnight] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://tfg-api.angeloyo.com/api/charts/admission-heatmap?filter_midnight=${filterMidnight}`;
        const response = await fetch(url);
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingFilter(false);
      }
    };
    fetchData();
  }, [filterMidnight]);

  useEffect(() => {
    if (!data.length || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    const plot = Plot.plot({
      width: 700,
      height: 250,
      marginLeft: 50,
      marginBottom: 40,
      x: { label: "Hora del día", domain: Array.from({length: 24}, (_, i) => i) },
      y: { 
        label: "Día de la semana",
        domain: [2, 3, 4, 5, 6, 7, 1],
        tickFormat: (d: number) => ({2: "Lun", 3: "Mar", 4: "Mié", 5: "Jue", 6: "Vie", 7: "Sáb", 1: "Dom"} as Record<number, string>)[d]
      },
      color: { scheme: "blues", legend: true },
      marks: [
        Plot.cell(data, {
          x: "hour",
          y: "dayOfWeek", 
          fill: "count"
        })
      ]
    });

    containerRef.current.appendChild(plot);

    // Añadir tooltips a las celdas
    const cells = plot.querySelectorAll('rect[fill]');
    cells.forEach((cell, index) => {
      const cellData = data[index];
      if (cellData) {
        cell.addEventListener('mouseenter', (e) => {
          showTooltip(cellData, (e as MouseEvent).clientX, (e as MouseEvent).clientY);
        });
        cell.addEventListener('mousemove', (e) => {
          showTooltip(cellData, (e as MouseEvent).clientX, (e as MouseEvent).clientY);
        });
        // Eliminar mouseleave manual - ahora lo maneja autoHide
      }
    });

    return () => plot.remove();
  }, [data, showTooltip]);

  if (loading) {
    return (
      <div className="py-8 justify-center flex">
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={containerRef} />
      
      {/* Controles de filtrado */}
      <div className="mt-4 text-sm text-gray-600 space-y-2">
        {loadingFilter ? (
          <p className="text-gray-600">
            Cargando...
          </p>
        ) : filterMidnight ? (
          <p>
            Se han filtrado los ingresos registrados a las 00:00:00 por no ser informativos.{' '}
            <button 
              onClick={() => {
                setLoadingFilter(true);
                setFilterMidnight(false);
              }}
              className="underline text-gray-700 hover:text-gray-900"
            >
              Mostrar todos los datos
            </button>
          </p>
        ) : (
          <p>
            Mostrando todos los ingresos.{' '}
            <button 
              onClick={() => {
                setLoadingFilter(true);
                setFilterMidnight(true);
              }}
              className="underline text-gray-700 hover:text-gray-900"
            >
              Filtrar medianoche
            </button>
          </p>
        )}
      </div>
      
      <ChartTooltip
        visible={!!hoveredData}
        x={tooltipPosition.x}
        y={tooltipPosition.y}
      >
        {hoveredData && (
          <div>
            <div className="font-medium">
              {({2: "Lunes", 3: "Martes", 4: "Miércoles", 5: "Jueves", 6: "Viernes", 7: "Sábado", 1: "Domingo"} as Record<number, string>)[hoveredData.dayOfWeek]} - {hoveredData.hour}:00h
            </div>
            <div>
              {hoveredData.count.toLocaleString()} ingresos
            </div>
          </div>
        )}
      </ChartTooltip>
    </div>
  );
} 