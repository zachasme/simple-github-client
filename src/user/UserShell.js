import { html } from "htm/react";
import { gql } from "urql";
import {
  PeopleIcon,
  StarIcon,
  OrganizationIcon,
  LocationIcon,
  MailIcon,
  BookIcon,
  RepoIcon,
  ProjectIcon,
  PackageIcon,
} from "@primer/octicons-react";

import useQuery from "../hooks/useQuery.js";
import Link from "../primitives/Link.js";
import UnderlineNav from "../primitives/UnderlineNav.js";
import UnderlineNavItem from "../primitives/UnderlineNavItem.js";

function UserShell({ active, user, children }) {
  const { login } = user;

  return html`
    <div className="container-xl px-3 px-md-4 px-lg-5">
      <div
        className="gutter-lg gutter-condensed d-flex flex-md-row flex-column"
      >
        <!-- USER INFO -->
        <div className="flex-shrink-0 col-12 col-md-3 mt-4">
          <div
            className="clearfix d-flex d-md-block flex-items-center mb-4 mb-md-0"
          >
            <div
              className="position-relative d-inline-block col-2 col-md-12 mr-3 mr-md-0 flex-shrink-0"
            >
              <img
                src=${user?.avatarUrl}
                className="avatar avatar-user width-full border bg-white"
              />
            </div>
            <div
              className="vcard-names-container float-left col-10 col-md-12 pt-1 pt-md-3 pb-1 pb-md-3 js-sticky js-user-profile-sticky-fields"
            >
              <h1 className="vcard-names pl-2 pl-md-0">
                <span className="p-name vcard-fullname d-block overflow-hidden">
                  ${user?.name}
                </span>
                <span className="p-nickname vcard-username d-block">
                  ${user?.login}
                </span>
              </h1>
            </div>
          </div>
          <div className="p-note user-profile-bio mb-3 js-user-profile-bio f4">
            <div>${user?.bio}</div>
          </div>

          <!-- STAR/FOLLOW -->

          <div className="d-flex flex-column d-md-block">
            <div className="mb-3">
              <${Link}
                className="link-gray no-underline no-wrap"
                href="/users/${login}/followers"
              >
                <${PeopleIcon} />
                <span className="text-bold text-gray-dark link-hover-blue">
                  ${` ${user?.followers?.totalCount} `}
                </span>
                followers
              <//>
              ${" · "}
              <${Link}
                className="link-gray no-underline no-wrap"
                href="/users/${login}/following"
              >
                <span className="text-bold text-gray-dark link-hover-blue">
                  ${` ${user?.following?.totalCount} `}
                </span>
                following
              <//>
              ${" · "}
              <${Link}
                className="link-gray no-underline no-wrap"
                href="/users/${login}/stars"
              >
                <${StarIcon} />
                <span className="text-bold text-gray-dark link-hover-blue">
                  ${` ${user?.starredRepositories?.totalCount} `}
                </span>
              <//>
            </div>
            <ul className="list-style-none">
              ${user?.company &&
              html`
                <li>
                  <${OrganizationIcon} />
                  <span className="ml-2">${user.company}</span>
                </li>
              `}
              ${user?.location &&
              html`
                <li>
                  <${LocationIcon} />
                  <span className="ml-2">${user.location}</span>
                </li>
              `}
              ${user?.email &&
              html`
                <li>
                  <${MailIcon} />
                  <a href="mailto:${user.email}" className="ml-2"
                    >${user.email}</a
                  >
                </li>
              `}
            </ul>
          </div>

          <!-- HIGHLIGHT -->

          <div className="border-top pt-3 mt-3 clearfix hide-sm hide-md">
            <h2 className="mb-2 h4">Organizations</h2>
            ${user?.organizations.edges.map(
              ({ node }) => html`
                <${Link} key=${node.id} href=${`/${node.login}`} className="">
                  <img
                    src=${node.avatarUrl}
                    className="avatar"
                    height="32"
                    width="32" /></a
                >${" "}
              `
            )}
          </div>
        </div>

        <!-- NAV + CONTENT -->
        <div className="flex-shrink-0 col-12 col-md-9">
          <div className="gutter-condensed gutter-lg flex-column d-flex">
            <div className="mt-4 position-sticky top-0 bg-white width-full">
              <${UnderlineNav}>
                <${UnderlineNavItem}
                  Icon=${BookIcon}
                  label="Overview"
                  href="/${login}"
                  aria-current=${active === "overview" && "page"}
                />
                <${UnderlineNavItem}
                  Icon=${RepoIcon}
                  label="Repositories"
                  count=${user?.repositories.totalCount}
                  href="/users/${login}/repositories"
                  aria-current=${active === "repositories" && "page"}
                />
                <${UnderlineNavItem}
                  Icon=${ProjectIcon}
                  label="Projects"
                  href="/users/${login}/projects"
                  aria-current=${active === "projects" && "page"}
                />
                <${UnderlineNavItem}
                  Icon=${PackageIcon}
                  label="Packages"
                  href="/users/${login}/packages"
                  aria-current=${active === "packages" && "page"}
                />
              <//>
            </div>
            <div className="flex-shrink-0 col-12">${children}</div>
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
