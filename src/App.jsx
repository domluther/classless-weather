import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { useLocalStorageState } from './LocalStorage';

export default function App() {
  const [results, setResults] = useLocalStorageState('weatherData', null);

  function handleClearResults() {
    setResults(null);
  }

  return (
    <div className="app">
      <h1>Simple weather </h1>
      <SearchBar setResults={setResults} />
      {results && (
        <WeatherResults results={results} onClearResults={handleClearResults} />
      )}
    </div>
  );
}

function WeatherResults({ results, onClearResults }) {
  const {
    time: dates,
    weathercode: codes,
    temperature_2m_max: maxs,
    temperature_2m_min: mins,
  } = results.data;
  const dayArray = [];

  for (let i = 0; i < 7; i++) {
    dayArray.push(
      <Day
        key={dates[i]}
        weatherCode={codes[i]}
        date={dates[i]}
        minTemp={mins[i]}
        maxTemp={maxs[i]}
      />
    );
  }

  return (
    <>
      <h2>Weather for {results.name}</h2>
      <ul className="weather">
        {dates.map((date, i) => {
          return (
            <Day
              key={date}
              weatherCode={codes.at(i)}
              date={date}
              minTemp={mins.at(i)}
              maxTemp={maxs.at(i)}
              isToday={i === 0}
            />
          );
        })}
      </ul>
      <button onClick={onClearResults}>Reset</button>
    </>
  );
}

function Day({ weatherCode, date, maxTemp, minTemp, isToday }) {
  function getWeatherIcon(wmoCode) {
    const icons = new Map([
      [[0], '☀️'],
      [[1], '🌤'],
      [[2], '⛅️'],
      [[3], '☁️'],
      [[45, 48], '🌫'],
      [[51, 56, 61, 66, 80], '🌦'],
      [[53, 55, 63, 65, 57, 67, 81, 82], '🌧'],
      [[71, 73, 75, 77, 85, 86], '🌨'],
      [[95], '🌩'],
      [[96, 99], '⛈'],
    ]);
    const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
    if (!arr) return 'NOT FOUND';
    return icons.get(arr);
  }

  function formatDay(dateStr) {
    return new Intl.DateTimeFormat('en', {
      weekday: 'short',
    }).format(new Date(dateStr));
  }

  return (
    <li className="day">
      <span>{getWeatherIcon(weatherCode)}</span>
      <p>{isToday ? 'Today' : formatDay(date)}</p>
      <p>
        {Math.floor(minTemp)}&deg; &mdash; {Math.ceil(maxTemp)}&deg;
      </p>
    </li>
  );
}
