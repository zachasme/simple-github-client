import { html } from "htm/react";
import { gql } from "@apollo/client";
import {
  StarIcon,
  RepoForkedIcon,
  LawIcon,
  InfoIcon,
  GitPullRequestIcon,
} from "@primer/octicons-react";

import RepositoryTopics from "./RepositoryTopics.js";

import RelativeTime from "../common/RelativeTime.js";
import Link from "../primitives/Link.js";
import UserLink from "../user/UserLink.js";
import Language from "../primitives/Language.js";

function RepositoryList(props) {
  const { repositoryOwner } = props;
  console.log("EYO", repositoryOwner);
  return html`
    <ol className="list-style-none">
      ${repositoryOwner.repositories.edges.map(
        ({ node: repo }) => html`
          <li key=${repo.id} className="py-4 border-bottom">
            <h3>
              <${UserLink} login=${repo.owner.login} />
              <span> / </span>
              <${Link} href=${`/${repo.owner.login}/${repo.name}`}>
                ${repo.name}
              <//>
            </h3>
            <p className="col-9 d-inline-block text-gray mb-2 pr-4">
              ${repo.description}
            </p>
            <${RepositoryTopics} repository=${repo} />
            <div className="f6 text-gray mt-2">
              ${repo.primaryLanguage &&
              html`<${Language} language=${repo.primaryLanguage} />`}
              ${repo.stargazers.totalCount > 0 &&
              html`
                <${Link}
                  href="/${repo.nameWithOwner}/stargazers"
                  className="muted-link mr-3"
                >
                  <${StarIcon} />
                  ${repo.stargazers.totalCount}
                <//>
              `}
              ${repo.forkCount > 0 &&
              html`
                <${Link}
                  href="/${repo.nameWithOwner}/network/members"
                  className="muted-link mr-3"
                >
                  <${RepoForkedIcon} />
                  ${repo.forkCount}
                <//>
              `}
              ${repo.licenseInfo?.featured &&
              html`
                <span className="mr-3">
                  <${LawIcon} className="mr-1" />
                  ${repo.licenseInfo.spdxId}
                </span>
              `}
              ${repo.issues.totalCount > 0 &&
              html`
                <${Link} href="/${repo.nameWithOwner}/issues" className="muted-link mr-3">
                  <${InfoIcon}/>
                  <span> ${repo.issues.totalCount} </span>
                </span>
              `}
              ${repo.pullRequests.totalCount > 0 &&
              html`
                <${Link}
                  href="/${repo.nameWithOwner}/pulls"
                  className="muted-link mr-3"
                >
                  <${GitPullRequestIcon} />
                  <span> ${repo.pullRequests.totalCount} </span>
                <//>
              `}
              ${"Updated "}
              <${RelativeTime} date=${repo.pushedAt} />
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
