import {
  TagIcon,
  MilestoneIcon,
  IssueOpenedIcon,
  CheckIcon,
  LinkExternalIcon,
  CommentIcon,
  IssueClosedIcon,
} from "@primer/octicons-react";
import { useLocation } from "../common/routing.js";
import { html } from "htm/react";
import { useState } from "react";
import { gql } from "@apollo/client";

import { searchMerge } from "../common/url.js";
import { humanReadableList } from "../common/text.js";
import ButtonGroup from "../primitives/ButtonGroup.js";
import RelativeTime from "../common/RelativeTime.js";
import IssueLabel from "../primitives/IssueLabel.js";
import useQuery from "../graphql/useQuery.js";
import Button from "../primitives/Button.js";
import Select from "../primitives/Select.js";
import Link from "../primitives/Link.js";
import Box from "../primitives/Box.js";

import RepositoryShell from "./RepositoryShell.js";

const QUERY = gql`
  query RepositoryIssuesRouteQuery(
    $owner: String!
    $name: String!
    $orderBy: IssueOrder!
    $states: [IssueState!]
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    repository(owner: $owner, name: $name) {
      id
      nameWithOwner
      labels {
        totalCount
      }
      milestones {
        totalCount
      }
      issues(
        first: $first
        after: $after
        last: $last
        before: $before
        states: $states
        orderBy: $orderBy
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        edges {
          node {
            isReadByViewer
            id
            number
            state
            title
            createdAt
            assignees(first: 10) {
              nodes {
                id
                login
                avatarUrl
              }
            }
            comments {
              totalCount
            }
            author {
              id: login
              login
            }
            labels(first: 10) {
              edges {
                node {
                  id
                  ...Label_label
                }
              }
            }
          }
        }
      }
    }
  }
  ${IssueLabel.fragments.label}
`;

const ORDERINGS = {
  Newest: { field: "CREATED_AT", direction: "DESC" },
  Oldest: { field: "CREATED_AT", direction: "ASC" },
  "Most commented": { field: "COMMENTS", direction: "DESC" },
  "Least commented": { field: "COMMENTS", direction: "ASC" },
  "Recently updated": { field: "UPDATED_AT", direction: "DESC" },
  "Least recently updated": { field: "UPDATED_AT", direction: "ASC" },
};

