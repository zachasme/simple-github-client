import { ProjectIcon } from "@primer/octicons-react";
import { useParams } from "../common/routing.js";
import { html } from "htm/react";
import { gql } from "@apollo/client";

import RepositoryOwnerShell from "../repositoryOwner/RepositoryOwnerShell.js";
import BlankSlate from "../primitives/BlankSlate.js";
import useQuery from "../graphql/useQuery.js";

const QUERY = gql`
  query OrganizationProjectsRouteQuery($login: String!) {
    organization(login: $login) {
      id
      name
      projects {
        totalCount
      }
    }
  }
`;

function OrganizationProjectsRoute({ params: matches }) {
  const variables = {
    login: matches.login,
  };
  const { data } = useQuery(QUERY, { variables });

  return html`
    <${RepositoryOwnerShell} active="projects" login=${matches.login}>
      <${BlankSlate}
        Icon=${ProjectIcon}
        title="${data?.organization?.name ||
        matches.login} doesn’t have any public projects."
      >
        <p>(actually we haven't implemented this route)</p>
      <//>
    <//>
  `;
}

export default OrganizationProjectsRoute;
