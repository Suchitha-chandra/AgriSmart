import { useRef, useState } from 'react';
import SoilForm from './components/SoilForm.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import { fetchWeather } from './services/weather.js';
import { recommendCrops, soilAdvice } from './utils/recommend.js';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState({ loading: false, error: '' });
  const [soilResult, setSoilResult] = useState(null);
  const requestController = useRef(null);

  const handleWeatherSearch = async (event) => {
    event.preventDefault();
    requestController.current?.abort(); // cancel any older request
    requestController.current = new AbortController();
    setWeatherStatus({ loading: true, error: '' });

    try {
      setWeather(await fetchWeather(city, requestController.current.signal));
      setWeatherStatus({ loading: false, error: '' });
    } catch (error) {
      if (error.name === 'AbortError') return;
      setWeather(null);
      setWeatherStatus({ loading: false, error: error.message });
    }
  };

  const handleSoilSubmit = (soil) => {
    setSoilResult({ crops: recommendCrops(soil), advice: soilAdvice(soil) });
  };

  return (
    <>
      <header className="site-header">
        <h1>AgriSmart</h1>
        <p>Check the weather and get simple crop suggestions from your soil test.</p>
      </header>

      <main className="layout">
        <div className="column">
          <form className="card" onSubmit={handleWeatherSearch} noValidate aria-labelledby="city-title">
            <h2 id="city-title">Local weather</h2>
            <div className="field">
              <label htmlFor="city">City</label>
              <input id="city" value={city} onChange={(event) => setCity(event.target.value)}
                placeholder="e.g. Hanamkonda" autoComplete="off" />
            </div>
            <button type="submit" className="button" disabled={weatherStatus.loading}>
              {weatherStatus.loading ? 'Loading…' : 'Get weather'}
            </button>
            {weatherStatus.error && <p className="error" role="alert">{weatherStatus.error}</p>}
          </form>
          {weather && <WeatherCard weather={weather} />}
        </div>

        <div className="column">
          <SoilForm onSubmit={handleSoilSubmit} />
          {soilResult && (
            <section className="card" aria-labelledby="result-title" aria-live="polite">
              <h2 id="result-title">Suggested crops</h2>
              <ol className="crop-list">
                {soilResult.crops.map((crop) => (
                  <li key={crop.name}><span>{crop.name}</span><strong>{crop.score}% match</strong></li>
                ))}
              </ol>
              <h3>Soil advice</h3>
              <ul>{soilResult.advice.map((tip) => <li key={tip}>{tip}</li>)}</ul>
            </section>
          )}
        </div>
      </main>

      <footer className="site-footer">Suggestions are for learning only. Confirm with a local agriculture officer.</footer>
    </>
  );
}
