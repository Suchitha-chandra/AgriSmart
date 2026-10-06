import { sanitizeCityName } from '../utils/validate.js';

// Open-Meteo is free and needs no API key, so there is no secret to leak in the browser.
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(city, signal) {
  const cityName = sanitizeCityName(city);
  if (!cityName) throw new Error('Enter a valid city name (letters only, 2 to 60 characters).');

  const geoResponse = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`,
    { signal }
  );
  if (!geoResponse.ok) throw new Error('Could not look up that city. Please try again.');

  const place = (await geoResponse.json()).results?.[0];
  if (!place) throw new Error(`No city found for "${cityName}".`);

  const query = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation',
    timezone: 'auto',
  });
  const weatherResponse = await fetch(`${FORECAST_URL}?${query}`, { signal });
  if (!weatherResponse.ok) throw new Error('Weather service is unavailable right now.');

  const { current } = await weatherResponse.json();
  return {
    place: [place.name, place.admin1, place.country].filter(Boolean).join(', '),
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    rainfall: current.precipitation,
  };
}
