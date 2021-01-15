import { html } from "htm/preact";
import Octicon from "./Octicon.js";

function iconName(type) {
  switch (type) {
    case "info":
      return "info";
    case "success":
      return "check";
    case "warning":
      return "alert";
    case "error":
      return "stop";
  }
}

function Toast({ onDismiss, type = "info", children }) {
  return html`
    <div class="p-1">
      <div class=${`Toast Toast--${type} Toast--animateIn`}>
        <span class="Toast-icon">
          <${Octicon} name=${iconName(type)} />
        </span>
        <span class="Toast-content">${children}</span>
        ${onDismiss &&
        html`
          <button class="Toast-dismissButton" onClick=${onDismiss}>
            <${Octicon} name="x" />
          </button>
        `}
      </div>
    </div>
  `;
}

export default Toast;
