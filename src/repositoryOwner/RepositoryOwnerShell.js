import { html } from "htm/react";
import { gql } from "urql";

import useQuery from "../graphql/useQuery.js";
import UserShell from "../user/UserShell.js";
import OrganizationShell from "../organization/OrganizationShell.js";

const QUERY = gql`
  query RepositoryOwnerShellQuery($login: String!) {
    repositoryOwner(login: $login) {
      id

      ... on Organization {
        id
        ...OrganizationShell_organization
      }

      ... on User {
        id
        ...UserShell_user
      }

      __typename
    }
  }
  ${OrganizationShell.fragments.organization}
  ${UserShell.fragments.user}
`;

function RepositoryOwnerShell({ login, ...props }) {
  const [{ data, fetching }] = useQuery({
    query: QUERY,
    variables: { login },
  });

  if (fetching) return html`<p>fetching...</p>`;
  if (data && !data.repositoryOwner) return html`<p>404</p>`;

  const { repositoryOwner } = data;

  if (repositoryOwner.__typename === "User") {
    let active = props.active || "overview";
    return html`<${UserShell}
      user=${repositoryOwner}
      ...${props}
      active=${active}
    />`;
  } else {
    let active = props.active || "repositories";
    return html`<${OrganizationShell}
      organization=${repositoryOwner}
      ...${props}
      active=${active}
    />`;
  }
}

export default RepositoryOwnerShell;
