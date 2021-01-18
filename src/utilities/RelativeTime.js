import { html } from "htm/react";
import { formatRelative } from "date-fns";

function RelativeTime({ date }) {
  return html`
    <time dateTime="${date}">
      ${formatRelative(new Date(date), new Date())}
    </time>
  `;
}

export default RelativeTime;
