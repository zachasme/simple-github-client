import { html } from "htm/react";
import { print } from "graphql";
import useQuery from "../graphql/useQuery.js";
import { gql } from "@apollo/client";

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

function UserRepositoriesRoute({ params: matches }) {
  const variables = { login: matches.login };
  const { data, loading, error } = useQuery(QUERY, { variables });
  if (error) throw error;

  console.log("@@", loading, data);
  console.log(print(QUERY));

  return html`
    <${RepositoryOwnerShell} login=${matches.login} active="repositories">
      ${data?.user?.repositories &&
      html`<${RepositoryList} repositoryOwner=${data.user} />`}
    <//>
  `;
}

export default UserRepositoriesRoute;
