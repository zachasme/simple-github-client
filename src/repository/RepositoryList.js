import { html } from "htm/preact";
import gql from "graphql-tag";

import RepositoryTopics from "./RepositoryTopics.js";

import Link from "../primitives/Link.js";
import Octicon from "../primitives/Octicon.js";
import Language from "../primitives/Language.js";

function RepositoryList({ repositoryOwner, ...props }) {
  return html`
    <ol class="list-style-none">
      ${repositoryOwner.repositories.edges.map(
        ({ node: repo }) => html`
          <li class="py-4 border-bottom">
            <h3>
              <${Link} href=${`/${repo.owner.login}`}>${repo.owner.login}<//>
              <span> / </span>
              <${Link} href=${`/${repo.owner.login}/${repo.name}`}>
                ${repo.name}
              <//>
            </h3>
            <p class="col-9 d-inline-block text-gray mb-2 pr-4">
              ${repo.description}
            </p>
            <${RepositoryTopics} repository=${repo} />
            <div class="f6 text-gray mt-2">
              ${repo.primaryLanguage &&
              html`<${Language} language=${repo.primaryLanguage} />`}
              ${repo.stargazers.totalCount > 0 &&
              html`
                <a
                  href="/${repo.nameWithOwner}/stargazers"
                  class="muted-link mr-3"
                >
                  <${Octicon} name="star" />
                  ${repo.stargazers.totalCount}
                <//>
              `}
              ${repo.forkCount > 0 &&
              html`
                <a
                  href="/${repo.nameWithOwner}/network/members"
                  class="muted-link mr-3"
                >
                  <${Octicon} name="repo-forked" />
                  ${repo.forkCount}
                <//>
              `}
              ${repo.licenseInfo?.featured &&
              html`
                <span class="mr-3">
                  <${Octicon} name="law" class="mr-1" />
                  ${repo.licenseInfo.spdxId}
                </span>
              `}
              ${repo.issues.totalCount > 0 &&
              html`
                <${Link} href="/${repo.nameWithOwner}/issues" class="muted-link mr-3">
                  <${Octicon} name="info" />
                  <span> ${repo.issues.totalCount} </span>
                </span>
              `}
              ${repo.pullRequests.totalCount > 0 &&
              html`
                <${Link}
                  href="/${repo.nameWithOwner}/pulls"
                  class="muted-link mr-3"
                >
                  <${Octicon} name="git-pull-request" />
                  <span> ${repo.pullRequests.totalCount} </span>
                <//>
              `}
              ${"Updated "}
              <relative-time datetime="${repo.pushedAt}">
                on ${repo.pushedAt}
              </relative-time>
            </div>
          </li>
        `
      )}
    </ol>
  `;
}

RepositoryList.fragments = {
  repositoryOwner: gql`
    fragment RepositoryList_repositoryOwner on RepositoryOwner {
      id
      repositories(first: 10) {
        edges {
          node {
            id
            description
            forkCount
            issues(first: 1) {
              totalCount
            }
            licenseInfo {
              id
              featured
              spdxId
            }
            name
            owner {
              id
              login
            }
            nameWithOwner
            primaryLanguage {
              id
              color
              name
            }
            pullRequests(first: 1) {
              totalCount
            }
            stargazers(first: 1) {
              totalCount
            }
            pushedAt
            ...RepositoryTopics_repository
          }
        }
      }
    }
    ${RepositoryTopics.fragments.repository}
  `,
};

export default RepositoryList;
