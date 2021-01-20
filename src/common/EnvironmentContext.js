import { createContext, useContext, useState, useRef } from "react";
import { html } from "htm/react";

const EnvironmentContext = createContext(null);

export function EnvironmentProvider({ children }) {
  const [environment, setEnvironment] = useState([]);

  return html`
    <${EnvironmentContext.Provider} value=${environment}>${children}<//>
  `;
}

export function useEnvironment() {
  return useContext(EnvironmentContext);
}
