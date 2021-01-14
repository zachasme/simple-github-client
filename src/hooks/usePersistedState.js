import { useState, useEffect } from "preact/hooks";

const usePersistedState = (initialState, key) => {
  const [state, setState] = useState(() => {
    const json = localStorage.getItem(key);
    if (json !== null) return JSON.parse(json);
    if (typeof initialState === "function") return initialState();
    return initialState;
  });

  // subscribe to `storage` change events
  useEffect(() => {
    function callback({ key: k, newValue }) {
      if (k === key) {
        const newState = JSON.parse(newValue);
        if (state !== newState) {
          setState(newState);
        }
      }
    }
    addEventListener("storage", callback);
    return () => removeEventListener("storage", callback);
  }, []);

  // Only persist to storage if state changes.
  useEffect(() => {
    // persist to localStorage
    const value = JSON.stringify(state);
    localStorage.setItem(key, value);
  }, [state]);

  return [state, setState];
};

export default usePersistedState;
