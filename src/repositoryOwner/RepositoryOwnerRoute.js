import { html } from "htm/react";
import useQuery from "../hooks/useQuery.js";
import { gql } from "urql";
import { useParams } from "react-router-dom";

import UserProfile from "../user/UserProfile.js";
import OrganizationProfile from "../organization/OrganizationProfile.js";
import RepositoryOwnerShell from "./RepositoryOwnerShell.js";

const QUERY = gql`
  query RepositoryOwnerRouteQuery($login: String!) {
    repositoryOwner(login: $login) {
      id

      ... on User {
        ...UserProfile_user
      }

      ... on Organization {
        ...OrganizationProfile_organization
      }

      __typename
    }
  }
  ${OrganizationProfile.fragments.organization}
  ${UserProfile.fragments.user}
`;

function RepositoryOwnerRoute() {
  const matches = useParams();
  const [{ data, fetching }] = useQuery({
    query: QUERY,
    variables: matches,
  });

  let content = null;
  if (fetching) {
    content = html`<p>fetching...</p>`;
  } else if (data && !data.repositoryOwner) {
    content = html`<p>404</p>`;
  } else if (data.repositoryOwner.__typename === "User") {
    content = html`<${UserProfile} user=${data.repositoryOwner} />`;
  } else if (data.repositoryOwner.__typename === "Organization") {
    content = html`
      <${OrganizationProfile} organization=${data.repositoryOwner} />
    `;
  }
  return html`<${RepositoryOwnerShell} login=${matches.login}>${content}<//>`;
}

export default RepositoryOwnerRoute;
