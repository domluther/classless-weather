import { useState, useEffect } from 'react';
import { Loader, ErrorModal } from './Loader';
import { useLocalStorageState } from './LocalStorage';

export function SearchBar({ setResults }) {
  const [query, setQuery] = useLocalStorageState('weatherQuery', null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(
    // To make it so it searches automatically on typing in the dropdown
    function () {
      const controller = new AbortController();

      async function getWeather(location) {
        if (location.length < 3) return;
        try {
          // 1) Getting location (geocoding)
          setLoading(true);
          setIsError(false);
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${location}`,
            { signal: controller.signal }
          );
          const geoData = await geoRes.json();

          if (!geoData.results) throw new Error('Location not found');

          const { latitude, longitude, timezone, name, country_code } =
            geoData.results.at(0);
          const fancyName = `${name} ${convertToFlag(country_code)}`;

          // 2) Getting actual weather
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
          );
          const weatherData = await weatherRes.json();
          setResults({ name: fancyName, data: weatherData.daily });
        } catch (err) {
          setIsError(true);
          console.log('error');
          console.log(err.message);
          setErrorMessage(err.message);
        } finally {
          setLoading(false);
        }
      }
      // 300ms delay - debounce the API calls
      const timer = setTimeout(() => getWeather(query), 300);
      return () => {
        controller.abort();
        clearTimeout(timer);
      };
    },
    [query, setResults]
  );

  function convertToFlag(countryCode) {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }

  // function handleSearch(e) {
  //   e.preventDefault();
  //   getWeather(query);
  // }

  return (
    <>
      <form>
        <input
          type="text"
          value={query}
          placeholder="Enter location"
          onChange={(e) => setQuery(e.target.value)}
        ></input>
      </form>
      <div>
        {loading && <Loader />}
        {isError && <ErrorModal message={errorMessage} />}
      </div>
    </>
  );
}
