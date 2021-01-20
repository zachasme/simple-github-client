import { useParams } from "react-router-dom";
import { html } from "htm/react";
import { gql } from "urql";

import RepositoryOwnerShell from "../repositoryOwner/RepositoryOwnerShell.js";
import Link from "../primitives/Link.js";
import useQuery from "../hooks/useQuery.js";

const QUERY = gql`
  query OrganizationPeopleRouteQuery($login: String!) {
    organization(login: $login) {
      id
      membersWithRole(first: 10) {
        edges {
          node {
            id
            login
          }
        }
      }
    }
  }
`;

function OrganizationPeopleRoute() {
  const matches = useParams();
  const variables = {
    ...matches,
  };
  const [{ data, fetching, error }] = useQuery({ query: QUERY, variables });

  let content = "...";

  if (error) {
    content = "sorry";
  } else if (data) {
    const { organization } = data;
    content = html`
      <ol>
        ${organization.membersWithRole.edges.map(
          ({ node }) => html`
            <li key=${node.id}>
              <${Link} href=${`/${node.login}`}>${node.login}<//>
            </li>
          `
        )}
      </ol>
    `;
  }

  return html`
    <${RepositoryOwnerShell} active="people" login=${matches.login}>
      ${content}
    <//>
  `;
}

export default OrganizationPeopleRoute;
