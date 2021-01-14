import { html } from "htm/preact";

export default function UnderlineNav({ children, class: className = "" }) {
  return html`
    <nav class="UnderlineNav px-3 px-md-4 px-lg-5 ${className}">
      <div class="UnderlineNav-body">${children}</div>
    </nav>
  `;
}
