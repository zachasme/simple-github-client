import { html } from "htm/react";
import { useParams } from "../common/routing.js";
import { ProjectIcon } from "@primer/octicons-react";

import BlankSlate from "../primitives/BlankSlate.js";
import RepositoryOwnerShell from "../repositoryOwner/RepositoryOwnerShell.js";

function UserProjectsRoute({ params: matches }) {
  return html`
    <${RepositoryOwnerShell} login=${matches.login} active="projects">
      <${BlankSlate} Icon=${ProjectIcon} title="Not implemented">
        <p>(we haven't implemented this route)</p>
      <//>
    <//>
  `;
}

export default UserProjectsRoute;
