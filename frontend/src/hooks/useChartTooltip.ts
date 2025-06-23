import { useState } from 'react';

export function useChartTooltip<T>() {
  const [hoveredData, setHoveredData] = useState<T | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const showTooltip = (data: T, x: number, y: number) => {
    setHoveredData(data);
    setTooltipPosition({ x, y });
  };

  const hideTooltip = () => {
    setHoveredData(null);
  };

  const updateTooltipPosition = (x: number, y: number) => {
    setTooltipPosition({ x, y });
  };

  return {
    hoveredData,
    tooltipPosition,
    showTooltip,
    hideTooltip,
    updateTooltipPosition
  };
} 