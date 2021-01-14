import { html } from "htm/preact";
import { gql } from "@urql/preact";

import { humanReadableNumber } from "../number.js";

import Link from "../primitives/Link.js";
import Octicon from "../primitives/Octicon.js";
import Language from "../primitives/Language.js";

function UserProfile({ user }) {
  return html`
    <div class="mt-4">
      <h2 class="f4 mb-2 text-normal">Pinned</h2>
      <ol
        class="d-flex flex-wrap list-style-none gutter-condensed mb-4 js-pinned-items-reorder-list"
      >
        ${user.pinnedItems.nodes.map(
          (node) => html`
            <li
              class="col-12 col-md-6 col-lg-6 mb-3 d-flex flex-content-stretch"
            >
              <div class="Box p-3 width-full">
                <${Link} class="text-bold" href=${`/${node.nameWithOwner}`}>
                  <span class="text-normal">${node.owner.login}</span>
                  <span>/</span>
                  <span>${node.name}</span>
                <//>
                <p class="text-gray text-small mt-2 mb-3">
                  ${node.description}
                </p>
                <p class="text-gray text-small">
                  <${Language} language=${node.primaryLanguage} />
                  ${node.stargazers.totalCount > 0 &&
                  html`
                    <${Link}
                      href="/${node.nameWithOwner}/stargazers"
                      class="muted-link mr-3"
                    >
                      <${Octicon} name="star" class="mr-1" />
                      ${humanReadableNumber(node.stargazers.totalCount)}
                    <//>
                  `}
                  ${node.forkCount > 0 &&
                  html`
                    <${Link}
                      href="/${node.nameWithOwner}/network/members"
                      class="muted-link mr-3"
                    >
                      <${Octicon} name="repo-forked" class="mr-1" />
                      ${humanReadableNumber(node.forkCount)}
                    <//>
                  `}
                </p>
              </div>
            </li>
          `
        )}
      </ol>
    </div>
  `;
}

UserProfile.fragments = {
  user: gql`
    fragment UserProfile_user on User {
      avatarUrl
      login
      name
      bio
      pinnedItems(first: 10) {
        nodes {
          ... on Repository {
            id
            description
            name
            owner {
              id
              login
            }
            nameWithOwner
            forkCount
            stargazers {
              totalCount
            }
            primaryLanguage {
              id
              ...Language_language
            }
          }
        }
      }
      organizations(first: 10) {
        edges {
          node {
            id
            login
            avatarUrl
          }
        }
      }
    }
    ${Language.fragments.language}
  `,
};

export default UserProfile;
