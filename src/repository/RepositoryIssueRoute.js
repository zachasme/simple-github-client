import { html } from "htm/preact";
import gql from "graphql-tag";
import useQuery from "../hooks/useQuery.js";

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
        ...IssueTimelineIssueComment_comment
        timelineItems(first: 50) {
          edges {
            node {
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
  const [{ data, fetching }] = useQuery({ query: QUERY, variables });

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
          <div class="flex-shrink-0 col-12 col-md-3">sidebar</div>
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
