import { html } from "htm/react";
import { gql, useMutation } from "urql";
import {
  BellSlashIcon,
  CheckIcon,
  CodeIcon,
  EyeIcon,
  GitPullRequestIcon,
  IssueOpenedIcon,
  LockIcon,
  ProjectIcon,
  RepoForkedIcon,
  RepoIcon,
  StarFillIcon,
  StarIcon,
} from "@primer/octicons-react";

import { humanReadableNumber } from "../number.js";
import useQuery from "../hooks/useQuery.js";
import Link from "../primitives/Link.js";
import Button from "../primitives/Button.js";
import Select from "../primitives/Select.js";
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
    <div className="bg-gray-light pt-3 mb-5">
      <div className="d-flex mb-3 px-3 px-md-4 px-lg-5">
        <nav
          aria-label="Breadcrumb"
          className="flex-auto d-flex flex-wrap flex-items-center break-word f3 text-normal"
        >
          ${repo?.isPrivate ? html`<${LockIcon} />` : html`<${RepoIcon} />`}
          <ol>
            <li className="breadcrumb-item">
              <${Link} href="/${owner}">${owner}<//>
            </li>
            <li className="breadcrumb-item" aria-current="page">
              <${Link} href="/${nameWithOwner}" className="text-bold">
                ${name}
              <//>
            </li>
          </ol>
          ${repo?.isPrivate &&
          html`<span className="Label Label--gray  ml-1">Private</span>`}
        </nav>

        <${Select}
          disabled=${updateSubscriptionResult.fetching}
          small
          icon=${repo?.viewerSubscription === "IGNORED"
            ? html`<${BellSlashIcon} />`
            : html`<${EyeIcon} />`}
          label=${watchLabel}
          title="Notifications"
          count=${repo ? humanReadableNumber(repo.watchers.totalCount) : "-"}
          countHref="/${nameWithOwner}/watchers"
          className="mr-2"
        >
          <button
            disabled=${updateSubscriptionResult.fetching}
            onClick=${() => setSubscription("UNSUBSCRIBED")}
            aria-checked=${repo?.viewerSubscription === "UNSUBSCRIBED"}
            className="SelectMenu-item flex-items-start"
            role="menuitem"
          >
            <${CheckIcon} className="SelectMenu-icon SelectMenu-icon--check" />
            <div>
              <div className="f5 text-bold">Participating and @mentions</div>
              <div className="text-small text-gray text-normal pb-1">
                Only receive notifications from this repository when
                participating or @mentioned.
              </div>
            </div>
          <//>
          <button
            disabled=${updateSubscriptionResult.fetching}
            onClick=${() => setSubscription("SUBSCRIBED")}
            aria-checked=${repo?.viewerSubscription === "SUBSCRIBED"}
            className="SelectMenu-item flex-items-start"
            role="menuitem"
          >
            <${CheckIcon} className="SelectMenu-icon SelectMenu-icon--check" />
            <div>
              <div className="f5 text-bold">All activity</div>
              <div className="text-small text-gray text-normal pb-1">
                Notified of all notifications on this repository.
              </div>
            </div>
          <//>
          <button
            disabled=${updateSubscriptionResult.fetching}
            onClick=${() => setSubscription("IGNORED")}
            aria-checked=${repo?.viewerSubscription === "IGNORED"}
            className="SelectMenu-item flex-items-start"
            role="menuitem"
          >
            <${CheckIcon} className="SelectMenu-icon SelectMenu-icon--check" />
            <div>
              <div className="f5 text-bold">Ignore</div>
              <div className="text-small text-gray text-normal pb-1">
                Never be notified.
              </div>
            </div>
          <//>
          <button
            disabled=${updateSubscriptionResult.fetching}
            onClick=${() => setSubscription("CUSTOM")}
            className="SelectMenu-item flex-items-start"
            role="menuitem"
          >
            <${CheckIcon} className="SelectMenu-icon SelectMenu-icon--check" />
            <div>
              <div className="f5 text-bold">Custom</div>
              <div className="text-small text-gray text-normal pb-1">
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
          icon=${repo?.viewerHasStarred
            ? html`<${StarFillIcon} />`
            : html`<${StarIcon} />`}
          count=${repo ? humanReadableNumber(repo.stargazers.totalCount) : "-"}
          countHref="/${nameWithOwner}/stargazers"
          className="mr-2"
        >
          ${repo?.viewerHasStarred ? "Unstar" : "Star"}
        <//>
        <${Button}
          disabled=${!repo}
          small
          icon=${html`<${RepoForkedIcon} />`}
          count=${repo ? humanReadableNumber(repo.forkCount) : "-"}
          countHref="/${nameWithOwner}/network/members"
        >
          Fork
        <//>
      </div>
      <${UnderlineNav}>
        <${UnderlineNavItem}
          Icon=${CodeIcon}
          label="Code"
          href="/${repo?.nameWithOwner}"
          aria-current=${active === "code" && "page"}
        />
        <${UnderlineNavItem}
          Icon=${IssueOpenedIcon}
          label="Issues"
          count=${repo?.openIssues.totalCount}
          href="/${repo?.nameWithOwner}/issues"
          aria-current=${active === "issues" && "page"}
        />
        <${UnderlineNavItem}
          Icon=${GitPullRequestIcon}
          label="Pull requests"
          count=${repo?.pullRequests.totalCount}
          href="/${repo?.nameWithOwner}/pulls"
          aria-current=${active === "pulls" && "page"}
        />
        ${repo?.hasProjectsEnabled &&
        html`
          <${UnderlineNavItem}
            Icon=${ProjectIcon}
            label="Projects"
            count=${repo?.projects.totalCount}
            href="/orgs/${owner}/projects"
            aria-current=${active === "projects" && "page"}
          />
        `}
      <//>
    </div>
    ${children}
  </div>`;
}

export default RepositoryShell;
