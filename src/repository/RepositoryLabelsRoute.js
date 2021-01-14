import { html } from "htm/preact";
import useQuery from "../hooks/useQuery.js";
import gql from "graphql-tag";

import Link from "../primitives/Link.js";
import ButtonGroup from "../primitives/ButtonGroup.js";
import Button from "../primitives/Button.js";
import Label from "../primitives/Label.js";

import RepositoryShell from "./RepositoryShell.js";

const QUERY = gql`
  query RepositoryLabelsRouteQuery($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      nameWithOwner
      labels(first: 10) {
        edges {
          node {
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
  ${Label.fragments.label}
`;

function RepositoryLabelsRoute({ matches }) {
  const variables = {
    owner: matches.owner,
    name: matches.name,
  };
  const [{ data, fetching }] = useQuery({ query: QUERY, variables });

  const ownerWithName = `${matches.owner}/${matches.name}`;

  let content = "...";

  if (data) {
    const { repository } = data;
    content = html`
      <div class="container-xl clearfix px-3 px-md-4 px-lg-5">
        <div
          class="d-flex flex-column-reverse flex-md-row flex-items-stretch width-full mb-md-3"
        >
          <${ButtonGroup}>
            <${Button} selected icon="tag" href="/${ownerWithName}/labels">
              Labels
            <//>
            <${Button} icon="milestone" href="/${ownerWithName}/milestones">
              Milestones
            <//>
          <//>
        </div>

        <div class="Box ${fetching ? "bg-gray" : ""}">
          <div class="Box-header">
            <strong>${repository?.labels?.totalCount} labels</strong>
          </div>

          ${repository?.labels?.edges.map(
            ({ node }) => html`
              <div class="Box-row d-flex">
                <div class="col-3 pr-3">
                  <${Label}
                    nameWithOwner=${repository.nameWithOwner}
                    label=${node}
                  />
                </div>
                <div class="col-4 f6 text-gray pr-3">${node.description}</div>
                <div class="col-3 f6 text-gray pr-3">
                  ${node.issues.totalCount + node.pullRequests.totalCount > 0 &&
                  html`
                    <${Link}
                      href="/${ownerWithName}/issues?q=label%3A%22${node.name}%22+is%3Aopen"
                      class="muted-link"
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
