export interface DisasterAlert {
  id: string;
  title: string;
  description: string;
  alertLevel: 'Green' | 'Orange' | 'Red';
  eventType: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  dateTime: string;
  population: number;
  severity: number;
  episodeId: string;
  url: string;
}

export interface GDACSResponse {
  alerts: DisasterAlert[];
  lastUpdate: string;
}