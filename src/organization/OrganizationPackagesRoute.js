import { html } from "htm/preact";

import RepositoryOwnerShell from "../repositoryOwner/RepositoryOwnerShell.js";
import BlankSlate from "../primitives/BlankSlate.js";
import Box from "../primitives/Box.js";

function OrganizationPackagesRoute({ matches }) {
  return html`
    <${RepositoryOwnerShell} active="packages" login=${matches.login}>
      <${Box}>
        <${BlankSlate}
          spacious
          icon="package"
          title="There aren’t any packages here"
        >
          <p>(actually we haven't implemented this route)</p>
        <//>
      <//>
    <//>
  `;
}

export default OrganizationPackagesRoute;
