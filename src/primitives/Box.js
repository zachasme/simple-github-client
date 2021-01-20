import { html } from "htm/react";

function Box(props) {
  let classNames = "Box";
  if (props.className) classNames += ` ${props.className}`;
  if (props.condensed) classNames += ` Box--condensed`;
  if (props.spacious) classNames += ` Box--spacious`;
  if (props.danger) classNames += ` Box--danger`;
  if (props.blue) classNames += ` Box--blue`;

  return html`<div className=${classNames}>${props.children}</div>`;
}

export default Box;
