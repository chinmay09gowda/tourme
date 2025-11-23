import { LocationData, WeatherData, PlacesData } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const headers = {
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export async function getLocationData(place: string): Promise<LocationData> {
  const apiUrl = `${SUPABASE_URL}/functions/v1/geocode`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ place }),
  });

  if (!response.ok) {
    const error = await response.json();
    return { exists: false, ...error };
  }

  return await response.json();
}

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const apiUrl = `${SUPABASE_URL}/functions/v1/weather`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ lat, lon }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  return await response.json();
}

export async function getPlacesData(lat: number, lon: number): Promise<PlacesData> {
  const apiUrl = `${SUPABASE_URL}/functions/v1/places`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ lat, lon }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch places data');
  }

  return await response.json();
}

export async function orchestrateTourismQuery(
  place: string,
  needsWeather: boolean,
  needsPlaces: boolean
) {
  const location = await getLocationData(place);

  if (!location.exists || !location.lat || !location.lon) {
    return {
      location,
      error: `I don't know if the place "${place}" exists or I couldn't find it in my database.`,
    };
  }

  const results: any = { location };

  const promises = [];

  if (needsWeather) {
    promises.push(
      getWeatherData(location.lat, location.lon)
        .then(data => ({ weather: data }))
        .catch(() => ({ weather: null }))
    );
  }

  if (needsPlaces) {
    promises.push(
      getPlacesData(location.lat, location.lon)
        .then(data => ({ places: data }))
        .catch(() => ({ places: null }))
    );
  }

  const responses = await Promise.all(promises);
  responses.forEach(response => Object.assign(results, response));

  return results;
}
