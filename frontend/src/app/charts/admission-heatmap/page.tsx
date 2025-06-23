import AdmissionHeatmapChart from '@/components/charts/AdmissionHeatmapChart';

export default function AdmissionHeatmapPage() {
  return (
    <div className="min-h-[calc(100vh-8.6rem)] py-8 md:py-12 lg:py-16 xl:py-20 justify-center flex">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-xl sm:text-2xl font-light text-black mb-2">
            Ingresos por Hora y Día de la Semana
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            Heatmap
          </p>


          <div className="space-y-4">
            <AdmissionHeatmapChart />
          </div>
          
        </div>
      </div>
    </div>
  );
} 