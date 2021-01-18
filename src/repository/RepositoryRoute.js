import { Fragment } from "react";
import { html } from "htm/react";
import { useParams } from "react-router-dom";
import {
  GitBranchIcon,
  TagIcon,
  DownloadIcon,
  LinkIcon,
  FileIcon,
  FileDirectoryIcon,
} from "@primer/octicons-react";

import useQuery from "../hooks/useQuery.js";
import { gql } from "urql";

import Markdown from "../primitives/Markdown.js";
import Link from "../primitives/Link.js";
import Select from "../primitives/Select.js";
import Button from "../primitives/Button.js";

import RepositoryShell from "./RepositoryShell.js";
import RepositoryLanguages from "./RepositoryLanguages.js";
import RepositoryTopics from "./RepositoryTopics.js";

const QUERY = gql`
  query RepositoryRouteQuery($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      viewerCanAdminister
      description
      homepageUrl
      mentionableUsers(first: 11) {
        edges {
          node {
            id
            avatarUrl
            login
          }
        }
        totalCount
      }
      repositoryTopics(first: 10) {
        edges {
          node {
            id
            topic {
              id
              name
            }
          }
        }
      }
      readme: object(expression: "HEAD:README.md") {
        ... on Blob {
          id
          text
        }
      }
      defaultBranchRef {
        id
        target {
          ... on Commit {
            id
            message
            author {
              name
              avatarUrl
              user {
                id
                login
              }
            }
            tree {
              id
              entries {
                oid
                name
                type
              }
            }
          }
        }
      }
      ...RepositoryLanguages_repository
      ...RepositoryTopics_repository
    }
  }
  ${RepositoryLanguages.fragments.repository}
  ${RepositoryTopics.fragments.repository}
`;

function RepositoryRoute() {
  const matches = useParams();
  const [{ data, fetching }] = useQuery({ query: QUERY, variables: matches });

  const ownerWithName = `${matches.owner}/${matches.name}`;

  let content = "";
  if (data && !data.repository) {
    content = "404";
  } else if (data) {
    const { repository } = data;
    content = html`
      <div
        className="container-xl clearfix new-discussion-timeline px-3 px-md-4 px-lg-5"
      >
        <div
          className="gutter-condensed gutter-lg flex-column flex-md-row d-flex"
        >
          <div className="flex-shrink-0 col-12 col-md-9 mb-4 mb-md-0">
            <div className="file-navigation mb-3 d-flex flex-items-start">
              <${Select}
                icon=${html`<${GitBranchIcon} />`}
                label="master"
                title="Switch branches/tags"
              />
              <div
                className="flex-self-center ml-3 flex-self-stretch d-none d-lg-flex flex-items-center lh-condensed-ultra"
              >
                <${Link}
                  href="/${ownerWithName}/branches"
                  className="link-gray-dark no-underline"
                >
                  <${GitBranchIcon} />
                  <strong> 3 </strong>
                  <span className="text-gray-light link-hover-blue"
                    >branches</span
                  >
                <//>
                <${Link}
                  href="/${ownerWithName}/tags"
                  className="ml-3 link-gray-dark no-underline"
                >
                  <${TagIcon} />
                  <strong> 2 </strong>
                  <span className="text-gray-light link-hover-blue">tags</span>
                <//>
              </div>
              <div className="flex-auto"></div>
              <div>
                <${Button} href="/${ownerWithName}/find/main">Go to file<//>
                <${Button} href="#" className="ml-1">Add file<//>
                <${Button} primary href="#" className="ml-1">
                  <${DownloadIcon} className="mr-1" />
                  Code
                <//>
              </div>
            </div>

            <div className="Box Box--blue mb-3">
              <div className="Box-header">
                <div className="css-truncate css-truncate-overflow">
                  <${Link}
                    href="/${repository.defaultBranchRef?.target.author.login}"
                    className="text-bold"
                  >
                    ${repository.defaultBranchRef?.target.author.login}
                  <//>
                  ${repository.defaultBranchRef?.target.message}
                </div>
              </div>
              <ul>
                ${repository.defaultBranchRef?.target.tree.entries.map(
                  (entry) => html`
                    <li key=${entry.oid} className="Box-row py-2">
                      <${entry.type === "tree" ? FileDirectoryIcon : FileIcon}
                        className="mr-3"
                      />
                      ${entry.name}
                    </li>
                  `
                )}
              </ul>
            </div>

            <div className="Box md">
              ${repository.readme &&
              html`
                <${Fragment}>
                  <div className="Box-header">
                    <h2 className="Box-title">README.md</h2>
                  </div>
                  <div className="Box-body px-5 pb-5">
                    <${Markdown} markdown=${repository.readme.text} />
                  </div>
                <//>
              `}
            </div>
          </div>

          <!-- Gutter -->

          <div className="flex-shrink-0 col-12 col-md-3">
            <div
              className="border-bottom border-black-fade py-4 hide-sm hide-md"
            >
              <h2 className="mb-3 h4">
                About${repository.viewerCanAdminister && html`edit?`}
              </h2>
              <p className="f4 mt-3">${repository.description}</p>
              ${repository.homepageUrl &&
              html`
                <div className="mt-3 d-flex flex-items-center">
                  <${LinkIcon} className="flex-shrink-0 mr-2" />
                  <span
                    className="flex-auto min-width-0 css-truncate css-truncate-target width-fit"
                  >
                    <${Link}
                      href="${repository.homepageUrl}"
                      className="text-bold"
                      target="_blank"
                    >
                      ${repository.homepageUrl.replace(/^https?:\/\//, "")}
                    <//>
                  </span>
                </div>
              `}
              <${RepositoryTopics} repository=${repository} />
            </div>
            <div className="border-bottom border-black-fade py-4">
              <h2 className="h4">Releases</h2>
            </div>
            <div className="border-bottom border-black-fade py-4">
              <h2 className="h4">Packages</h2>
            </div>
            <div className="border-bottom border-black-fade py-4">
              <h2 className="mb-3 h4">
                Contributors
                <span className="Counter mr-1">
                  ${repository.mentionableUsers.totalCount}
                </span>
              </h2>
              ${repository.mentionableUsers.edges.map(
                ({ node }) => html`
                  <${Link} key=${node.id} href=${`/${node.login}`}>
                    <img
                      width="32"
                      height="32"
                      className="avatar mb-2"
                      src=${node.avatarUrl}
                    />
                  <//>
                  ${" "}
                `
              )}
              <p>
                <a
                  href="https://github.community/t/graphql-get-repository-contributors/14422/7"
                >
                  Unsupported in GraphQL API
                </a>
              </p>
            </div>
            <div className="py-4">
              <h2 className="mb-3 h4">Languages</h2>
              <${RepositoryLanguages} repository=${repository} />
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return html`
    <${RepositoryShell}
      active="code"
      owner=${matches.owner}
      name=${matches.name}
    >
      ${content}
    <//>
  `;
}

export default RepositoryRoute;
