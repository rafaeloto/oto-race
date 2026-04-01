import Link from 'next/link';
import Image from 'next/image';
import { OpenF1API, type Pilot } from '@/lib/openf1';

export default async function Home() {
  const pilots = await OpenF1API.getDrivers();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8 space-y-10">
        {/* Header */}
        <div className="text-center">
          <div className="w-fit mx-auto flex items-start justify-center">
            <Image
              src="/images/logo.png"
              alt="éfium-logo"
              width={200}
              height={100}
              loading="eager"
            />
            <span className="text-white text-xl font-bold">®</span>
          </div>

          <p className="text-gray-400 italic text-lg">Vista a velocidade</p>
        </div>

        {/* Instructions */}
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-4">Como Funciona</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-2xl mb-3 mx-auto">
                  1
                </div>

                <h4 className="text-lg font-semibold mb-2 text-center">Escanear QR Code</h4>

                <p className="text-gray-400 text-center">
                  Escaneie o código QR na sua camisa éfi.um® com o celular
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-2xl mb-3 mx-auto">
                  2
                </div>

                <h4 className="text-lg font-semibold mb-2 text-center">Desbloquear</h4>

                <p className="text-gray-400 text-center">
                  Desbloqueie conteúdos personalizados, feitos especialmente para você
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-2xl mb-3 mx-auto">
                  3
                </div>

                <h4 className="text-lg font-semibold mb-2 text-center">Desfrutar</h4>

                <p className="text-gray-400 text-center">
                  Veja dados em tempo real para os pilotos e seus carros na palma da sua mão
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pilots Grid */}
        <div className="max-w-full mx-auto">
          <h3 className="text-3xl font-bold mb-6 text-center">Pilotos</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {pilots.map((pilot: Pilot) => (
              <Link
                key={pilot.id}
                href={`/pilot/${pilot.id}`}
                className={`flex flex-col justify-between backdrop-blur-lg rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 min-w-[200px]`}
                style={{ backgroundColor: pilot.teamColour ? `#${pilot.teamColour}80` : undefined }}
              >
                <div className="flex items-center gap-4 mb-4">
                  {pilot.headshotUrl && (
                    <Image
                      src={pilot.headshotUrl}
                      alt={pilot.name}
                      width={100}
                      height={100}
                      className="rounded-full"
                      loading="eager"
                    />
                  )}

                  <div className="flex-1">
                    <div className='flex-1 flex items-center gap-2 justify-between'>
                      <h3 className="text-lg font-bold">{pilot.name}</h3>

                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white"
                        style={{ backgroundColor: pilot.teamColour ? `#${pilot.teamColour}` : '#dc2626' }}
                      >
                        {pilot.number}
                      </div>
                    </div>

                    <p className="text-gray-300 text-md">{pilot.team}</p>
                  </div>
                </div>

                <p className="text-gray-300 italic mb-4">
                  &ldquo;{pilot.quote}&rdquo;
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p className="mb-2">Escaneie os QR codes nas camisas éfi.um® para experimentar mais conteúdos como esse</p>
          <p className="mb-2">© 2025 éfi.um® - Vista a Corrida</p>
          <p className="mb-2">Vestuário Premium Inspirado na Fórmula 1</p>

          <div className="border-t border-gray-600 pt-4 mt-4">
            <h4 className="font-semibold mb-2">Créditos</h4>
            <div className="space-y-1 text-xs">
              <p><strong>Dados:</strong> <a href="https://openf1.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">OpenF1 API</a></p>
              <p><strong>Sons:</strong></p>
              <p className="ml-4">• &ldquo;live formula 1 racing 4&rdquo; por <a href="https://freesound.org/people/Geoff-Bremner-Audio/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Geoff-Bremner-Audio</a> - <a href="https://freesound.org/s/752118/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Licença: Creative Commons 0</a></p>
              <p className="ml-4">• &ldquo;Sport News Music&rdquo; por <a href="https://freesound.org/people/humanoide9000/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">humanoide9000</a> - <a href="https://freesound.org/s/769113/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Licença: Attribution 4.0</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
