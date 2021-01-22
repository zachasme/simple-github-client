import { useParams } from "react-router-dom";
import { useState } from "react";
import { html } from "htm/react";
import { gql } from "urql";

import IssueComment from "../timeline/IssueComment.js";
import RelativeTime from "../common/RelativeTime.js";
import IssueState from "../primitives/IssueState.js";
import IssueLabel from "../primitives/IssueLabel.js";
import IssueTimeline from "../timeline/IssueTimeline.js";
import useQuery from "../graphql/useQuery.js";
import UserLink from "../user/UserLink.js";
import Link from "../primitives/Link.js";

import RepositoryShell from "./RepositoryShell.js";

const QUERY = gql`
  query RepositoryIssueRouteQuery(
    $owner: String!
    $name: String!
    $number: Int!
    $after: String
  ) {
    repository(owner: $owner, name: $name) {
      id
      issueOrPullRequest(number: $number) {
        __typename
        ... on Node {
          id
        }
      }
      issue(number: $number) {
        id
        title
        author {
          login
        }
        createdAt
        state
        comments {
          totalCount
        }
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
        forward: timelineItems(
          first: 30
          after: $after
          itemTypes: [
            ASSIGNED_EVENT
            CLOSED_EVENT
            CROSS_REFERENCED_EVENT
            ISSUE_COMMENT
            LABELED_EVENT
            RENAMED_TITLE_EVENT
            REFERENCED_EVENT
            UNLABELED_EVENT
          ]
        ) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ...IssueTimeline_issueTimelineItems
          }
        }
        ...IssueComment_comment
        ...IssueComment_reactable
      }
      ...IssueTimeline_repository
    }
  }
  ${IssueLabel.fragments.label}
  ${IssueTimeline.fragments.repository}
  ${IssueTimeline.fragments.issueTimelineItems}
  ${IssueComment.fragments.comment}
  ${IssueComment.fragments.reactable}
`;

function RepositoryIssueRoute() {
  const [cursor, setCursor] = useState(null);
  const matches = useParams();
  const variables = {
    owner: matches.owner,
    name: matches.name,
    number: parseInt(matches.number, 10),
    after: cursor,
  };
  const [{ data, error, fetching, stale }] = useQuery({
    query: QUERY,
    variables,
  });

  function handleLoadMore() {
    setCursor(data.repository.issue.forward.pageInfo.endCursor);
  }

  if (error) throw error;
  let content = "...";
  if (
    data?.repository?.issueOrPullRequest &&
    data?.repository?.issueOrPullRequest.__typename !== "Issue"
  ) {
    return "pull";
  }
  if (data?.repository?.issue) {
    const { repository } = data;
    const { issue } = repository;

    content = html`
      <div className="container-xl clearfix px-3 px-md-4 px-lg-5">
        <div className="border-bottom pb-3">
          <h1 className="mb-2 lh-condensed f1-light mr-0 flex-auto break-word">
            <span>${issue.title}</span>
            ${" "}
            <span className="text-gray-light">#${matches.number}</span>
          </h1>
          <div className="d-flex flex-items-center flex-wrap">
            <div className="flex-shrink-0 mr-2">
              <${IssueState} state=${issue.state} />
            </div>
            <div className="flex-auto text-gray-light">
              ${issue.author
                ? html`<${UserLink} login=${issue.author.login} />`
                : "x"}
              ${" opened this issue "}
              <${RelativeTime} date=${issue.createdAt} />
              ${` · ${issue.comments.totalCount} `}
              ${issue.comments.totalCount === 1 ? "comment" : "comments"}
            </div>
          </div>
        </div>

        <div
          className="gutter-condensed gutter-lg flex-column flex-md-row d-flex"
        >
          <div className="flex-shrink-0 col-12 col-md-9 mb-4 mb-md-0">
            <div className="ml-6 pl-3">
              <${IssueComment} item=${issue} />
              <${IssueTimeline}
                repository=${repository}
                issueTimelineItems=${issue.forward.nodes}
              />
              <div>
                <p>xxx hidden items</p>
                <p>total: ${issue.forward.totalCount}</p>
                <button
                  type="button"
                  onClick=${handleLoadMore}
                  disabled=${stale}
                >
                  Load more…
                </button>
              </div>
            </div>
          </div>

          <!-- Gutter -->

          <div className="flex-shrink-0 col-12 col-md-3 text-small">
            <div className="border-bottom border-black-fade py-4">
              <h2 className="mb-2 h6 text-gray">Assignees</h2>
              <ol>
                ${issue.assignees.length
                  ? issue.assignees.nodes.map(
                      (node) => html`
                        <${Link}
                          key=${node.id}
                          href=${`/${node.login}`}
                          className="text-bold link-gray-dark"
                        >
                          <img
                            width="16"
                            height="16"
                            className="avatar mb-2 mr-1"
                            src=${node.avatarUrl}
                          />
                          ${node.login}
                        <//>
                        ${" "}
                      `
                    )
                  : "No one is assigned"}
              </ol>
            </div>
            <div className="border-bottom border-black-fade py-4">
              <h2 className="mb-2 h6 text-gray">Labels</h2>
              <span className="labels d-flex flex-wrap">
                ${issue.labels.nodes.length
                  ? issue.labels.nodes.map(
                      (label) => html`
                        <${IssueLabel}
                          key=${label.id}
                          className="mr-1 mb-1"
                          nameWithOwner=${repository.nameWithOwner}
                          label=${label}
                        />
                      `
                    )
                  : "None yet"}
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
