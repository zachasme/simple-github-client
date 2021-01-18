import { html } from "htm/react";
import { useParams } from "react-router-dom";
import useQuery from "../hooks/useQuery.js";
import { gql } from "urql";

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

function UserRepositoriesRoute() {
  const matches = useParams();
  const variables = { login: matches.login };
  const [{ data, fetching }] = useQuery({ query: QUERY, variables });

  return html`
    <${RepositoryOwnerShell} login=${matches.login} active="repositories">
      ${!fetching && html`<${RepositoryList} repositoryOwner=${data.user} />`}
    <//>
  `;
}

export default UserRepositoriesRoute;
