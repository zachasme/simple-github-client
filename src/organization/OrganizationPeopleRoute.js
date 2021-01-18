import { html } from "htm/react";
import { useParams } from "react-router-dom";
import useQuery from "../hooks/useQuery.js";
import { gql } from "urql";

import Link from "../primitives/Link.js";
import RepositoryOwnerShell from "../repositoryOwner/RepositoryOwnerShell.js";

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
