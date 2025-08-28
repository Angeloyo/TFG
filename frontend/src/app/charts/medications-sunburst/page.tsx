import MedicationsSunburst from '@/components/charts/MedicationsSunburst';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MedicationsSunburstPage() {
  return (
    <div className="min-h-[calc(100vh-8.6rem)] py-8 md:py-12 lg:py-16 xl:py-20 justify-center flex">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-800 gap-2 group">
            <ArrowLeft className="w-3 h-3 text-gray-400 group-hover:text-gray-600 group-hover:-translate-x-1 transition-all duration-200" />
            <span className="text-sm font-light">Volver</span>
          </Link>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-xl sm:text-2xl font-light text-black mb-2">Medicamentos más prescritos por vía</h1>
          <p className="text-gray-600 text-sm">Sunburst</p>
        </div>

        <MedicationsSunburst />
      </div>
    </div>
  );
}


