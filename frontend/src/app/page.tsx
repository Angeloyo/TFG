import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-light tracking-tight text-black">
          MIMIC-IV Analytics
        </h1>
        <p className="mt-4 text-lg text-gray-600 font-light">
          Clinical Data Visualization Platform
        </p>
      </div>
    </div>
  );
}
