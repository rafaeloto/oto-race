// OpenF1 API integration for oto-race

interface OpenF1Driver {
  broadcast_name: string;
  driver_number: number;
  first_name: string;
  full_name: string;
  headshot_url: string;
  last_name: string;
  meeting_key: number;
  name_acronym: string;
  session_key: number;
  team_colour: string;
  team_name: string;
}

export interface OpenF1Session {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_end: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number;
  session_key: number;
  session_name: string;
  session_type: string;
  year: number;
}

export interface OpenF1Meeting {
  circuit_key: number;
  circuit_info_url: string;
  circuit_image: string;
  circuit_short_name: string;
  circuit_type: string;
  country_code: string;
  country_flag: string;
  country_key: number;
  country_name: string;
  date_end: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  year: number;
}

export interface OpenF1SessionResult {
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  driver_number: number;
  duration: number;
  gap_to_leader: number;
  number_of_laps: number;
  meeting_key: number;
  position: number;
  session_key: number;
  points: number;
}

export interface OpenF1ChampionshipTeam {
  meeting_key: number;
  points_current: number;
  points_start: number;
  position_current: number;
  position_start: number;
  session_key: number;
  team_name: string;
}

export interface OpenF1ChampionshipDriver {
  driver_number: number;
  meeting_key: number;
  points_current: number;
  points_start: number;
  position_current: number;
  position_start: number;
  session_key: number;
}

export interface Pilot {
  id: string;
  name: string;
  acronym: string;
  number: number;
  team: string;
  quote: string;
  headshotUrl?: string;
  teamColour?: string;
}

const API_BASE_URL = 'https://api.openf1.org/v1';

