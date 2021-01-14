import { html } from "htm/preact";

import Link from "../primitives/Link.js";
import Octicon from "../primitives/Octicon.js";

function Select({
  class: extraClasses,
  label,
  icon,
  disabled,
  title,
  small,
  count,
  countHref,
  children,
}) {
  let classNames = "btn";
  if (small) classNames += ` btn-sm`;
  if (count && countHref) classNames += ` float-none btn-with-count`;
  else classNames += ` ${extraClasses}`;

  let content = html`
    <details
      class="details-reset details-overlay ${(count &&
        countHref &&
        "float-left") ||
      ""}"
    >
      <summary
        class=${classNames}
        aria-haspopup="true"
        aria-disabled=${disabled}
      >
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

  // if count AND countHref show social style count
  if (count && countHref) {
    content = html`
      <div class="${extraClasses}">
        ${content}
        <${Link} href=${countHref} class="social-count">${count}<//>
      </div>
    `;
  }

  return content;
}

export default Select;
