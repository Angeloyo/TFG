import Link from "next/link";
import { Search, Gauge } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Título / Logo */}
        <Link href="/" className="text-lg sm:text-xl font-light text-black hover:text-gray-700 transition-colors">
          MIMIC-IV Analytics
        </Link>
        
        {/* Navegación */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/dashboard" 
            className="p-2 text-gray-600 hover:text-black transition-colors"
            title="Dashboard"
          >
            <Gauge size={20} />
          </Link>
          <Link 
            href="/search" 
            className="p-2 text-gray-600 hover:text-black transition-colors"
            title="Buscar paciente"
          >
            <Search size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
} 