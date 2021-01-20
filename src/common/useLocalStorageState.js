import { useCallback, useEffect, useState } from "react";

function useLocalStorageState(key, defaultValue = null) {
  // memoized state getter
  const getState = useCallback(() => {
    const stringified = localStorage.getItem(key);
    if (stringified === null) return defaultValue;
    try {
      return JSON.parse(stringified);
    } catch {
      return null;
    }
  }, [key]);

  // internal state
  const [state, setInternalState] = useState(getState);

  // key and localstorage change handler
  useEffect(() => {
    const onStorage = () => setInternalState(getState());
    onStorage();

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, getState, setInternalState]);

  // public setter
  function setState(state) {
    const stringified = JSON.stringify(state);
    localStorage.setItem(key, stringified);
    setInternalState(state);
  }

  // public interface
  return [state, setState];
}

export default useLocalStorageState;
