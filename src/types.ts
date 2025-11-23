export interface LocationData {
  exists: boolean;
  lat?: number;
  lon?: number;
  displayName?: string;
}

export interface WeatherData {
  temperature: number;
  rainChance: number;
  unit: string;
}

export interface Place {
  name: string;
  type: string;
}

export interface PlacesData {
  places: Place[];
}

export interface AgentResponse {
  location?: LocationData;
  weather?: WeatherData;
  places?: PlacesData;
  error?: string;
}
