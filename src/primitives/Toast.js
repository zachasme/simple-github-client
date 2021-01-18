import { html } from "htm/react";
import {
  XIcon,
  InfoIcon,
  CheckIcon,
  AlertIcon,
  StopIcon,
} from "@primer/octicons-react";

function icon(type) {
  switch (type) {
    case "info":
      return InfoIcon;
    case "success":
      return CheckIcon;
    case "warning":
      return AlertIcon;
    case "error":
      return StopIcon;
  }
}

function Toast({ onDismiss, type = "info", children }) {
  const Icon = icon(type);

  return html`
    <div className="p-1">
      <div className=${`Toast Toast--${type} Toast--animateIn`}>
        <span className="Toast-icon">
          <${Icon} />
        </span>
        <span className="Toast-content">${children}</span>
        ${onDismiss &&
        html`
          <button className="Toast-dismissButton" onClick=${onDismiss}>
            <${XIcon} />
          </button>
        `}
      </div>
    </div>
  `;
}

export default Toast;
