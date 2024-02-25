import { useState, useEffect } from 'react';
export function useLocalStorageState(key, initialState) {
  const [value, setValue] = useState(() => {
    const localValue = localStorage.getItem(key);
    if (!localValue) return initialState;
    return JSON.parse(localValue);
  });
  useEffect(
    () => localStorage.setItem(key, JSON.stringify(value)),
    [value, key]
  );
  return [value, setValue];
}
