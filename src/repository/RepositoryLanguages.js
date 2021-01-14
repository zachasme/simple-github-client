import { html } from "htm/preact";
import { gql } from "@urql/preact";

import Link from "../primitives/Link.js";
import Octicon from "../primitives/Octicon.js";

function RepositoryLanguages({ repository }) {
  function percentage(size) {
    return ((size / repository.languages.totalSize) * 100).toFixed(1);
  }

  const shownSize = repository.languages.edges.reduce(
    (sum, edge) => sum + edge.size,
    0
  );

  return html`
    <div class="mb-2">
      <span class="Progress">
        ${repository.languages.edges.map(
          ({ node, size }) => html`
            <span
              class="Progress-item"
              ...${{
                style: `
                width: ${percentage(size)}%;
                background-color: ${node.color};
              `,
              }}
            />
          `
        )}
      </span>
    </div>
    <ul class="list-style-none">
      ${repository.languages.edges.map(
        ({ node, size }) => html`<li class="d-inline">
          <${Link}
            href="/${repository.nameWithOwner}/search?l=${node.name}"
            class="d-inline-flex flex-items-center flex-nowrap link-gray no-underline text-small mr-3"
          >
            <${Octicon}
              name="dot-fill"
              ...${{
                style: `color: ${node.color};`,
              }}
            />
            <span class="text-gray-dark text-bold mr-1"> ${node.name} </span>
            <span>${percentage(size)}%</span>
          <//>
        </li>`
      )}
      ${repository.languages.totalCount > 6 &&
      html`
        <li class="d-inline">
          <span
            class="d-inline-flex flex-items-center flex-nowrap text-small mr-3"
          >
            <${Octicon}
              name="dot-fill"
              ...${{
                style: `color: #ededed;`,
              }}
            />
            <span class="text-gray-dark text-bold mr-1">Other</span>
            <span>
              ${percentage(repository.languages.totalSize - shownSize)}%
            </span>
          </span>
        </li>
      `}
    </ul>
  `;
}

RepositoryLanguages.fragments = {
  repository: gql`
    fragment RepositoryLanguages_repository on Repository {
      nameWithOwner
      languages(first: 6, orderBy: { field: SIZE, direction: DESC }) {
        edges {
          size
          node {
            id
            name
            color
          }
        }
        totalSize
        totalCount
      }
    }
  `,
};

export default RepositoryLanguages;
