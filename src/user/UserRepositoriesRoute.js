import { html } from "htm/preact";
import useQuery from "../hooks/useQuery.js";
import gql from "graphql-tag";

import RepositoryList from "../repository/RepositoryList.js";
import RepositoryOwnerShell from "../repositoryOwner/RepositoryOwnerShell.js";

const QUERY = gql`
  query UserRepositoriesRouteQuery($login: String!) {
    user(login: $login) {
      id
      ...RepositoryList_repositoryOwner
    }
  }
  ${RepositoryList.fragments.repositoryOwner}
`;

function UserRepositoriesRoute({ matches }) {
  const variables = { login: matches.login };
  const [{ data, fetching }] = useQuery({ query: QUERY, variables });

  return html`
    <${RepositoryOwnerShell} login=${matches.login} active="repositories">
      ${!fetching && html`<${RepositoryList} repositoryOwner=${data.user} />`}
    <//>
  `;
}

export default UserRepositoriesRoute;
