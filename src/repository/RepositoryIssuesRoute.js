import {
  TagIcon,
  MilestoneIcon,
  IssueOpenedIcon,
  CheckIcon,
  LinkExternalIcon,
} from "@primer/octicons-react";
import { useParams } from "react-router-dom";
import { html } from "htm/react";
import { useState } from "react";
import { gql } from "urql";

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
      issues(first: 20, states: OPEN, orderBy: $orderBy) {
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

function RepositoryIssuesRoute() {
  const matches = useParams();
  const [query, setQuery] = useState(matches.q || "is:issue+is:open");

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
      <div className="container-xl clearfix px-3 px-md-4 px-lg-5">
        <div
          className="d-flex flex-column-reverse flex-md-row flex-items-stretch width-full mb-md-3"
        >
          <div className="d-flex flex-auto my-4 my-md-0">
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
              value=${query}
              onInput=${(e) => setQuery(e.target.value)}
            />
          </div>
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

        <${Box} condensed className="${fetching ? "bg-gray" : ""}">
          <div className="Box-header">
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

          ${repository.issues.edges.map(
            ({ node }) => html`
              <div key=${node.id} className="Box-row d-flex">
                <div className="text-green flex-shrink-0 pt-2 pl-3">
                  <span
                    className="tooltipped tooltipped-e"
                    aria-label="Open issue"
                  >
                    <${IssueOpenedIcon} />
                  </span>
                </div>
                <div className="flex-auto min-width-0 p-2 pr-3 pr-md-2">
                  <${Link}
                    to="/${repository.nameWithOwner}/issues/${node.number}"
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
                        to="/${repository.nameWithOwner}/issues?q=is%3Aissue+is%3Aopen+author%3A${node
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
      active="issues"
      owner=${matches.owner}
      name=${matches.name}
    >
      ${content}
    <//>
  `;
}

export default RepositoryIssuesRoute;
