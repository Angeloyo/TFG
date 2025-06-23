"use client";

import { useEffect, useRef, useState } from 'react';
import * as Plot from '@observablehq/plot';
import { ICUStayData } from '@/types';
import ChartTooltip from '@/components/ui/ChartTooltip';
import { useChartTooltip } from '@/hooks/useChartTooltip';

interface ICUStayChartProps {
  data: ICUStayData[];
}

export default function ICUStayChart({ data }: ICUStayChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hoveredData, tooltipPosition, showTooltip, hideTooltip } = useChartTooltip<ICUStayData>();
  const [showAll, setShowAll] = useState(false);
  const [threshold, setThreshold] = useState(500);

  // Filtrar datos según el threshold
  const filteredData = showAll ? data : data.filter(d => d.total_stays >= threshold);
  const hiddenCount = data.length - filteredData.length;

  useEffect(() => {
    if (!filteredData.length || !containerRef.current) return;

    // Limpiar el contenedor
    containerRef.current.innerHTML = '';

    const plot = Plot.plot({
      marginLeft: 250,
      height: 500,
      x: { 
        label: "Estancia promedio (días)",
        grid: true 
      },
      y: { 
        label: null 
      },
      marks: [
        Plot.barX(filteredData, {
          x: "avg_stay_days",
          y: "careunit",
          fill: "#374151",
          sort: { y: "x", reverse: true },
        })
      ]
    });

    containerRef.current.appendChild(plot);

    // Añadir event listeners a las barras
    const bars = plot.querySelectorAll('rect');
    bars.forEach((bar, index) => {
      const dataItem = filteredData.find(d => d.careunit === bar.getAttribute('aria-label')?.split(',')[0]) || filteredData[index];
      
      bar.addEventListener('mouseenter', (e) => {
        showTooltip(dataItem, e.clientX, e.clientY);
      });
      
      bar.addEventListener('mouseleave', () => {
        hideTooltip();
      });
    });

    return () => {
      plot.remove();
    };
  }, [filteredData]);

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setThreshold(value);
  };

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full" />
      
      {/* Controles de filtrado */}
      <div className="mt-4 text-sm text-gray-600 space-y-2">
        {!showAll && hiddenCount > 0 && (
          <p>
            Se han ocultado {hiddenCount} unidades con menos de {threshold} estancias.{' '}
            <button 
              onClick={() => setShowAll(true)}
              className="underline text-gray-700 hover:text-gray-900"
            >
              Ver todas
            </button>
          </p>
        )}
        
        {showAll && (
          <p>
            Mostrando todas las {data.length} unidades.{' '}
            <button 
              onClick={() => setShowAll(false)}
              className="underline text-gray-700 hover:text-gray-900"
            >
              Ocultar unidades pequeñas
            </button>
          </p>
        )}
        
        <div className="flex items-center gap-2">
          <label htmlFor="threshold" className="text-gray-700">
            Threshold mínimo:
          </label>
          <input
            id="threshold"
            type="number"
            value={threshold}
            onChange={handleThresholdChange}
            min="1"
            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
          />
          <span className="text-gray-600">estancias</span>
        </div>
      </div>
      
      <ChartTooltip
        visible={!!hoveredData}
        x={tooltipPosition.x}
        y={tooltipPosition.y}
      >
        {hoveredData && (
          <div>
            <div>Total estancias: {hoveredData.total_stays.toLocaleString()}</div>
            <div>Estancia promedio: {hoveredData.avg_stay_days.toFixed(2)} días</div>
          </div>
        )}
      </ChartTooltip>
    </div>
  );
} 