import { html } from "htm/preact";
import Octicon from "./Octicon.js";

function Dot({ color }) {
  return html` <${Octicon} small name="dot-fill" style="color: ${color}" /> `;
}

export default Dot;
