import { html } from "htm/react";

export default function UnderlineNav({ children, className = "" }) {
  return html`
    <nav className="UnderlineNav px-3 px-md-4 px-lg-5 ${className}">
      <div className="UnderlineNav-body">${children}</div>
    </nav>
  `;
}
