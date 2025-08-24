import ICUStayChart from "@/components/charts/ICUStayChart";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ICUStayDurationPage() {
  return (
    <div className="min-h-[calc(100vh-8.6rem)] bg-white py-8 md:py-12 lg:py-16 xl:py-20 justify-center flex">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Back to Dashboard Link */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800 group"
          >
            <ArrowLeft className="w-3 h-3 text-gray-400 group-hover:text-gray-600 group-hover:-translate-x-1 transition-all duration-200 mr-2" />
            <span className="text-sm font-light">
              Volver
            </span>
          </Link>
        </div>
        
        <h1 className="text-xl font-light text-black mb-8 text-center">
          Estancia Promedio por Unidad UCI
        </h1>
        <ICUStayChart />
      </div>
    </div>
  );
} 