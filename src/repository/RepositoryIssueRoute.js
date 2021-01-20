import { useParams } from "react-router-dom";
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
  ) {
    repository(owner: $owner, name: $name) {
      id
      issue: issueOrPullRequest(number: $number) {
        __typename
        ... on Issue {
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
          ...IssueComment_item
          ...IssueTimeline_issue
        }
      }
      ...IssueTimeline_repository
    }
  }
  ${IssueLabel.fragments.label}
  ${IssueTimeline.fragments.issue}
  ${IssueTimeline.fragments.repository}
  ${IssueComment.fragments.item}
`;

function RepositoryIssueRoute() {
  const matches = useParams();
  const variables = {
    owner: matches.owner,
    name: matches.name,
    number: parseInt(matches.number, 10),
  };
  const [{ data, error, fetching }] = useQuery({ query: QUERY, variables });

  if (error) throw error;
  let content = "...";
  if (data?.repository?.issue) {
    if (data?.repository?.issue.__typename !== "Issue") {
      return "pull";
    }

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
              <${IssueTimeline} repository=${repository} issue=${issue} />
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
