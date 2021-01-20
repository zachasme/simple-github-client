import { html } from "htm/react";
import { TagIcon, MilestoneIcon } from "@primer/octicons-react";
import { useParams } from "react-router-dom";
import { gql } from "urql";

import useQuery from "../graphql/useQuery.js";
import Link from "../primitives/Link.js";
import ButtonGroup from "../primitives/ButtonGroup.js";
import Button from "../primitives/Button.js";
import IssueLabel from "../primitives/IssueLabel.js";

import RepositoryShell from "./RepositoryShell.js";

const QUERY = gql`
  query RepositoryLabelsRouteQuery($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      nameWithOwner
      labels(first: 10) {
        edges {
          node {
            id
            description
            name
            issues {
              totalCount
            }
            pullRequests {
              totalCount
            }
            ...Label_label
          }
        }
        totalCount
      }
    }
  }
  ${IssueLabel.fragments.label}
`;

function RepositoryLabelsRoute() {
  const matches = useParams();
  const variables = {
    owner: matches.owner,
    name: matches.name,
  };
  const [{ data, stale }] = useQuery({ query: QUERY, variables });

  const ownerWithName = `${matches.owner}/${matches.name}`;

  let content = "...";

  if (data) {
    const { repository } = data;
    content = html`
      <div className="container-xl clearfix px-3 px-md-4 px-lg-5">
        <div
          className="d-flex flex-column-reverse flex-md-row flex-items-stretch width-full mb-md-3"
        >
          <${ButtonGroup}>
            <${Button}
              selected
              icon=${html`<${TagIcon} />`}
              href="/${ownerWithName}/labels"
            >
              Labels
            <//>
            <${Button}
              icon=${html`<${MilestoneIcon} />`}
              href="/${ownerWithName}/milestones"
            >
              Milestones
            <//>
          <//>
        </div>

        <div className="Box ${stale ? "bg-gray" : ""}">
          <div className="Box-header">
            <strong>${repository?.labels?.totalCount} labels</strong>
          </div>

          ${repository?.labels?.edges.map(
            ({ node }) => html`
              <div key=${node.id} className="Box-row d-flex">
                <div className="col-3 pr-3">
                  <${IssueLabel}
                    nameWithOwner=${repository.nameWithOwner}
                    label=${node}
                  />
                </div>
                <div className="col-4 f6 text-gray pr-3">
                  ${node.description}
                </div>
                <div className="col-3 f6 text-gray pr-3">
                  ${node.issues.totalCount + node.pullRequests.totalCount > 0 &&
                  html`
                    <${Link}
                      href="/${ownerWithName}/issues?q=label%3A%22${node.name}%22+is%3Aopen"
                      className="muted-link"
                    >
                      ${node.issues.totalCount + node.pullRequests.totalCount}
                      ${" "}open issues and pull requests
                    <//>
                  `}
                </div>
              </div>
            `
          )}
        </div>
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

export default RepositoryLabelsRoute;
