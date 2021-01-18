import { html } from "htm/react";
import { useParams } from "react-router-dom";
import { PackageIcon } from "@primer/octicons-react";

import BlankSlate from "../primitives/BlankSlate.js";
import RepositoryOwnerShell from "../repositoryOwner/RepositoryOwnerShell.js";

function UserPackagesRoute() {
  const matches = useParams();
  return html`
    <${RepositoryOwnerShell} login=${matches.login} active="packages">
      <${BlankSlate} Icon=${PackageIcon} title="Not implemented">
        <p>(we haven't implemented this route)</p>
      <//>
    <//>
  `;
}

export default UserPackagesRoute;
