import { PackageIcon } from "@primer/octicons-react";
import { useParams } from "react-router-dom";
import { html } from "htm/react";

import RepositoryOwnerShell from "../repositoryOwner/RepositoryOwnerShell.js";
import BlankSlate from "../primitives/BlankSlate.js";
import Box from "../primitives/Box.js";

function OrganizationPackagesRoute() {
  const matches = useParams();

  return html`
    <${RepositoryOwnerShell} active="packages" login=${matches.login}>
      <${Box}>
        <${BlankSlate}
          Icon=${PackageIcon}
          spacious
          title="There aren’t any packages here"
        >
          <p>(actually we haven't implemented this route)</p>
        <//>
      <//>
    <//>
  `;
}

export default OrganizationPackagesRoute;
