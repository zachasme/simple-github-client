import { html } from "htm/react";

import Link from "../primitives/Link.js";
import { XIcon } from "@primer/octicons-react";

function Select({
  className: extraClasses,
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
      className="details-reset details-overlay ${(count &&
        countHref &&
        "float-left") ||
      ""}"
    >
      <summary
        className=${classNames}
        aria-haspopup="true"
        aria-disabled=${disabled}
      >
        ${icon}
        <span>${label}</span>
        <span className="dropdown-caret hide-sm" />
      </summary>
      <div className="SelectMenu">
        <div className="SelectMenu-modal">
          <header className="SelectMenu-header">
            <h3 className="SelectMenu-title">${title}</h3>
            <!--
            <button
              className="SelectMenu-closeButton"
              type="button"
              data-toggle-for="targetid"
            >
              <${XIcon} />
            </button>
            -->
          </header>
          <div className="SelectMenu-list">${children}</div>
        </div>
      </div>
    </details>
  `;

  // if count AND countHref show social style count
  if (count && countHref) {
    content = html`
      <div className="${extraClasses}">
        ${content}
        <${Link} href=${countHref} className="social-count">${count}<//>
      </div>
    `;
  }

  return content;
}

export default Select;
