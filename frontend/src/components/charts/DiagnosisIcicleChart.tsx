"use client";

import { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import ChartTooltip from '@/components/ui/ChartTooltip';
import { useChartTooltip } from '@/hooks/useChartTooltip';

interface IcicleNode {
  name: string;
  value?: number;
  children?: IcicleNode[];
}

interface IcicleData {
  name: string;
  children: Array<{
    name: string;
    value: number;
  }>;
}

interface ExtendedHierarchyNode extends d3.HierarchyRectangularNode<IcicleNode> {
  target?: {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
  };
}

interface TooltipData {
  name: string;
  value: number;
  fullPath: string;
}

export default function DiagnosisIcicleChart() {
  const { hoveredData, tooltipPosition, showTooltip, hideTooltip, updateTooltipPosition, containerRef } = useChartTooltip<TooltipData>({ autoHide: true });
  const [data, setData] = useState<IcicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://tfg-api.angeloyo.com/api/charts/diagnosis-icicle');
        // const response = await fetch('http://localhost:8088/api/charts/diagnosis-icicle');
        
        if (!response.ok) {
          throw new Error('Error al cargar datos');
        }

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

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Limpiar SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Configuración Icicle Zoomable
    const width = 928;
    const height = 1200;
    const format = d3.format(",d");

    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

    // Compute the layout
    const hierarchy = d3.hierarchy(data as IcicleNode)
      // Solo sumar hojas para evitar doble conteo (los padres ya agregan a hijos)
      .sum(d => (d.children && d.children.length ? 0 : (d.value || 0)))
      .sort((a, b) => b.height - a.height || (b.value || 0) - (a.value || 0));
    const root = d3.partition<IcicleNode>()
      .size([height, (hierarchy.height + 1) * width / 3])
      (hierarchy) as ExtendedHierarchyNode;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Append cells
    const cell = svg
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `translate(${d.y0},${d.x0})`);

    const rect = cell.append("rect")
      .attr("width", d => d.y1 - d.y0 - 1)
      .attr("height", d => rectHeight(d))
      .attr("fill-opacity", 0.6)
      .attr("fill", (d: ExtendedHierarchyNode) => {
        if (!d.depth) return "#ccc";
        let currentNode = d;
        while (currentNode.depth > 1 && currentNode.parent) {
          currentNode = currentNode.parent as ExtendedHierarchyNode;
        }
        return color(currentNode.data.name);
      })
      .style("cursor", "pointer")
      .on("mouseenter", function(event: MouseEvent, d: ExtendedHierarchyNode) {
        const tooltipData: TooltipData = {
          name: d.data.name,
          value: d.value || 0,
          fullPath: ""
        };
        showTooltip(tooltipData, event.clientX, event.clientY);
      })
      .on("mousemove", function(event: MouseEvent) {
        updateTooltipPosition(event.clientX, event.clientY);
      })
      .on("mouseleave", function() {
        hideTooltip();
      })


    const text = cell.append("text")
      .style("user-select", "none")
      .style("pointer-events", "none")
      .attr("x", 4)
      .attr("y", 13)
      .attr("fill-opacity", (d: ExtendedHierarchyNode) => +labelVisible(d));

    text.append("tspan")
      .style("pointer-events", "none")
      .text((d: ExtendedHierarchyNode) => truncateText(d.data.name, d.y1 - d.y0));

    const tspan = text.append("tspan")
      .style("pointer-events", "none")
      .attr("fill-opacity", (d: ExtendedHierarchyNode) => labelVisible(d) * 0.7)
      .text((d: ExtendedHierarchyNode) => ` ${format(d.value || 0)}`);

    // Zoom functionality - DENTRO del useEffect para acceso a variables
    let focus = root;
    
    // @ts-expect-error d3 passes a custom event and node type incompatible with TS DOM typings
    function clicked(event, p) {
      // console.log("🎯 CLICK DETECTADO:", p.data.name);
      
      // LÓGICA EXACTA DEL EJEMPLO DE D3
      focus = focus === p ? p = p.parent : p;

      root.each(d => d.target = {
        x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
        x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
        y0: d.y0 - p.y0,
        y1: d.y1 - p.y0
      });

      const t = cell.transition().duration(750)
          .attr("transform", d => `translate(${d.target?.y0 || 0},${d.target?.x0 || 0})`);

      rect.transition(t).attr("height", d => rectHeight(d.target || d));
      text.transition(t).attr("fill-opacity", d => +labelVisible(d.target || d));
      tspan.transition(t).attr("fill-opacity", d => labelVisible(d.target || d) * 0.7);
      
      // console.log("Zoom aplicado!");
    }

    function rectHeight(d: { x0: number; x1: number }) {
      return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
    }

    function labelVisible(d: { y0: number; y1: number; x0: number; x1: number }): number {
      return (d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16) ? 1 : 0;
    }

    function truncateText(text: string, availableWidth: number): string {
      // Estimar caracteres que pueden caber (aproximadamente 6px por carácter con font 10px)
      const charWidth = 6;
      const padding = 8; // padding del texto
      const maxChars = Math.floor((availableWidth - padding) / charWidth);
      
      if (text.length <= maxChars || maxChars <= 3) {
        return text;
      }
      
      return text.substring(0, maxChars - 3) + "...";
    }

    // CONECTAR EL CLICK DESPUÉS DE DEFINIR LA FUNCIÓN
    rect.on("click", clicked);



  }, [data]);

  if (loading) {
    return (
      <div className="relative">
        <div className="flex justify-center" style={{ width: '928px' }}>
          <div className="flex items-center justify-center w-full">
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 justify-center flex">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-center" ref={containerRef}>
        <svg ref={svgRef}></svg>
      </div>
      
      <ChartTooltip
        visible={!!hoveredData}
        x={tooltipPosition.x}
        y={tooltipPosition.y}
      >
        {hoveredData && (
          <div className="space-y-1">
            <div className="font-semibold">{hoveredData.name}</div>
            <div className="text-sm text-gray-600">Casos: {hoveredData.value.toLocaleString()}</div>
          </div>
        )}
      </ChartTooltip>
    </div>
  );
}
