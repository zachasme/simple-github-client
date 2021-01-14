import { html } from "htm/preact";
import { gql } from "@urql/preact";

import useQuery from "../hooks/useQuery.js";
import Link from "../primitives/Link.js";

import RepositoryShell from "./RepositoryShell.js";
import Label from "../primitives/Label.js";
import TimelineItem from "../timeline/TimelineItem.js";
import IssueTimelineIssueComment from "../timeline/IssueTimelineIssueComment.js";

const QUERY = gql`
  query RepositoryIssueRouteQuery(
    $owner: String!
    $name: String!
    $number: Int!
  ) {
    repository(owner: $owner, name: $name) {
      id
      issue(number: $number) {
        id
        title
        assignees(first: 10) {
          nodes {
            id
            avatarUrl
            login
          }
        }
        labels(first: 10) {
          nodes {
            id
            ...Label_label
          }
        }
        ...IssueTimelineIssueComment_comment
        timelineItems(first: 50) {
          edges {
            node {
              ... on Node {
                id
              }
              ...TimelineItem_issueTimelineItems
            }
          }
        }
      }
      ...TimelineItem_repository
    }
  }
  ${Label.fragments.label}
  ${TimelineItem.fragments.issueTimelineItems}
  ${TimelineItem.fragments.repository}
  ${IssueTimelineIssueComment.fragments.comment}
`;

function RepositoryIssueRoute({ matches }) {
  const variables = {
    owner: matches.owner,
    name: matches.name,
    number: parseInt(matches.number, 10),
  };
  const [{ data, error, fetching }] = useQuery({ query: QUERY, variables });

  if (error) throw error;

  let content = "...";
  if (data?.repository?.issue) {
    const { repository } = data;
    content = html`
      <div class="container-xl clearfix px-3 px-md-4 px-lg-5">
        <div class="">
          <h1 class="mb-2 lh-condensed f1-light mr-0 flex-auto break-word">
            <span>${repository.issue.title}</span>
            ${" "}
            <span class="text-gray-light">#${matches.number}</span>
          </h1>
        </div>

        <div class="gutter-condensed gutter-lg flex-column flex-md-row d-flex">
          <div class="ml-6 pl-3 flex-shrink-0 col-12 col-md-9 mb-4 mb-md-0">
            <${IssueTimelineIssueComment} comment=${repository.issue} />
            ${repository.issue.timelineItems.edges.map(
              ({ node }) =>
                html`<${TimelineItem}
                  repository=${repository}
                  timelineItem=${node}
                />`
            )}
          </div>

          <!-- Gutter -->

          <div class="flex-shrink-0 col-12 col-md-3 text-small">
            <div class="border-bottom border-black-fade py-4">
              <h2 class="mb-2 h6 text-gray">Assignees</h2>
              <ol>
                ${repository.issue.assignees.nodes.map(
                  (node) => html`
                    <${Link}
                      href=${`/${node.login}`}
                      class="text-bold link-gray-dark"
                    >
                      <img
                        width="16"
                        height="16"
                        class="avatar mb-2 mr-1"
                        src=${node.avatarUrl}
                      />
                      ${node.login}
                    <//>
                    ${" "}
                  `
                )}
              </ol>
            </div>
            <div class="border-bottom border-black-fade py-4">
              <h2 class="mb-2 h6 text-gray">Labels</h2>
              <span class="labels d-flex flex-wrap">
                ${repository.issue.labels.nodes.map(
                  (label) => html`
                    <${Label}
                      class="mr-1 mb-1"
                      nameWithOwner=${repository.nameWithOwner}
                      label=${label}
                    />
                  `
                )}
              </span>
            </div>
          </div>
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

export default RepositoryIssueRoute;
