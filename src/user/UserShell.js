import { html } from "htm/preact";
import gql from "graphql-tag";
import useQuery from "../hooks/useQuery.js";

import Link from "../primitives/Link.js";
import Octicon from "../primitives/Octicon.js";
import UnderlineNav from "../primitives/UnderlineNav.js";
import UnderlineNavItem from "../primitives/UnderlineNavItem.js";

function UserShell({ active, user, children }) {
  const { login } = user;

  return html`
    <div class="container-xl px-3 px-md-4 px-lg-5">
      <div class="gutter-lg gutter-condensed d-flex flex-md-row flex-column">
        <!-- USER INFO -->
        <div class="flex-shrink-0 col-12 col-md-3 mt-4">
          <div
            class="clearfix d-flex d-md-block flex-items-center mb-4 mb-md-0"
          >
            <div
              class="position-relative d-inline-block col-2 col-md-12 mr-3 mr-md-0 flex-shrink-0"
            >
              <img
                src=${user?.avatarUrl}
                class="avatar avatar-user width-full border bg-white"
              />
            </div>
            <div
              class="vcard-names-container float-left col-10 col-md-12 pt-1 pt-md-3 pb-1 pb-md-3 js-sticky js-user-profile-sticky-fields"
            >
              <h1 class="vcard-names pl-2 pl-md-0">
                <span class="p-name vcard-fullname d-block overflow-hidden">
                  ${user?.name}
                </span>
                <span class="p-nickname vcard-username d-block">
                  ${user?.login}
                </span>
              </h1>
            </div>
          </div>
          <div class="p-note user-profile-bio mb-3 js-user-profile-bio f4">
            <div>${user?.bio}</div>
          </div>

          <!-- STAR/FOLLOW -->

          <div class="d-flex flex-column d-md-block">
            <div class="mb-3">
              <${Link}
                class="link-gray no-underline no-wrap"
                href="/users/${login}/followers"
              >
                <${Octicon} name="people" />
                <span class="text-bold text-gray-dark link-hover-blue">
                  ${` ${user?.followers?.totalCount} `}
                </span>
                followers
              <//>
              ${" · "}
              <${Link}
                class="link-gray no-underline no-wrap"
                href="/users/${login}/following"
              >
                <span class="text-bold text-gray-dark link-hover-blue">
                  ${` ${user?.following?.totalCount} `}
                </span>
                following
              <//>
              ${" · "}
              <${Link}
                class="link-gray no-underline no-wrap"
                href="/users/${login}/stars"
              >
                <${Octicon} name="star" />
                <span class="text-bold text-gray-dark link-hover-blue">
                  ${` ${user?.starredRepositories?.totalCount} `}
                </span>
              <//>
            </div>
            <ul class="list-style-none">
              ${user?.company &&
              html`
                <li>
                  <${Octicon} name="organization" />
                  <span class="ml-2">${user.company}</span>
                </li>
              `}
              ${user?.location &&
              html`
                <li>
                  <${Octicon} name="location" />
                  <span class="ml-2">${user.location}</span>
                </li>
              `}
              ${user?.email &&
              html`
                <li>
                  <${Octicon} name="mail" />
                  <a href="mailto:${user.email}" class="ml-2">${user.email}</a>
                </li>
              `}
            </ul>
          </div>

          <!-- HIGHLIGHT -->

          <div class="border-top pt-3 mt-3 clearfix hide-sm hide-md">
            <h2 class="mb-2 h4">Organizations</h2>
            ${user?.organizations.edges.map(
              ({ node }) => html`
                <${Link} href=${`/${node.login}`} class="">
                  <img
                    src=${node.avatarUrl}
                    class="avatar"
                    height="32"
                    width="32" /></a
                >${" "}
              `
            )}
          </div>
        </div>

        <!-- NAV + CONTENT -->
        <div class="flex-shrink-0 col-12 col-md-9">
          <div class="gutter-condensed gutter-lg flex-column d-flex">
            <div class="mt-4 position-sticky top-0 bg-white width-full">
              <${UnderlineNav}>
                <${UnderlineNavItem}
                  icon="book"
                  label="Overview"
                  href="/${login}"
                  aria-current=${active === "overview" && "page"}
                />
                <${UnderlineNavItem}
                  icon="repo"
                  label="Repositories"
                  count=${user?.repositories.totalCount}
                  href="/users/${login}/repositories"
                  aria-current=${active === "repositories" && "page"}
                />
                <${UnderlineNavItem}
                  icon="project"
                  label="Projects"
                  href="/users/${login}/projects"
                  aria-current=${active === "projects" && "page"}
                />
                <${UnderlineNavItem}
                  icon="package"
                  label="Packages"
                  href="/users/${login}/packages"
                  aria-current=${active === "packages" && "page"}
                />
              <//>
            </div>
            <div class="flex-shrink-0 col-12">${children}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

UserShell.fragments = {
  user: gql`
    fragment UserShell_user on User {
      id
      avatarUrl
      bio
      company
      email
      followers {
        totalCount
      }
      following {
        totalCount
      }
      location
      login
      name
      organizations(first: 10) {
        edges {
          node {
            id
            login
            avatarUrl
          }
        }
      }
      repositories {
        totalCount
      }
      starredRepositories {
        totalCount
      }
    }
  `,
};

export default UserShell;
