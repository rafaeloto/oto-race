'use client';

import { useState, useEffect, useRef } from 'react';
import type {
  Pilot,
  OpenF1Meeting,
  OpenF1SessionResult,
  OpenF1ChampionshipTeam,
  OpenF1ChampionshipDriver
} from '@/lib/openf1';
import Image from 'next/image';

interface PilotPageProps {
  pilot: Pilot;
  meeting: OpenF1Meeting | null;
  latestSessionResult: OpenF1SessionResult | null;
  championshipTeams: OpenF1ChampionshipTeam[];
  championshipDrivers: OpenF1ChampionshipDriver[];
  allDrivers: Pilot[];
}

export default function PilotPage({
  pilot,
  meeting,
  latestSessionResult,
  championshipTeams,
  championshipDrivers,
  allDrivers
}: PilotPageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        return;
      }

      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setAudioError(true);
      });
    }
  };

  const handleDiscover = () => {
    // Show content immediately
    setShowContent(true);

    // Start audio immediately when user discovers content
    const audio = audioRef.current;
    if (audio && !isPlaying && !audioError) {
      audio.muted = true;
      audio.play().then(() => {
        setTimeout(() => {
          if (audio) {
            audio.muted = false;
          }
        }, 100);
      }).catch(err => {
        console.error('Error playing after discover:', err);
        setAudioError(true);
      });
    }
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return "-";

    const formatDigits = (value: number) => value.toString().padStart(2, '0');

    return `${formatDigits(Math.floor(seconds / 3600))}
    :${formatDigits(Math.floor((seconds % 3600) / 60))}
    :${formatDigits(Math.floor(seconds % 60))}`;
  };

  const formatGap = (gap: number | string | null) => {
    if (!gap) return "-";

    if (typeof gap === 'string') return gap;

    return `+${gap}s`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <audio ref={audioRef} src='/audio/oto-race-theme.mp3' loop muted />

      <div className="flex flex-col flex-1 mx-auto px-4 py-8 relative">
        {/* Header */}
        <div className="w-fit mx-auto flex items-start justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="oto-race-logo"
            width={200}
            height={100}
            loading="eager"
            className="mx-auto"
          />
        </div>

        {/* Discover Screen */}
        {!showContent && (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 mb-40">
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-18 h-18 rounded-full flex items-center justify-center text-4xl font-bold"
                style={{ backgroundColor: pilot.teamColour ? `#${pilot.teamColour}80` : undefined }}
              >
                {pilot.number}
              </div>
              <h2 className="text-3xl font-bold text-white">{pilot.name}</h2>
              <p className="text-gray-400 text-lg">{pilot.team}</p>
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={handleDiscover}
                className="px-8 py-4 cursor-pointer bg-linear-to-r from-red-500 to-red-700 text-white font-bold rounded-full text-lg hover:scale-105 transition-all duration-300 animate-bounce"
              >
                🏁 Descobrir
              </button>

              <p className="text-gray-500 text-sm">
                Clique para explorar o mundo da Fórmula 1
              </p>
            </div>
          </div>
        )}

        {/* Music Toggle */}
        {showContent && !audioError && (
          <button
            onClick={toggleAudio}
            className={`absolute cursor-pointer top-4 right-4 w-12 h-12 rounded-full transition-all duration-300 
              ${isPlaying
                ? 'bg-gray-600 hover:bg-gray-700'
                : 'bg-gray-600 hover:bg-gray-700'
              }`}
          >
            {isPlaying ? (
              <span className="text-xl">🔊</span>
            ) : (
              <span className="text-xl">🔈</span>
            )}
          </button>
        )}

        {/* Pilot Info */}
        {showContent && (
          <div className='space-y-6'>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">

                    {/* PILOT INFO */}
                    <div className="flex items-center gap-4 mb-4">
                      {pilot.headshotUrl && (
                        <Image
                          src={pilot.headshotUrl}
                          alt={pilot.name}
                          width={70}
                          height={70}
                          className="rounded-full"
                          loading="eager"
                        />
                      )}

                      <div>
                        <h2 className="text-xl font-bold">{pilot.name}</h2>
                        <p className="text-gray-400">{pilot.team}</p>
                      </div>

                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                        style={{ backgroundColor: pilot.teamColour ? `#${pilot.teamColour}80` : undefined }}
                      >
                        {pilot.number}
                      </div>
                    </div>

                    {/* Latest Session Results */}
                    {latestSessionResult && meeting && (
                      <div className="mt-6 p-4">
                        <h3 className="text-2xl font-bold mb-6 text-center">Última Corrida</h3>

                        {/* Race Images */}
                        <div className="flex items-center justify-center gap-4 mb-4">
                          {meeting.circuit_image && (
                            <Image
                              src={meeting.circuit_image}
                              alt={`${meeting.circuit_short_name} Circuit`}
                              width={180}
                              height={120}
                              className="rounded-lg object-cover"
                              loading="eager"
                            />
                          )}

                          {meeting.country_flag && (
                            <Image
                              src={meeting.country_flag}
                              alt={`${meeting.country_name} Flag`}
                              width={100}
                              height={80}
                              className="rounded-lg object-cover"
                              loading="eager"
                            />
                          )}
                        </div>

                        {/* Circuit & Location Info */}
                        <div className="flex flex-col gap-2 mb-14">
                          <div className="text-center">
                            <p className="text-xl font-bold text-gray-300">{meeting.meeting_name.toUpperCase()}</p>
                            <p className="text-gray-400">{new Date(meeting.date_end).toLocaleDateString('pt-BR')}</p>
                            <p className="text-gray-300">{meeting.location}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className='flex items-center justify-center gap-2'>
                              <h4 className="font-semibold text-red-500">Circuito</h4>
                              <p className="text-gray-300">{meeting.circuit_short_name}</p>
                            </div>

                            <div className='flex items-center justify-center gap-2'>
                              <h4 className="font-semibold text-red-500">Tipo</h4>
                              <p className="text-gray-300">{meeting.circuit_type}</p>
                            </div>
                          </div>
                        </div>

                        {/* Session Results Grid */}
                        <div className="flex items-center justify-center gap-4 mb-6">
                          <h3 className="text-2xl font-bold text-center">Resultado do piloto:</h3>

                          {!!latestSessionResult.position && (
                            <div className="px-3 py-2 rounded-full border-2 border-gray-500 flex items-center justify-center">
                              <p className="font-bold text-xl">{latestSessionResult.position}º</p>
                            </div>
                          )}

                          {latestSessionResult.dnf && (
                            <div className="px-4 py-2 rounded-full border-2 border-red-500 flex items-center justify-center">
                              <p className="font-bold text-xl">DNF</p>
                            </div>
                          )}
                          {latestSessionResult.dns && (
                            <div className="px-4 py-2 rounded-full border-2 border-yellow-500 flex items-center justify-center">
                              <p className="font-bold text-xl">DNS</p>
                            </div>
                          )}
                          {latestSessionResult.dsq && (
                            <div className="px-4 py-2 rounded-full border-2 border-blue-500 flex items-center justify-center">
                              <p className="font-bold text-xl">DSQ</p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="text-center">
                            <p className="text-lg text-gray-400">Pontos</p>
                            <p className="font-bold text-xl">{latestSessionResult.points}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg text-gray-400">Tempo</p>
                            <p className="font-bold text-xl">
                              {formatTime(latestSessionResult.duration)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg text-gray-400">Gap para o líder</p>
                            <p className="font-bold text-xl">
                              {formatGap(latestSessionResult.gap_to_leader)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg text-gray-400">Voltas</p>
                            <p className="font-bold text-xl">{latestSessionResult.number_of_laps || '-'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Teams Championship Table */}
                    {championshipTeams && championshipTeams.length > 0 && (
                      <div className="mt-6 p-4">
                        <h3 className="text-2xl font-bold mb-6 text-center">Campeonato de Construtores</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-600">
                                <th className="text-left py-2 px-3">Pos</th>
                                <th className="text-left py-2 px-3">Equipe</th>
                                <th className="text-center py-2 px-3">Pontos</th>
                              </tr>
                            </thead>
                            <tbody>
                              {championshipTeams.map((team) => (
                                <tr key={team.team_name}
                                  className="border-b border-gray-700 hover:bg-gray-800/50 h-16"
                                  {...team.team_name === pilot.team && { style: { backgroundColor: `#${pilot.teamColour}80` } }}
                                >
                                  <td className="py-2 px-3 font-bold">
                                    {team.position_current}º
                                    {team.position_current < team.position_start && (
                                      <span className="text-base ml-2 text-green-500">↑{team.position_start - team.position_current}</span>
                                    )}
                                    {team.position_current > team.position_start && (
                                      <span className="text-base ml-2 text-red-500">↓{team.position_current - team.position_start}</span>
                                    )}
                                  </td>
                                  <td className="py-2 px-3 font-semibold">{team.team_name}</td>
                                  <td className="text-center py-2 px-3 font-bold">
                                    {team.points_current}
                                    {team.points_current > team.points_start && (
                                      <span className="text-base ml-2 text-green-500">+{team.points_current - team.points_start}</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Drivers Championship Table */}
                    {championshipDrivers && championshipDrivers.length > 0 && (
                      <div className="mt-6 p-4">
                        <h3 className="text-2xl font-bold mb-6 text-center">Campeonato de Pilotos</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-600">
                                <th className="text-left py-2 px-3">Pos</th>
                                <th className="text-left py-2 px-3">Piloto</th>
                                <th className="text-center py-2 px-3">Pontos</th>
                              </tr>
                            </thead>
                            <tbody>
                              {championshipDrivers.map((driver) => {
                                const driverPilot = allDrivers.find(p => p.number === driver.driver_number);
                                return (
                                  <tr key={driver.driver_number}
                                    className="border-b border-gray-700 hover:bg-gray-800/50"
                                    {...driver.driver_number === pilot.number && { style: { backgroundColor: `#${pilot.teamColour}80` } }}
                                  >
                                    <td className="py-2 px-3 font-bold">
                                      {driver.position_current}º
                                      {driver.position_current < driver.position_start && (
                                        <span className="text-base ml-2 text-green-500">↑{driver.position_start - driver.position_current}</span>
                                      )}
                                      {driver.position_current > driver.position_start && (
                                        <span className="text-base ml-2 text-red-500">↓{driver.position_current - driver.position_start}</span>
                                      )}
                                    </td>
                                    <td className="flex gap-2 items-center py-2 px-3 font-semibold">
                                      {driverPilot?.headshotUrl && (
                                        <Image
                                          src={driverPilot.headshotUrl}
                                          alt={driverPilot.name}
                                          width={50}
                                          height={50}
                                          className="rounded-full"
                                          loading="eager"
                                        />
                                      )}
                                      {driverPilot?.acronym || `#${driver.driver_number}`}
                                    </td>
                                    <td className="text-center py-2 px-3 font-bold">
                                      {driver.points_current}
                                      {driver.points_current > driver.points_start && (
                                        <span className="text-base ml-2 text-green-500">+{driver.points_current - driver.points_start}</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 text-xs text-center mt-12 text-gray-500 border-t border-gray-600 pt-4">
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
    </div >
  );
}
