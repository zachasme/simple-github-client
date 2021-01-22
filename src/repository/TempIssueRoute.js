import { useState } from "react";
import { html } from "htm/react";
import { gql, useQuery } from "urql";

const QUERY = gql`
  query RepositoryIssueRouteQuery(
    $owner: String!
    $name: String!
    $number: Int!
    $after: String
    $before: String
  ) {
    repository(owner: $owner, name: $name) {
      id
      issue(number: $number) {
        id
        title
        forward: timelineItems(first: 5, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ... on Node {
              id
            }
          }
        }
        timelineItems(last: 5, before: $before) {
          pageInfo {
            hasPreviousPage
            startCursor
          }
          nodes {
            ... on Node {
              id
            }
          }
        }
      }
    }
  }
`;

function RepositoryIssueRoute() {
  const matchesFromRouter = {
    owner: "FormidableLabs",
    name: "urql",
    number: "201",
  };

  const [cursor, setCursor] = useState(null);
  const variables = {
    owner: matchesFromRouter.owner,
    name: matchesFromRouter.name,
    number: parseInt(matchesFromRouter.number, 10),
    after: cursor,
  };

  const [{ data, error, stale }] = useQuery({
    query: QUERY,
    variables,
  });
  console.log(data?.repository?.issue?.forward?.pageInfo, cursor);
  function handleLoadMore() {
    setCursor(data.repository.issue.forward.pageInfo.endCursor);
  }

  if (error) throw error;

  if (!data?.repository?.issue) return "please wait...";

  const { repository } = data;
  const { issue } = repository;

  return html`
    <div>
      <h1>${issue.title} #${issue.number}</h1>
      <div>
        ${issue.forward.nodes.map(
          (node) => html`<p key=${node.id}>${node.id}</p>`
        )}

        <button type="button" onClick=${handleLoadMore} disabled=${stale}>
          Load more…
        </button>

        ${issue.backward.nodes.map(
          (node) => html`<p key=${node.id}>${node.id}</p>`
        )}
      </div>
    </div>
  `;
}

export default RepositoryIssueRoute;
