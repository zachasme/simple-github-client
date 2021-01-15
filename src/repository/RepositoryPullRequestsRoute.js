import { html } from "htm/preact";
import useQuery from "../hooks/useQuery.js";
import { useState } from "preact/hooks";
import { gql } from "@urql/preact";

import RelativeTime from "../utilities/RelativeTime.js";
import Link from "../primitives/Link.js";
import IssueLabel from "../primitives/IssueLabel.js";
import ButtonGroup from "../primitives/ButtonGroup.js";
import Button from "../primitives/Button.js";
import Box from "../primitives/Box.js";
import Octicon from "../primitives/Octicon.js";
import Select from "../primitives/Select.js";

import RepositoryShell from "./RepositoryShell.js";

const QUERY = gql`
  query RepositoryIssuesRouteQuery(
    $owner: String!
    $name: String!
    $orderBy: IssueOrder!
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
      pullRequests(first: 20, states: OPEN, orderBy: $orderBy) {
        edges {
          node {
            id
            number
            title
            createdAt
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

function RepositoryPullRequestsRoute({ matches, ...props }) {
  const query = matches.q || "is:issue+is:open";

  const parts = query.split("+");
  for (let part of parts) {
    switch (part) {
      case "in:title":
      case "in:body":
    }
  }

  const [ordering, setOrdering] = useState(ORDERINGS.Newest);
  const variables = {
    orderBy: ordering,
    ...matches,
  };
  const [{ data, fetching, error }] = useQuery({ query: QUERY, variables });

  const ownerWithName = `${matches.owner}/${matches.name}`;

  let content = "...";

  if (error) {
    content = "sorry";
  } else if (data) {
    const { repository } = data;
    content = html`
      <div class="container-xl clearfix px-3 px-md-4 px-lg-5">
        <div
          class="d-flex flex-column-reverse flex-md-row flex-items-stretch width-full mb-md-3"
        >
          <div class="d-flex flex-auto my-4 my-md-0">
            <${Select} label="Filter" title="Filter issues">
              <${Link}
                class="SelectMenu-item"
                role="menuitem"
                href="/${ownerWithName}/issues?q=is%3Aopen"
              >
                Open issues and pull requests
              <//>
              <${Link}
                class="SelectMenu-item"
                role="menuitem"
                href="/${ownerWithName}/issues?q=is%3Aopen+is%3Aissue+author%3A%40me"
              >
                Your issues
              <//>
              <${Link}
                class="SelectMenu-item"
                role="menuitem"
                href="/${ownerWithName}/issues?q=is%3Aopen+is%3Apr+author%3A%40me"
              >
                Your pull requests
              <//>
              <${Link}
                class="SelectMenu-item"
                role="menuitem"
                href="/${ownerWithName}/issues?q=is%3Aopen+assignee%3A%40me"
              >
                Everything assigned to you
              <//>
              <${Link}
                class="SelectMenu-item"
                role="menuitem"
                href="/${ownerWithName}/issues?q=is%3Aopen+mentions%3A%40me"
              >
                Everything mentioning you
              <//>
              <${Link}
                class="SelectMenu-item"
                role="menuitem"
                href="https://docs.github.com/articles/searching-issues"
                target="_blank"
              >
                <${Octicon} name="link-external" />
                <strong>View advanced search syntax</strong>
              <//>
            <//>

            <input
              class="form-control flex-auto"
              type="text"
              placeholder="Search all issues"
              value=${query}
            />
          </div>
          <div class="ml-md-3 d-flex flex-justify-between flex-items-end">
            <${ButtonGroup}>
              <${Button}
                icon="tag"
                href="/${ownerWithName}/labels"
                count=${repository.labels.totalCount}
              >
                Labels
              <//>
              <${Button}
                icon="milestone"
                href="/${ownerWithName}/milestones"
                count=${repository.milestones.totalCount}
              >
                Milestones
              <//>
            <//>

            <${Button}
              primary
              href="/${ownerWithName}/issues/new/choose"
              class="ml-3"
            >
              New issue
            <//>
          </div>
        </div>

        <${Box} condensed class="${fetching ? "bg-gray" : ""}">
          <div class="Box-header">
            <${Select} label="Sort" title="Sort by">
              ${Object.entries(ORDERINGS).map(
                ([label, orderBy]) => html`
                  <button
                    class="SelectMenu-item ${orderBy === ordering
                      ? ""
                      : "pl-6"}"
                    role="menuitem"
                    onClick=${() => setOrdering(orderBy)}
                  >
                    ${orderBy === ordering &&
                    html`<${Octicon} name="check" class="SelectMenu-icon" />`}
                    ${label}
                  </button>
                `
              )}
            <//>
          </div>

          ${repository.pullRequests.edges.map(
            ({ node }) => html`
              <div class="Box-row d-flex">
                <div class="text-green flex-shrink-0 pt-2 pl-3">
                  <span class="tooltipped tooltipped-e" aria-label="Open issue">
                    <${Octicon} name="issue-opened" />
                  </span>
                </div>
                <div class="flex-auto min-width-0 p-2 pr-3 pr-md-2">
                  <a
                    href="/${repository.nameWithOwner}/issues/${node.number}"
                    class="link-gray-dark v-align-middle no-underline h4 js-navigation-open"
                    >${node.title}</a
                  >
                  <span class="labels lh-default d-block d-md-inline">
                    ${node.labels.edges.map(
                      ({ node }) => html`
                        <${IssueLabel}
                          nameWithOwner=${repository.nameWithOwner}
                          label=${node}
                        />
                      `
                    )}
                  </span>
                  <div class="mt-1 text-small text-gray">
                    <span class="opened-by">
                      #${node.number} opened ${" "}
                      <${RelativeTime} date=${node.createdAt} />
                      ${" by "}
                      <a
                        class="muted-link"
                        title="Open issues created by ${node.author?.login ||
                        "ghost"}"
                        href="/${repository.nameWithOwner}/issues?q=is%3Aissue+is%3Aopen+author%3A${node
                          .author?.login || "ghost"}"
                        >${node.author?.login || "ghost"}</a
                      >
                    </span>
                  </div>
                </div>
                <div
                  class="flex-shrink-0 col-3 pt-2 text-right pr-3 no-wrap d-flex hide-sm"
                >
                  <!--info-->
                </div>
              </div>
            `
          )}
        <//>
      </div>
    `;
  }

  return html`
    <${RepositoryShell}
      active="pulls"
      owner=${matches.owner}
      name=${matches.name}
    >
      ${content}
    <//>
  `;
}

export default RepositoryPullRequestsRoute;
