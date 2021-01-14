import { html } from "htm/preact";

import Octicon from "../primitives/Octicon.js";

function Select({ label, icon, title, children }) {
  return html`
    <details class="details-reset details-overlay">
      <summary class="btn" aria-haspopup="true">
        ${icon && html`<${Octicon} name=${icon} />`}
        <span>${label}</span>
        <span class="dropdown-caret hide-sm" />
      </summary>
      <div class="SelectMenu">
        <div class="SelectMenu-modal">
          <header class="SelectMenu-header">
            <h3 class="SelectMenu-title">${title}</h3>
            <!--
            <button
              class="SelectMenu-closeButton"
              type="button"
              data-toggle-for="targetid"
            >
              <${Octicon} name="x" />
            </button>
            -->
          </header>
          <div class="SelectMenu-list">${children}</div>
        </div>
      </div>
    </details>
  `;
}

export default Select;
