import { html } from "htm/preact";
import useQuery from "../hooks/useQuery.js";
import gql from "graphql-tag";

import RepositoryOwnerShell from "../repositoryOwner/RepositoryOwnerShell.js";
import BlankSlate from "../primitives/BlankSlate.js";

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

function OrganizationProjectsRoute({ matches }) {
  const variables = {
    login: matches.login,
  };
  const [{ data }] = useQuery({ query: QUERY, variables });

  return html`
    <${RepositoryOwnerShell} active="projects" login=${matches.login}>
      <${BlankSlate}
        icon="project"
        title="${data?.organization?.name ||
        matches.login} doesn’t have any public projects."
      >
        <p>(actually we haven't implemented this route)</p>
      <//>
    <//>
  `;
}

export default OrganizationProjectsRoute;
