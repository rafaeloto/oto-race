import Link from 'next/link';
import Image from 'next/image';
import { OpenF1API, type Pilot } from '@/lib/openf1';
// import HowItWorks from '@/components/HowItWorks';

export default async function Home() {
  const pilots = await OpenF1API.getDrivers();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8 space-y-10">
        {/* Header */}
        <div className="w-fit mx-auto flex items-start justify-center">
          <Image
            src="/images/logo.png"
            alt="oto-race-logo"
            width={200}
            height={100}
            loading="eager"
          />
        </div>

        {/* TODO: Bring this back if it's ever needed */}
        {/* Instructions */}
        {/* <HowItWorks /> */}

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
        <div className="flex items-center justify-center gap-4 text-xs text-center mt-12 text-gray-500 border-t border-gray-600 pt-4">
          <div>
            <p className='mt-2'><strong>Dados:</strong></p>
            <p><a href="https://openf1.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">OpenF1 API</a></p>
          </div>
          <div>
            <p className='mt-2'><strong>Sons:</strong></p>
            <p><a href="https://freesound.org/people/Geoff-Bremner-Audio/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Geoff-Bremner-Audio</a> - <a href="https://freesound.org/s/752118/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Licença: Creative Commons 0</a></p>
            <p><a href="https://freesound.org/people/humanoide9000/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">humanoide9000</a> - <a href="https://freesound.org/s/769113/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Licença: Attribution 4.0</a></p>
          </div>
          <div>
            <p className='mt-2'><strong>ícone:</strong></p>
            <p><a href="https://www.flaticon.com/free-icons/sports-and-competition" title="sports and competition icons" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Sports and competition icons created by IYIKON - Flaticon</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
