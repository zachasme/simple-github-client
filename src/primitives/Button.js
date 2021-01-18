import { Fragment } from "react";
import { html } from "htm/react";

import Link from "../primitives/Link.js";

const Button = ({
  children,
  className: extraClasses,
  large,
  small,
  disabled,
  primary,
  danger,
  outline,
  block,
  invisible,
  selected,
  icon,
  href,
  count,
  countHref,
  ...props
}) => {
  let classNames = "btn";
  if (large) classNames += ` btn-large`;
  if (small) classNames += ` btn-sm`;
  if (disabled) classNames += ` btn-disabled`;
  if (primary) classNames += ` btn-primary`;
  if (danger) classNames += ` btn-danger`;
  if (outline) classNames += ` btn-outline`;
  if (block) classNames += ` btn-block`;
  if (invisible) classNames += ` btn-invisible`;
  if (selected) classNames += ` btn-selected`;
  if (count && countHref) classNames += ` btn-with-count`;
  else classNames += ` ${extraClasses}`;

  let content = children;

  // if any extra content wrap text in span
  if (icon || count) {
    content = html`<span>${content}</span>`;
  }

  // add optional icon
  if (icon) {
    content = html`<${Fragment}>${icon}${content}<//>`;
  }

  // add simple count
  if (count && !countHref) {
    content = html`
      <${Fragment}>
        ${content}
        <span className="Counter">${count}</span>
      <//>
    `;
  }

  // make anchor if href given
  if (href) {
    content = html`
      <${Link} className=${classNames} href=${href} ...${props}>${content}<//>
    `;
    // button otherwise
  } else {
    content = html`
      <button className=${classNames} disabled=${disabled} ...${props}>
        ${content}
      </button>
    `;
  }

  // if count AND countHref show social style count
  if (count && countHref) {
    content = html`
      <div className="clearfix ${extraClasses}">
        ${content}
        <${Link} href=${countHref} className="social-count">${count}<//>
      </div>
    `;
  }

  return content;
};

export default Button;
