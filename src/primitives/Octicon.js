import { html } from "htm/preact";
import octicons from "@primer/octicons";

function Octicon({ name, small, medium, large, ...props }) {
  let size = 16;
  if (small) size = 16;
  if (medium) size = 32;
  if (large) size = 64;

  if (!octicons[name]) {
    console.warn(`octicon ${name} not found`);
    return html`octicon ${name} not found`;
  }

  return html([octicons[name].toSVG({ width: size, height: size, ...props })]);
}

export default Octicon;
