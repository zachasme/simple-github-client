import { html } from "htm/react";

function TimelineItem({ children }) {
  return html`<div className="TimelineItem">${children}</div>`;
}

function TimelineItemBadge({ children }) {
  return html`<div className="TimelineItem-badge">${children}</div>`;
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

export default {
  TimelineItem,
  TimelineItemBadge,
  TimelineItemBody,
  TimelineItemAvatar,
};
