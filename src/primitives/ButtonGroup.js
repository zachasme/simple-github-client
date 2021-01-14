import { html } from "htm/preact";
import { toChildArray, cloneElement } from "preact";

const ButtonGroup = ({ children }) => {
  return html`
    <div class="BtnGroup">
      ${toChildArray(children).map((child) =>
        cloneElement(child, {
          class: `${child.props.class} BtnGroup-item`,
        })
      )}
    </div>
  `;
};

export default ButtonGroup;
