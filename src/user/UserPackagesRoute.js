import { html } from "htm/react";
import { useParams } from "../common/routing.js";
import { PackageIcon } from "@primer/octicons-react";

import BlankSlate from "../primitives/BlankSlate.js";
import RepositoryOwnerShell from "../repositoryOwner/RepositoryOwnerShell.js";

function UserPackagesRoute({ params: matches }) {
  return html`
    <${RepositoryOwnerShell} login=${matches.login} active="packages">
      <${BlankSlate} Icon=${PackageIcon} title="Not implemented">
        <p>(we haven't implemented this route)</p>
      <//>
    <//>
  `;
}

export default UserPackagesRoute;
