import { html } from "htm/preact";

import BlankSlate from "../primitives/BlankSlate.js";
import RepositoryOwnerShell from "../repositoryOwner/RepositoryOwnerShell.js";

function UserProjectsRoute({ matches }) {
  return html`
    <${RepositoryOwnerShell} login=${matches.login} active="projects">
      <${BlankSlate} icon="project" title="Not implemented">
        <p>(we haven't implemented this route)</p>
      <//>
    <//>
  `;
}

export default UserProjectsRoute;
