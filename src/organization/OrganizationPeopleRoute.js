import { useParams } from "../common/routing.js";
import { html } from "htm/react";
import { gql } from "@apollo/client";

import RepositoryOwnerShell from "../repositoryOwner/RepositoryOwnerShell.js";
import Link from "../primitives/Link.js";
import useQuery from "../graphql/useQuery.js";

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

function OrganizationPeopleRoute({ params: matches }) {
  const variables = {
    ...matches,
  };
  const { data, error } = useQuery(QUERY, { variables });

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