function RepositoryIssuesRoute({ params: matches }) {
  const [location, setLocation] = useLocation();
  console.log(location);
  const search = new URLSearchParams(location.search);
  const query = search.get("q") || "is:issue is:open";
  const [queryInput, setQueryInput] = useState(query);
  const issueStates = [];
  if (query.includes("is:open")) issueStates.push("OPEN");
  if (query.includes("is:closed")) issueStates.push("CLOSED");

  const parts = query.split("+");
  for (let part of parts) {
    switch (part) {
      case "in:title":
      case "in:body":
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    setLocation({
      search: searchMerge(search, {
        q: queryInput.replace(" ", "+"),
      }),
    });
  }

  const [ordering, setOrdering] = useState(ORDERINGS.Newest);
  const variables = {
    orderBy: ordering,
    owner: matches.owner,
    name: matches.name,
    states: issueStates,
  };
  const after = search.get("after");
  const before = search.get("before");
  if (before) {
    variables.last = 25;
    variables.before = before;
  } else {
    variables.first = 25;
    variables.after = after;
  }
  const { data, loading, error } = useQuery(QUERY, { variables });
  console.debug("[RepositoryIssuesRoute] query:", data);

  const ownerWithName = `${matches.owner}/${matches.name}`;

  let content = "...";

  if (error) {
    content = "sorry";
  } else if (data) {
    const { repository } = data;

    const openClosed = html`
      <div className="flex-auto pl-0">
        <${Link}
          href="/${repository.nameWithOwner}/issues?q=is%3Aopen+is%3Aissue"
          className="link-gray-dark ${issueStates.includes("OPEN")
            ? "text-bold"
            : "link-gray"}"
          data-ga-click="Issues, Table state, Open"
        >
          <${IssueOpenedIcon} className="mr-2" />
          532 Open
        <//>

        <${Link}
          href="/${repository.nameWithOwner}/issues?q=is%3Aissue+is%3Aclosed"
          className="ml-4 link-gray-dark ${issueStates.includes("CLOSED")
            ? "text-bold"
            : "link-gray"}"
          data-ga-click="Issues, Table state, Closed"
        >
          <${CheckIcon} className="mr-2" />
          9,429 Closed
        <//>
      </div>
    `;

    content = html`
      <div className="container-xl clearfix px-3 px-md-4 px-lg-5">
        <div
          className="d-flex flex-column-reverse flex-md-row flex-items-stretch width-full mb-md-3"
        >
          <form
            className="d-flex flex-auto my-4 my-md-0"
            onSubmit=${handleSearch}
          >
            <${Select} label="Filter" title="Filter issues">
              <${Link}
                className="SelectMenu-item"
                role="menuitem"
                href="/${ownerWithName}/issues?q=is%3Aopen"
              >
                Open issues and pull requests
              <//>
              <${Link}
                className="SelectMenu-item"
                role="menuitem"
                href="/${ownerWithName}/issues?q=is%3Aopen+is%3Aissue+author%3A%40me"
              >
                Your issues
              <//>
              <${Link}
                className="SelectMenu-item"
                role="menuitem"
                href="/${ownerWithName}/issues?q=is%3Aopen+is%3Apr+author%3A%40me"
              >
                Your pull requests
              <//>
              <${Link}
                className="SelectMenu-item"
                role="menuitem"
                href="/${ownerWithName}/issues?q=is%3Aopen+assignee%3A%40me"
              >
                Everything assigned to you
              <//>
              <${Link}
                className="SelectMenu-item"
                role="menuitem"
                href="/${ownerWithName}/issues?q=is%3Aopen+mentions%3A%40me"
              >
                Everything mentioning you
              <//>
              <${Link}
                className="SelectMenu-item"
                role="menuitem"
                href="https://docs.github.com/articles/searching-issues"
                target="_blank"
              >
                <${LinkExternalIcon} />
                <strong>View advanced search syntax</strong>
              <//>
            <//>

            <input
              className="form-control flex-auto"
              type="text"
              placeholder="Search all issues"
              value=${queryInput}
              onInput=${(e) => setQueryInput(e.target.value)}
            />
          </form>
          <div className="ml-md-3 d-flex flex-justify-between flex-items-end">
            <${ButtonGroup}>
              <${Button}
                icon=${html`<${TagIcon} />`}
                href="/${ownerWithName}/labels"
                count=${repository.labels.totalCount}
              >
                Labels
              <//>
              <${Button}
                icon=${html`<${MilestoneIcon} />`}
                href="/${ownerWithName}/milestones"
                count=${repository.milestones.totalCount}
              >
                Milestones
              <//>
            <//>

            <${Button}
              primary
              href="/${ownerWithName}/issues/new/choose"
              className="ml-3"
            >
              New issue
            <//>
          </div>
        </div>

        <div className="d-block d-lg-none no-wrap">${openClosed}</div>

        <${Box} condensed className="mt-3 ${loading ? "bg-gray" : ""}">
          <div className="Box-header d-flex flex-justify-between">
            <div className="flex-auto d-flex min-width-0 flex-items-center">
              <div className="flex-auto d-none d-lg-block no-wrap">
                ${openClosed}
              </div>
              <div
                className="table-list-header-toggle no-wrap d-flex flex-auto flex-justify-between flex-sm-justify-start flex-lg-justify-end"
              >
                <${Select} label="Sort" title="Sort by">
                  ${Object.entries(ORDERINGS).map(
                    ([label, orderBy]) => html`
                      <button
                        key=${label}
                        className="SelectMenu-item ${orderBy === ordering
                          ? ""
                          : "pl-6"}"
                        role="menuitem"
                        onClick=${() => setOrdering(orderBy)}
                      >
                        ${orderBy === ordering &&
                        html`<${CheckIcon} className="SelectMenu-icon" />`}
                        ${label}
                      </button>
                    `
                  )}
                <//>
              </div>
            </div>
          </div>

          ${repository.issues.edges.map(
            ({ node }) => html`
              <div
                key=${node.id}
                className=${`Box-row d-flex ${
                  !node.isReadByViewer && "Box-row--unread"
                }`}
              >
                <div
                  className="${node.state === "CLOSED"
                    ? "text-red"
                    : "text-green"} flex-shrink-0 pt-2 pl-3"
                >
                  <span
                    className="tooltipped tooltipped-e"
                    aria-label="${node.state} issue"
                  >
                    ${node.state === "OPEN" && html`<${IssueOpenedIcon} />`}
                    ${node.state === "CLOSED" && html`<${IssueClosedIcon} />`}
                  </span>
                </div>
                <div className="flex-auto min-width-0 p-2 pr-3 pr-md-2">
                  <${Link}
                    href="/${repository.nameWithOwner}/issues/${node.number}"
                    className="link-gray-dark v-align-middle no-underline h4 js-navigation-open"
                  >
                    ${node.title}
                  <//>
                  <span className="labels lh-default d-block d-md-inline">
                    ${node.labels.edges.map(
                      ({ node }) => html`
                        <${IssueLabel}
                          key=${node.id}
                          nameWithOwner=${repository.nameWithOwner}
                          label=${node}
                        />
                      `
                    )}
                  </span>
                  <div className="mt-1 text-small text-gray">
                    <span className="opened-by">
                      #${node.number} opened ${" "}
                      <${RelativeTime} date=${node.createdAt} />
                      ${" by "}
                      <${Link}
                        className="muted-link"
                        title="Open issues created by ${node.author?.login ||
                        "ghost"}"
                        href="/${repository.nameWithOwner}/issues?q=is%3Aissue+is%3Aopen+author%3A${node
                          .author?.login || "ghost"}"
                      >
                        ${node.author?.login || "ghost"}
                      <//>
                    </span>
                  </div>
                </div>
                <div
                  className="flex-shrink-0 col-3 pt-2 text-right pr-3 no-wrap d-flex hide-sm"
                >
                  <span className="ml-2 flex-1 flex-shrink-0"> </span>

                  <span className="ml-2 flex-1 flex-shrink-0">
                    ${node.assignees.nodes.length > 0 &&
                    html`
                      <div
                        className="AvatarStack AvatarStack--right ml-2 flex-1 flex-shrink-0 "
                      >
                        <div
                          className="AvatarStack-body tooltipped tooltipped-sw tooltipped-multiline tooltipped-align-right-1"
                          aria-label="Assigned to ${humanReadableList(
                            node.assignees.nodes
                              .map((node) => node.login)
                              .reverse()
                          )}"
                        >
                          ${node.assignees.nodes.map(
                            (node) => html`
                              <${Link}
                                key=${node.id}
                                className="avatar avatar-user"
                                aria-label="nrabinowitz’s assigned issues"
                                href="/${repository.nameWithOwner}/issues?q=assignee%3A${node.login}+is%3Aopen"
                              >
                                <img
                                  className="from-avatar avatar-user"
                                  src=${node.avatarUrl}
                                  alt="@${node.login}"
                                  width="20"
                                  height="20"
                                />
                              <//>
                            `
                          )}
                        </div>
                      </div>
                    `}
                  </span>

                  <span className="ml-2 flex-1 flex-shrink-0">
                    ${node.comments.totalCount > 0 &&
                    html`
                      <${Link}
                        href="/${repository.nameWithOwner}/issues/${node.number}"
                        className="muted-link"
                        aria-label="${node.comments.totalCount} comments"
                      >
                        <${CommentIcon} />
                        ${" "}
                        <span className="text-small text-bold">
                          ${node.comments.totalCount}
                        </span>
                      <//>
                    `}
                  </span>
                </div>
              </div>
            `
          )}
        <//>
        <nav className="paginate-container" aria-label="Pagination">
          <div className="pagination">
            ${repository.issues.pageInfo.hasPreviousPage
              ? html`
                  <${Link}
                    className="previous_page"
                    rel="next"
                    href=${{
                      search: searchMerge(search, {
                        before: repository.issues.pageInfo.startCursor,
                      }),
                    }}
                    aria-label="Previous Page"
                  >
                    Previous
                  <//>
                `
              : html`
                  <span className="previous_page" aria-disabled="true">
                    Previous
                  </span>
                `}
            ${repository.issues.pageInfo.hasNextPage
              ? html`
                  <${Link}
                    aria-disabled=${!repository.issues.pageInfo.hasNextPage}
                    className="next_page"
                    rel="next"
                    href=${{
                      search: searchMerge(search, {
                        after: repository.issues.pageInfo.endCursor,
                      }),
                    }}
                    aria-label="Next Page"
                  >
                    Next
                  <//>
                `
              : html`
                  <span className="next_page" aria-disabled="true">Next</span>
                `}
          </div>
        </nav>
      </div>
    `;
  }

  return html`
    <${RepositoryShell}
      active="issues"
      owner=${matches.owner}
      name=${matches.name}
    >
      ${content}
    <//>
  `;
}

export default RepositoryIssuesRoute;
