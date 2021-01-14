import { html } from "htm/preact";
import { gql, useMutation } from "@urql/preact";

import { humanReadableNumber } from "../number.js";
import useQuery from "../hooks/useQuery.js";
import Link from "../primitives/Link.js";
import Button from "../primitives/Button.js";
import Octicon from "../primitives/Octicon.js";
import UnderlineNav from "../primitives/UnderlineNav.js";
import UnderlineNavItem from "../primitives/UnderlineNavItem.js";

import { ADD_STAR_MUTATION, REMOVE_STAR_MUTATION } from "./starMutations.js";

const QUERY = gql`
  query RepositoryShellQuery($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      forkCount
      hasProjectsEnabled
      nameWithOwner
      openIssues: issues(states: OPEN) {
        totalCount
      }
      projects {
        totalCount
      }
      pullRequests(states: OPEN) {
        totalCount
      }
      stargazers {
        totalCount
      }
      viewerHasStarred
      watchers(first: 1) {
        totalCount
      }
    }
  }
`;

function RepositoryShell({ active, owner, name, children }) {
  const [addStarResult, addStar] = useMutation(ADD_STAR_MUTATION);
  const [removeStarResult, removeStar] = useMutation(REMOVE_STAR_MUTATION);
  const [{ data, fetching }] = useQuery({
    query: QUERY,
    variables: { owner, name },
  });

  const isMutatingStar =
    fetching || addStarResult.fetching || removeStarResult.fetching;

  const nameWithOwner = `${owner}/${name}`;
  const repo = data?.repository;

  function toggleStar() {
    const mutate = data.repository.viewerHasStarred ? removeStar : addStar;
    mutate({ input: { starrableId: data.repository.id } });
  }
  return html`<div>
    <div class="bg-gray-light pt-3 mb-5">
      <div class="d-flex mb-3 px-3 px-md-4 px-lg-5">
        <nav
          aria-label="Breadcrumb"
          class="flex-auto d-flex flex-wrap flex-items-center break-word f3 text-normal"
        >
          <${Octicon} name="repo" />
          <ol>
            <li class="breadcrumb-item">
              <${Link} href="/${owner}">${owner}<//>
            </li>
            <li class="breadcrumb-item" aria-current="page">
              <${Link} href="/${nameWithOwner}">${name}<//>
            </li>
          </ol>
        </nav>

        <${Button}
          disabled=${!repo}
          small
          onClick=${toggleStar}
          icon="eye"
          count=${repo ? humanReadableNumber(repo.watchers.totalCount) : "-"}
          countHref="/${nameWithOwner}/watchers"
          class="mr-2"
        >
          ${repo?.viewerHasStarred ? "Unwatch" : "Watch"}
        <//>
        <${Button}
          disabled=${isMutatingStar}
          small
          onClick=${toggleStar}
          icon=${repo?.viewerHasStarred ? "star-fill" : "star"}
          count=${repo ? humanReadableNumber(repo.stargazers.totalCount) : "-"}
          countHref="/${nameWithOwner}/stargazers"
          class="mr-2"
        >
          ${repo?.viewerHasStarred ? "Unstar" : "Star"}
        <//>
        <${Button}
          disabled=${!repo}
          small
          icon="repo-forked"
          count=${repo ? humanReadableNumber(repo.forkCount) : "-"}
          countHref="/${nameWithOwner}/network/members"
        >
          Fork
        <//>
      </div>
      <${UnderlineNav}>
        <${UnderlineNavItem}
          icon="code"
          label="Code"
          href="/${repo?.nameWithOwner}"
          aria-current=${active === "code" && "page"}
        />
        <${UnderlineNavItem}
          icon="issue-opened"
          label="Issues"
          count=${repo?.openIssues.totalCount}
          href="/${repo?.nameWithOwner}/issues"
          aria-current=${active === "issues" && "page"}
        />
        <${UnderlineNavItem}
          icon="git-pull-request"
          label="Pull requests"
          count=${repo?.pullRequests.totalCount}
          href="/${repo?.nameWithOwner}/pulls"
          aria-current=${active === "pulls" && "page"}
        />
        ${repo?.hasProjectsEnabled &&
        html`
          <${UnderlineNavItem}
            icon="project"
            label="Projects"
            count=${repo?.projects.totalCount}
            href="/${repo?.nameWithOwner}/projects"
            aria-current=${active === "projects" && "page"}
          />
        `}
      <//>
    </div>
    ${children}
  </div>`;
}

export default RepositoryShell;
