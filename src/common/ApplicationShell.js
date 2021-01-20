import { MarkGithubIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { html } from "htm/react";
import { gql } from "urql";

import { useAuthentication } from "../user/AuthenticationContext";
import { onProgressChange } from "../graphql/progress";
import useQuery from "../graphql/useQuery.js";
import Link from "../primitives/Link.js";

function HeaderLink({ children, className, ...props }) {
  return html`<${Link} className="Header-link ${className}" ...${props}>
    ${children}
  <//>`;
}
function HeaderItem({ children, ...props }) {
  return html`<div className="Header-item" ...${props}>${children}<//>`;
}
function Header({ children, ...props }) {
  return html`<div className="Header" ...${props}>${children}<//>`;
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
  const { logout } = useAuthentication();
  const location = useLocation();

  const [{ data, error }] = useQuery({
    query: QUERY,
  });

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    return onProgressChange((queries) => {
      setProgress(queries.size);
    });
  }, []);

  return html`
    <div>
      <span
        className=${`bg-gray-dark Progress Progress--small rounded-0 position-absolute width-full ${
          progress === 0 ? "v-hidden" : "v-shown"
        }`}
      >
        <span
          key=${progress}
          className="Progress-item bg-blue fetch-progress"
        />
      </span>
      <${Header}>
        <${HeaderItem}>
          <${HeaderLink} href="/" className="f4 d-flex flex-items-center">
            <${MarkGithubIcon} size="medium" />
          <//>
        <//>
        <${HeaderItem}>
          <input
            type="search"
            placeholder="Search..."
            className="form-control input-dark"
          />
        <//>
        <${HeaderItem}>
          <${HeaderLink} to="/pulls">
            Pull<span className="d-inline d-md-none d-lg-inline"> request</span
            >s
          <//>
        <//>
        <${HeaderItem}>
          <${HeaderLink} to="/issues">Issues<//>
        <//>
        <${HeaderItem}>
          <a
            href=${`https://github.com${location.pathname}`}
            className="Header-link"
          >
            Compare
          </a>
        <//>
        <div className="Header-item Header-item--full"></div>

        <div className="Header-item mr-0">
          <div>
            <details
              className="dropdown details-reset details-overlay d-inline-block"
            >
              <summary className="text-gray p-2 d-inline" aria-haspopup="true">
                <img
                  className="avatar mr-2"
                  height="20"
                  width="20"
                  src=${data?.viewer?.avatarUrl}
                />
                <div className="dropdown-caret"></div>
              </summary>

              <div className="dropdown-menu dropdown-menu-sw">
                <div className="css-truncate">
                  <${Link}
                    href="/${data?.viewer?.login}"
                    className="no-underline user-profile-link px-3 pt-2 pb-2 mb-n2 mt-n1 d-block"
                  >
                    Signed in as
                    <strong className="css-truncate-target">
                      ${data?.viewer?.login}
                    </strong>
                  <//>
                </div>
                <ul>
                  <li className="dropdown-divider" role="separator"></li>
                  <li>
                    <${Link}
                      href="/${data?.viewer?.login}"
                      className="dropdown-item"
                    >
                      Your profile
                    <//>
                  </li>
                  <li>
                    <${Link}
                      href="/users/${data?.viewer?.login}/repositories"
                      className="dropdown-item"
                    >
                      Your repositories
                    <//>
                  </li>
                  <li>
                    <${Link}
                      href="/settings/organizations"
                      className="dropdown-item"
                    >
                      Your organizations
                    <//>
                  </li>
                  <li>
                    <${Link}
                      href="/users/${data?.viewer?.login}/projects"
                      className="dropdown-item"
                    >
                      Your projects
                    <//>
                  </li>
                  <li>
                    <${Link} href="/discussions" className="dropdown-item">
                      Your discussions
                    <//>
                  </li>
                  <li>
                    <${Link}
                      href="/users/${data?.viewer?.login}/stars"
                      className="dropdown-item"
                    >
                      Your stars
                    <//>
                  </li>
                  <li className="dropdown-divider" role="separator"></li>
                  <li>
                    <${Link} href="/settings/profile" className="dropdown-item">
                      Settings
                    <//>
                  </li>
                  <li>
                    <button
                      className="btn-link dropdown-item"
                      onClick=${logout}
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
      ${data && html`<main>${error ? "Something went wrong" : children}</main>`}
      <footer className="container-xl width-full p-responsive">
        <div
          className="py-6 mt-6 position-relative d-flex flex-row-reverse flex-lg-row flex-wrap flex-lg-nowrap flex-justify-center flex-lg-justify-between f6 text-gray border-top border-gray-light"
        >
          This clone is in no way affiliated with GitHub Inc.
        </div>
      </footer>
    </div>
  `;
}

export default ApplicationShell;
