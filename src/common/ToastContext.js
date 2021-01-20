import { createContext, useContext, useState, useRef } from "react";
import { html } from "htm/react";

import Toast from "../primitives/Toast.js";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const idRef = useRef(0);
  const [toasts, setToasts] = useState([]);

  function addToast(toast) {
    setToasts((toasts) => [
      ...toasts,
      {
        key: idRef.current++,
        ...toast,
      },
    ]);
  }

  function dismissToast(key) {
    setToasts((toasts) => toasts.filter((toast) => toast.key !== key));
  }

  const value = {
    addToast,
  };

  return html`
    <${ToastContext.Provider} value=${value}>
      <div className="position-fixed bottom-0 left-0">
        ${toasts.map(
          (toast) =>
            html`
              <${Toast}
                key=${toast.key}
                type=${toast.type}
                onDismiss=${() => dismissToast(toast.key)}
              >
                ${toast.message}
              <//>
            `
        )}
      </div>
      ${children}
    <//>
  `;
}

export function useToast() {
  return useContext(ToastContext);
}
