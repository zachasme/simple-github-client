import { html } from "htm/preact";
import { formatRelative } from "date-fns";

function RelativeTime({ date }) {
  return html`
    <time datetime="${date}">
      ${formatRelative(new Date(date), new Date())}
    </time>
  `;
}

export default RelativeTime;
