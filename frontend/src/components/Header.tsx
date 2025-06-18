import Link from "next/link";
import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Título / Logo */}
        <Link href="/" className="text-xl font-light text-black hover:text-gray-700 transition-colors">
          MIMIC-IV Analytics
        </Link>
        
        {/* Icono de búsqueda */}
        <Link 
          href="/search" 
          className="p-2 text-gray-600 hover:text-black transition-colors"
          title="Buscar paciente"
        >
          <Search size={20} />
        </Link>
      </div>
    </header>
  );
} 