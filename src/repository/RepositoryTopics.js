import { html } from "htm/preact";
import gql from "graphql-tag";

import Link from "../primitives/Link.js";

function RepositoryTopics({ repository }) {
  return html`
    <div class="mt-3 f6">
      ${repository.repositoryTopics.edges.map(
        ({ node }) => html`
          <${Link}
            class="Label Label--blue mr-1 mb-1"
            href="/topics/${node.topic.name}"
          >
            ${node.topic.name}
          <//>
        `
      )}
    </div>
  `;
}

RepositoryTopics.fragments = {
  repository: gql`
    fragment RepositoryTopics_repository on Repository {
      repositoryTopics(first: 10) {
        edges {
          node {
            id
            topic {
              id
              name
            }
          }
        }
      }
    }
  `,
};

export default RepositoryTopics;
