import { html } from "htm/react";
import { Fragment } from "react";
import { gql } from "urql";
import { DotFillIcon } from "@primer/octicons-react";

import Link from "../primitives/Link.js";

function RepositoryLanguages({ repository }) {
  function percentage(size) {
    return ((size / repository.languages.totalSize) * 100).toFixed(1);
  }

  const shownSize = repository.languages.edges.reduce(
    (sum, edge) => sum + edge.size,
    0
  );

  return html`
    <${Fragment}>
      <div className="mb-2">
        <span className="Progress">
          ${repository.languages.edges.map(
            ({ node, size }) => html`
              <span
                key=${node.id}
                className="Progress-item"
                style=${{
                  width: `${percentage(size)}%`,
                  backgroundColor: `${node.color}`,
                }}
              />
            `
          )}
        </span>
      </div>
      <ul className="list-style-none">
        ${repository.languages.edges.map(
          ({ node, size }) => html`<li key=${node.id} className="d-inline">
            <${Link}
              href="/${repository.nameWithOwner}/search?l=${node.name}"
              className="d-inline-flex flex-items-center flex-nowrap link-gray no-underline text-small mr-3"
            >
              <${DotFillIcon} style=${{ color: node.color }} />
              <span className="text-gray-dark text-bold mr-1">
                ${node.name}
              </span>
              <span>${percentage(size)}%</span>
            <//>
          </li>`
        )}
        ${repository.languages.totalCount > 6 &&
        html`
          <li className="d-inline">
            <span
              className="d-inline-flex flex-items-center flex-nowrap text-small mr-3"
            >
              <${DotFillIcon} style=${{ color: "#ededed" }} />
              <span className="text-gray-dark text-bold mr-1">Other</span>
              <span>
                ${percentage(repository.languages.totalSize - shownSize)}%
              </span>
            </span>
          </li>
        `}
      </ul>
    <//>
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
