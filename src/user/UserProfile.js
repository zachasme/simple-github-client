import { html } from "htm/react";
import { gql } from "@apollo/client";
import { StarIcon, RepoForkedIcon } from "@primer/octicons-react";

import { humanReadableNumber } from "../common/number.js";

import Link from "../primitives/Link.js";
import Language from "../primitives/Language.js";

function UserProfile({ user }) {
  return html`
    <div className="mt-4">
      <h2 className="f4 mb-2 text-normal">Pinned</h2>
      <ol
        className="d-flex flex-wrap list-style-none gutter-condensed mb-4 js-pinned-items-reorder-list"
      >
        ${user.pinnedItems.nodes.map(
          (node) => html`
            <li
              key=${node.id}
              className="col-12 col-md-6 col-lg-6 mb-3 d-flex flex-content-stretch"
            >
              <div className="Box p-3 width-full">
                <${Link} className="text-bold" href=${`/${node.nameWithOwner}`}>
                  <span className="text-normal">${node.owner.login}</span>
                  <span>/</span>
                  <span>${node.name}</span>
                <//>
                <p className="text-gray text-small mt-2 mb-3">
                  ${node.description}
                </p>
                <p className="text-gray text-small">
                  <${Language} language=${node.primaryLanguage} />
                  ${node.stargazers.totalCount > 0 &&
                  html`
                    <${Link}
                      href="/${node.nameWithOwner}/stargazers"
                      className="muted-link mr-3"
                    >
                      <${StarIcon} className="mr-1" />
                      ${humanReadableNumber(node.stargazers.totalCount)}
                    <//>
                  `}
                  ${node.forkCount > 0 &&
                  html`
                    <${Link}
                      href="/${node.nameWithOwner}/network/members"
                      className="muted-link mr-3"
                    >
                      <${RepoForkedIcon} className="mr-1" />
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
