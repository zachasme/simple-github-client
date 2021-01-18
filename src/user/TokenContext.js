import { html } from "htm/react";
import { createContext } from "react";
import { useContext } from "react";

import { useToast } from "../toast/ToastContext.js";
import useLocalStorageState from "../utilities/useLocalStorageState.js";

const TokenContext = createContext(null);

/**
 * Authentication context
 *
 * stores current auth state and exposes login/logout methods
 *
 * Requires:
 *  - Toast context for showing errors
 */
export function TokenProvider({ children }) {
  const { addToast } = useToast();

  const [token, setToken] = useLocalStorageState("token");

  async function login(token) {
    try {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const user = await response.json();
      if (!user) {
        throw new Error("Could not authenticate");
      }
      setToken(token);
    } catch (error) {
      addToast({ type: "error", message: error.message });
    }
  }

  function logout() {
    setToken(null);
  }

  const value = {
    token,
    login,
    logout,
  };

  return html`<${TokenContext.Provider} value=${value}>${children}<//>`;
}

export function useToken() {
  return useContext(TokenContext);
}
