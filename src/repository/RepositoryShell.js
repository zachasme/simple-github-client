import { html } from "htm/preact";
import { gql, useMutation } from "@urql/preact";

import { humanReadableNumber } from "../number.js";
import useQuery from "../hooks/useQuery.js";
import Link from "../primitives/Link.js";
import Button from "../primitives/Button.js";
import Select from "../primitives/Select.js";
import Octicon from "../primitives/Octicon.js";
import UnderlineNav from "../primitives/UnderlineNav.js";
import UnderlineNavItem from "../primitives/UnderlineNavItem.js";

import { ADD_STAR_MUTATION, REMOVE_STAR_MUTATION } from "./starMutations.js";
import { UPDATE_SUBSCRIPTION_MUTATION } from "./subscriptionMutations.js";
import { useToast } from "../toast/ToastContext.js";

const QUERY = gql`
  query RepositoryShellQuery($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      isPrivate
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
      watchers {
        totalCount
      }
      viewerSubscription
    }
  }
`;

function RepositoryShell({ active, owner, name, children }) {
  const [updateSubscriptionResult, updateSubscription] = useMutation(
    UPDATE_SUBSCRIPTION_MUTATION
  );
  const [addStarResult, addStar] = useMutation(ADD_STAR_MUTATION);
  const [removeStarResult, removeStar] = useMutation(REMOVE_STAR_MUTATION);
  const [{ data, fetching }] = useQuery({
    query: QUERY,
    variables: { owner, name },
  });
  const { addToast } = useToast();

  const isMutatingStar = addStarResult.fetching || removeStarResult.fetching;

  const nameWithOwner = `${owner}/${name}`;
  const repo = data?.repository;

  function toggleStar() {
    const mutate = data.repository.viewerHasStarred ? removeStar : addStar;
    mutate({ input: { starrableId: data.repository.id } });
  }

  function setSubscription(state) {
    if (state === "CUSTOM") {
      return addToast({
        type: "error",
        message: "Custom notification settings not supported in GraphQL API",
      });
    }
    updateSubscription({
      input: { subscribableId: repo.id, state },
    });
  }

  let watchLabel;
  switch (repo?.viewerSubscription) {
    case "SUBSCRIBED":
      watchLabel = "Unwatch";
      break;
    case "IGNORED":
      watchLabel = "Stop ignoring";
      break;
    default:
      watchLabel = "Watch";
  }

  return html`<div>
    <div class="bg-gray-light pt-3 mb-5">
      <div class="d-flex mb-3 px-3 px-md-4 px-lg-5">
        <nav
          aria-label="Breadcrumb"
          class="flex-auto d-flex flex-wrap flex-items-center break-word f3 text-normal"
        >
          <${Octicon} name=${repo?.isPrivate ? "lock" : "repo"} />
          <ol>
            <li class="breadcrumb-item">
              <${Link} href="/${owner}">${owner}<//>
            </li>
            <li class="breadcrumb-item" aria-current="page">
              <${Link} href="/${nameWithOwner}" class="text-bold"> ${name} <//>
            </li>
          </ol>
          ${repo?.isPrivate &&
          html`<span class="Label Label--gray  ml-1">Private</span>`}
        </nav>

        <${Select}
          disabled=${updateSubscriptionResult.fetching}
          small
          icon=${repo?.viewerSubscription === "IGNORED" ? "bell-slash" : "eye"}
          label=${watchLabel}
          title="Notifications"
          count=${repo ? humanReadableNumber(repo.watchers.totalCount) : "-"}
          countHref="/${nameWithOwner}/watchers"
          class="mr-2"
        >
          <button
            disabled=${updateSubscriptionResult.fetching}
            onClick=${() => setSubscription("UNSUBSCRIBED")}
            aria-checked=${repo?.viewerSubscription === "UNSUBSCRIBED"}
            class="SelectMenu-item flex-items-start"
            role="menuitem"
          >
            <${Octicon}
              name="check"
              class="SelectMenu-icon SelectMenu-icon--check"
            />
            <div>
              <div class="f5 text-bold">Participating and @mentions</div>
              <div class="text-small text-gray text-normal pb-1">
                Only receive notifications from this repository when
                participating or @mentioned.
              </div>
            </div>
          <//>
          <button
            disabled=${updateSubscriptionResult.fetching}
            onClick=${() => setSubscription("SUBSCRIBED")}
            aria-checked=${repo?.viewerSubscription === "SUBSCRIBED"}
            class="SelectMenu-item flex-items-start"
            role="menuitem"
          >
            <${Octicon}
              name="check"
              class="SelectMenu-icon SelectMenu-icon--check"
            />
            <div>
              <div class="f5 text-bold">All activity</div>
              <div class="text-small text-gray text-normal pb-1">
                Notified of all notifications on this repository.
              </div>
            </div>
          <//>
          <button
            disabled=${updateSubscriptionResult.fetching}
            onClick=${() => setSubscription("IGNORED")}
            aria-checked=${repo?.viewerSubscription === "IGNORED"}
            class="SelectMenu-item flex-items-start"
            role="menuitem"
          >
            <${Octicon}
              name="check"
              class="SelectMenu-icon SelectMenu-icon--check"
            />
            <div>
              <div class="f5 text-bold">Ignore</div>
              <div class="text-small text-gray text-normal pb-1">
                Never be notified.
              </div>
            </div>
          <//>
          <button
            disabled=${updateSubscriptionResult.fetching}
            onClick=${() => setSubscription("CUSTOM")}
            class="SelectMenu-item flex-items-start"
            role="menuitem"
          >
            <${Octicon}
              name="check"
              class="SelectMenu-icon SelectMenu-icon--check"
            />
            <div>
              <div class="f5 text-bold">Custom</div>
              <div class="text-small text-gray text-normal pb-1">
                Select events you want to be notified of in addition to
                participating and @mentions.
              </div>
            </div>
          <//>
        <//>

        <${Button}
          disabled=${!repo || isMutatingStar}
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
