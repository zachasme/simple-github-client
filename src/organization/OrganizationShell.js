import { html } from "htm/preact";
import { gql } from "@urql/preact";

import Link from "../primitives/Link.js";
import UnderlineNav from "../primitives/UnderlineNav.js";
import UnderlineNavItem from "../primitives/UnderlineNavItem.js";

function OrganizationShell({ active, organization, children }) {
  const org = organization;
  const { login } = org;

  return html`<div>
    <div class="bg-gray-light pt-3 mb-5">
      <div class="d-flex mb-3 px-3 px-md-4 px-lg-5">
        <div class="flex-auto min-width-0 width-fit mr-3">
          <nav
            aria-label="Breadcrumb"
            class="d-flex flex-wrap flex-items-center break-word f3 text-normal"
          >
            <ol>
              <li class="breadcrumb-item" aria-current="page">
                <${Link} href="/${login}">${login}<//>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <${UnderlineNav}>
        <${UnderlineNavItem}
          icon="repo"
          label="Repositories"
          count=${org?.repositories.totalCount}
          href="/${login}"
          aria-current=${active === "repositories" && "page"}
        />
        <${UnderlineNavItem}
          icon="package"
          label="Packages"
          href="/orgs/${login}/packages"
          aria-current=${active === "packages" && "page"}
        />
        <${UnderlineNavItem}
          icon="person"
          label="People"
          count=${org?.membersWithRole.totalCount}
          href="/orgs/${login}/people"
          aria-current=${active === "people" && "page"}
        />
        <${UnderlineNavItem}
          icon="project"
          label="Projects"
          count=${org?.projects.totalCount}
          href="/orgs/${login}/projects"
          aria-current=${active === "projects" && "page"}
        />
      <//>
    </div>
    <div class="container-xl clearfix px-3 px-md-4 px-lg-5">${children}</div>
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
