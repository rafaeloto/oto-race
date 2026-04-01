import { notFound } from 'next/navigation';
import { OpenF1API } from '@/lib/openf1';
import PilotPage from '@/components/PilotPage';

interface PilotPageRouteProps {
  params: {
    id: string;
  };
}

export default async function PilotPageRoute({ params }: PilotPageRouteProps) {
  const { id } = await params;
  const pilot = await OpenF1API.findDriverById(id);

  if (!pilot) {
    notFound();
  }

  const lastRace = await OpenF1API.getLastRace();

  if (!lastRace?.meeting_key || !lastRace?.session_key) {
    notFound();
  }

  const meeting = await OpenF1API.getMeetingByKey(lastRace.meeting_key);
  const latestSessionResult = await OpenF1API.getSessionResult(pilot.number, lastRace.session_key);
  const championshipTeams = await OpenF1API.getChampionshipTeams(lastRace.session_key);
  const championshipDrivers = await OpenF1API.getChampionshipDrivers(lastRace.session_key);
  const allDrivers = await OpenF1API.getDrivers();

  return (
    <PilotPage
      pilot={pilot}
      meeting={meeting}
      latestSessionResult={latestSessionResult}
      championshipTeams={championshipTeams}
      championshipDrivers={championshipDrivers}
      allDrivers={allDrivers}
    />
  );
}

export async function generateStaticParams() {
  const pilots = [
    'pierre-gasly',
    'franco-colapinto',
    'fernando-alonso',
    'lance-stroll',
    'gabriel-bortoleto',
    'nico-hulkenberg',
    'sergio-perez',
    'valtteri-bottas',
    'charles-leclerc',
    'lewis-hamilton',
    'esteban-ocon',
    'oliver-bearman',
    'lando-norris',
    'oscar-piastri',
    'kimi-antonelli',
    'george-russell',
    'liam-lawson',
    'arvid-lindblad',
    'max-verstappen',
    'isack-hadjar',
    'alexander-albon',
    'carlos-sainz',
  ];

  return pilots.map((id) => ({
    id: id,
  }));
}
