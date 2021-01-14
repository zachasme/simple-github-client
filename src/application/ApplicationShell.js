import { html } from "htm/preact";

import gql from "graphql-tag";
import useQuery from "../hooks/useQuery.js";
import usePersistedState from "../hooks/usePersistedState.js";

import Octicon from "../primitives/Octicon.js";
import Link from "../primitives/Link.js";

function HeaderLink({ children, class: className, ...props }) {
  return html`<${Link} class="Header-link ${className}" ...${props}>
    ${children}
  <//>`;
}
function HeaderItem({ children, ...props }) {
  return html`<div class="Header-item" ...${props}>${children}<//>`;
}
function Header({ children, ...props }) {
  return html`<div class="Header" ...${props}>${children}<//>`;
}

const QUERY = gql`
  query ApplicationShellQuery {
    viewer {
      id
      login
      avatarUrl
    }
  }
`;

function ApplicationShell({ children }) {
  const [token, setToken] = usePersistedState("", "token");
  const [{ data, error }] = useQuery({
    query: QUERY,
  });

  function handleSignOut() {
    setToken("");
    location.reload();
  }

  return html`
    <div>
      <${Header}>
        <${HeaderItem}>
          <${HeaderLink} href="/" class="f4 d-flex flex-items-center">
            <${Octicon} name="mark-github" medium />
          <//>
        <//>
        <${HeaderItem}>
          <input
            type="search"
            placeholder="Search..."
            class="form-control input-dark"
          />
        <//>
        <${HeaderItem}>
          <${HeaderLink} href="/pulls">
            Pull<span class="d-inline d-md-none d-lg-inline"> request</span>s
          <//>
        <//>
        <${HeaderItem}>
          <${HeaderLink} href="/issues">Issues <//>
        <//>
        <div class="Header-item Header-item--full"></div>

        <div class="Header-item mr-0">
          <div>
            <details
              class="dropdown details-reset details-overlay d-inline-block"
            >
              <summary class="text-gray p-2 d-inline" aria-haspopup="true">
                <img
                  class="avatar mr-2"
                  height="20"
                  width="20"
                  src=${data?.viewer?.avatarUrl}
                />
                <div class="dropdown-caret"></div>
              </summary>

              <div class="dropdown-menu dropdown-menu-sw">
                <div class="css-truncate">
                  <${Link}
                    href="/${data?.viewer?.login}"
                    class="no-underline user-profile-link px-3 pt-2 pb-2 mb-n2 mt-n1 d-block"
                  >
                    Signed in as
                    <strong class="css-truncate-target">
                      ${data?.viewer?.login}
                    </strong>
                  <//>
                </div>
                <ul>
                  <li class="dropdown-divider" role="separator"></li>
                  <li>
                    <${Link}
                      href="/${data?.viewer?.login}"
                      class=" dropdown-item"
                    >
                      Your profile
                    <//>
                  </li>
                  <li class="dropdown-divider" role="separator"></li>
                  <li>
                    <button
                      class="btn-link dropdown-item"
                      onClick=${handleSignOut}
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      <//>
      ${data &&
      html` <main>${error ? "Something went wrong" : children}</main> `}
      <footer class="container-xl width-full p-responsive">
        <div
          class="py-6 mt-6 position-relative d-flex flex-row-reverse flex-lg-row flex-wrap flex-lg-nowrap flex-justify-center flex-lg-justify-between f6 text-gray border-top border-gray-light"
        >
          This clone is in no way affiliated with GitHub Inc.
        </div>
      </footer>
    </div>
  `;
}

export default ApplicationShell;