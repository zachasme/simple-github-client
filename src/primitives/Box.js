import { html } from "htm/preact";

const Box = ({ children, class: extraClassNames, condensed }) => {
  let classNames = "Box";
  if (extraClassNames) classNames += ` ${extraClassNames}`;
  if (condensed) classNames += ` Box--condensed`;

  return html`<div class=${classNames}>${children}</div>`;
};

export default Box;
