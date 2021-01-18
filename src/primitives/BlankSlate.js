import { html } from "htm/react";

const BlankSlate = ({ children, Icon, title, narrow, large, spacious }) => {
  let classNames = "blankslate";
  if (narrow) classNames += " blankslate-narrow";
  if (large) classNames += " blankslate-large";
  if (spacious) classNames += " blankslate-spacious";

  return html`
    <div className=${classNames}>
      ${Icon && html`<${Icon} className="blankslate-icon" size="medium" />`}
      <h3 className="mb-1">${title}</h3>
      ${children}
    </div>
  `;
};

export default BlankSlate;
