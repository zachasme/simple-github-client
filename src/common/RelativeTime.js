import { formatRelative } from "date-fns";
import { html } from "htm/react";

function RelativeTime({ date }) {
  return html`
    <time dateTime="${date}">
      ${formatRelative(new Date(date), new Date())}
    </time>
  `;
}

export default RelativeTime;