export class OpenF1API {
  // Fetch drivers with cache and processing
  static async getDrivers(): Promise<Pilot[]> {
    try {
      // Native Next.js cache for 5 minutes
      const response = await fetch(`${API_BASE_URL}/drivers?session_key=latest`, {
        next: { revalidate: 300 }, // Cache por 5 minutos
        headers: {
          'User-Agent': 'oto-race-app/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch drivers: ${response.statusText}`);
      }

      const drivers: OpenF1Driver[] = await response.json();

      if (drivers.length === 0) {
        console.warn('No drivers found from OpenF1 API');
        return [];
      }

      // Converter para nosso formato com tratamento de erro e ordenação por equipe
      const pilots = drivers
        .map((driver: OpenF1Driver) => {
          try {
            return this.convertToPilot(driver);
          } catch (error) {
            console.error('Error converting driver:', driver, error);
            return null;
          }
        })
        .filter((pilot: Pilot | null): pilot is Pilot => pilot !== null) // Remover conversões falhadas
        .sort((a: Pilot, b: Pilot) => a.team.localeCompare(b.team)); // Ordenar por nome da equipe

      return pilots;
    } catch (error) {
      console.error('Error fetching real pilots:', error);
      return [];
    }
  }

  // Find specific driver by ID
  static async findDriverById(id: string): Promise<Pilot | undefined> {
    const drivers = await this.getDrivers();
    return drivers.find(driver => driver.id === id);
  }

  // Fetch the last 'Race' session
  static async getLastRace(): Promise<OpenF1Session | null> {
    try {
      // Native Next.js cache for 5 minutes
      const response = await fetch(`${API_BASE_URL}/sessions?session_name=Race&meeting_key=latest`, {
        next: { revalidate: 300 },
        headers: {
          'User-Agent': 'oto-race-app/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch session data: ${response.statusText}`);
      }

      const session: OpenF1Session[] = await response.json();

      if (!session || session.length === 0) {
        console.warn('No session found from OpenF1 API');
        return null;
      }

      return session[0];
    } catch (error) {
      console.error('Error fetching session data:', error);
      return null;
    }
  }

  // Fetch meeting by key
  static async getMeetingByKey(meetingKey: number): Promise<OpenF1Meeting | null> {
    try {
      // Native Next.js cache for 5 minutes
      const response = await fetch(`${API_BASE_URL}/meetings?meeting_key=${meetingKey}`, {
        next: { revalidate: 300 },
        headers: {
          'User-Agent': 'oto-race-app/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch meeting data: ${response.statusText}`);
      }

      const meeting: OpenF1Meeting[] = await response.json();

      if (!meeting || meeting.length === 0) {
        console.warn('No meeting found from OpenF1 API');
        return null;
      }

      return meeting[0];
    } catch (error) {
      console.error('Error fetching meeting data:', error);
      return null;
    }
  }

  // Fetch session result for a specific driver and meeting
  static async getSessionResult(driverNumber: number, sessionKey: number): Promise<OpenF1SessionResult | null> {
    try {
      // Native Next.js cache for 5 minutes
      const response = await fetch(`${API_BASE_URL}/session_result?session_key=${sessionKey}`, {
        next: { revalidate: 300 },
        headers: {
          'User-Agent': 'oto-race-app/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch results data: ${response.statusText}`);
      }

      const results: OpenF1SessionResult[] = await response.json();

      if (results.length === 0) {
        console.warn('No results found from OpenF1 API');
        return null;
      }

      const result = results.find((item: OpenF1SessionResult) => item.driver_number === driverNumber);

      if (!result) {
        console.warn('No result found for driver number', driverNumber);
        return null;
      }

      return result;
    } catch (error) {
      console.error('Error fetching results data:', error);
      return null;
    }
  }

  // Fetch championship teams standings for a specific session
  static async getChampionshipTeams(sessionKey: number): Promise<OpenF1ChampionshipTeam[]> {
    try {
      // Native Next.js cache for 5 minutes
      const response = await fetch(`${API_BASE_URL}/championship_teams?session_key=${sessionKey}`, {
        next: { revalidate: 300 },
        headers: {
          'User-Agent': 'oto-race-app/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch championship teams data: ${response.statusText}`);
      }

      const teams: OpenF1ChampionshipTeam[] = await response.json();

      if (teams.length === 0) {
        console.warn('No championship teams found from OpenF1 API');
        return [];
      }

      return teams.sort((a, b) => a.position_current - b.position_current);
    } catch (error) {
      console.error('Error fetching championship teams data:', error);
      return [];
    }
  }

  // Fetch championship drivers standings for a specific session
  static async getChampionshipDrivers(sessionKey: number): Promise<OpenF1ChampionshipDriver[]> {
    try {
      // Native Next.js cache for 5 minutes
      const response = await fetch(`${API_BASE_URL}/championship_drivers?session_key=${sessionKey}`, {
        next: { revalidate: 300 },
        headers: {
          'User-Agent': 'oto-race-app/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch championship drivers data: ${response.statusText}`);
      }

      const drivers: OpenF1ChampionshipDriver[] = await response.json();

      if (drivers.length === 0) {
        console.warn('No championship drivers found from OpenF1 API');
        return [];
      }

      return drivers.sort((a, b) => a.position_current - b.position_current);
    } catch (error) {
      console.error('Error fetching championship drivers data:', error);
      return [];
    }
  }

  // Helper functions

  // Convert OpenF1 driver to our Pilot format
  private static convertToPilot(driver: OpenF1Driver): Pilot {
    if (!driver || !driver.full_name || !driver.team_name) {
      throw new Error('Invalid driver data received from OpenF1 API');
    }

    return {
      id: driver.full_name.toLowerCase().replace(/\s+/g, '-'),
      name: driver.full_name,
      acronym: driver.name_acronym,
      number: driver.driver_number,
      team: driver.team_name,
      quote: this.getDefaultQuote(driver.full_name),
      headshotUrl: driver.headshot_url,
      teamColour: driver.team_colour
    };
  }

  // Get default quote for a driver
  private static getDefaultQuote(driverName: string): string {
    const quotes: Record<string, string> = {
      'Lando NORRIS': 'Enjoy life. Be kind',
      'Oscar PIASTRI': 'On my best days, I am truly the best',
      'Max VERSTAPPEN': 'Leave me alone, I know what I\'m doing',
      'Isack HADJAR': 'If you believe, you can achieve',
      'Gabriel BORTOLETO': 'I prefer to crash than drive like a passenger',
      'Nico HULKENBERG': 'Experience matters',
      'Pierre GASLY': 'Give it all',
      'Franco COLAPINTO': 'See you at homeeee. Everyone come!',
      'Sergio PEREZ': 'Checo shows the way',
      'Valtteri BOTTAS': 'To whom it may concern – f* you.',
      'Kimi ANTONELLI': 'I want to make my own story',
      'George RUSSELL': 'Get the kettle on!',
      'Fernando ALONSO': 'I like to race, not to do laps alone',
      'Lance STROLL': 'When opportunities arise, you have to seize them',
      'Charles LECLERC': 'I am stupid',
      'Lewis HAMILTON': 'Still I rise',
      'Alexander ALBON': 'P8 calls for a toast',
      'Carlos SAINZ': 'Smoooth operator',
      'Liam LAWSON': 'That is not my story',
      'Arvid LINDBLAD': 'I\'d rather be myself than try to be something I\'m not',
      'Esteban OCON': 'Just out here livin\' my best life',
      'Oliver BEARMAN': 'I have the worst sweet tooth ever',
    };
    return quotes[driverName] || 'Racing is in my blood';
  }
}
