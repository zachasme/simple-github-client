import { html } from "htm/preact";
import Octicon from "../primitives/Octicon.js";

const BlankSlate = ({ children, icon, title, narrow, large, spacious }) => {
  let classNames = "blankslate";
  if (narrow) classNames += " blankslate-narrow";
  if (large) classNames += " blankslate-large";
  if (spacious) classNames += " blankslate-spacious";

  return html`
    <div class=${classNames}>
      ${Octicon &&
      html`<${Octicon} name=${icon} class="blankslate-icon" medium />`}
      <h3 class="mb-1">${title}</h3>
      ${children}
    </div>
  `;
};

export default BlankSlate;
