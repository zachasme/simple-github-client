import {
  PersonIcon,
  RepoIcon,
  ProjectIcon,
  PackageIcon,
} from "@primer/octicons-react";
import { html } from "htm/react";
import { gql } from "@apollo/client";

import UnderlineNavItem from "../primitives/UnderlineNavItem.js";
import UnderlineNav from "../primitives/UnderlineNav.js";
import Link from "../primitives/Link.js";

function OrganizationShell({ active, organization, children }) {
  const org = organization;
  const { login } = org;

  return html`<div>
    <div className="bg-gray-light pt-3 mb-5">
      <div className="d-flex mb-3 px-3 px-md-4 px-lg-5">
        <div className="flex-auto min-width-0 width-fit mr-3">
          <nav
            aria-label="Breadcrumb"
            className="d-flex flex-wrap flex-items-center break-word f3 text-normal"
          >
            <ol>
              <li className="breadcrumb-item" aria-current="page">
                <${Link} href="/${login}">${login}<//>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <${UnderlineNav}>
        <${UnderlineNavItem}
          Icon=${RepoIcon}
          label="Repositories"
          count=${org?.repositories.totalCount}
          href="/${login}"
          aria-current=${active === "repositories" && "page"}
        />
        <${UnderlineNavItem}
          Icon=${PackageIcon}
          label="Packages"
          href="/orgs/${login}/packages"
          aria-current=${active === "packages" && "page"}
        />
        <${UnderlineNavItem}
          Icon=${PersonIcon}
          label="People"
          count=${org?.membersWithRole.totalCount}
          href="/orgs/${login}/people"
          aria-current=${active === "people" && "page"}
        />
        <${UnderlineNavItem}
          Icon=${ProjectIcon}
          label="Projects"
          count=${org?.projects.totalCount}
          href="/orgs/${login}/projects"
          aria-current=${active === "projects" && "page"}
        />
      <//>
    </div>
    <div className="container-xl clearfix px-3 px-md-4 px-lg-5">
      ${children}
    </div>
  </div>`;
}

OrganizationShell.fragments = {
  organization: gql`
    fragment OrganizationShell_organization on Organization {
      id
      login
      projects {
        totalCount
      }
      repositories {
        totalCount
      }
      membersWithRole {
        totalCount
      }
    }
  `,
};

export default OrganizationShell;
