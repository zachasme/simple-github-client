import { html } from "htm/react";
import { DotFillIcon } from "@primer/octicons-react";

function Dot({ color }) {
  return html`<${DotFillIcon} size="small" style=${{ color: color }} />`;
}

export default Dot;
