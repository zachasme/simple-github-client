import { html } from "htm/react";

const Box = ({ children, className: extraClassNames, condensed }) => {
  let classNames = "Box";
  if (extraClassNames) classNames += ` ${extraClassNames}`;
  if (condensed) classNames += ` Box--condensed`;

  return html`<div className=${classNames}>${children}</div>`;
};

export default Box;
