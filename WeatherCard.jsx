export default function WeatherCard({ weather }) {
  const readings = [
    { label: 'Temperature', value: `${weather.temperature} °C` },
    { label: 'Humidity', value: `${weather.humidity} %` },
    { label: 'Wind', value: `${weather.windSpeed} km/h` },
    { label: 'Rainfall', value: `${weather.rainfall} mm` },
  ];

  return (
    <section className="card" aria-labelledby="weather-title">
      <h2 id="weather-title">Weather in {weather.place}</h2>
      <dl className="readings">
        {readings.map(({ label, value }) => (
          <div key={label} className="reading">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
