import { html } from "htm/preact";

import BlankSlate from "../primitives/BlankSlate.js";
import RepositoryOwnerShell from "../repositoryOwner/RepositoryOwnerShell.js";

function UserPackagesRoute({ matches }) {
  return html`
    <${RepositoryOwnerShell} login=${matches.login} active="packages">
      <${BlankSlate} icon="package" title="Not implemented">
        <p>(we haven't implemented this route)</p>
      <//>
    <//>
  `;
}

export default UserPackagesRoute;
