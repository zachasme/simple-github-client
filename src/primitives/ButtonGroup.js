import { html } from "htm/react";
import { Children, cloneElement } from "react";

const ButtonGroup = ({ children }) => {
  return html`
    <div className="BtnGroup">
      ${Children.map(children, (child) =>
        cloneElement(child, {
          className: `${child.props.class} BtnGroup-item`,
        })
      )}
    </div>
  `;
};

export default ButtonGroup;
