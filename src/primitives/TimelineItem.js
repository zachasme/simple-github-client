import { html } from "htm/react";

function TimelineItem({ children }) {
  return html`<div className="TimelineItem">${children}</div>`;
}

function TimelineItemBadge({ color, children }) {
  let className = "TimelineItem-badge";
  if (color) className += ` bg-${color} text-white`;
  return html`<div className=${className}>${children}</div>`;
}

function TimelineItemBody({ children }) {
  return html`<div className="TimelineItem-body">${children}</div>`;
}

function TimelineItemAvatar({ src, alt }) {
  return html`
    <div className="TimelineItem-avatar">
      <img className="avatar" height="40" width="40" alt=${alt} src=${src} />
    </div>
  `;
}

export {
  TimelineItem,
  TimelineItemBadge,
  TimelineItemBody,
  TimelineItemAvatar,
};
