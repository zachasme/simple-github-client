import { html } from "htm/preact";
import useQuery from "../hooks/useQuery.js";
import gql from "graphql-tag";

import Markdown from "../primitives/Markdown.js";
import Link from "../primitives/Link.js";
import Select from "../primitives/Select.js";
import Button from "../primitives/Button.js";
import Octicon from "../primitives/Octicon.js";

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
              avatarUrl
              user {
                id
                login
              }
            }
            tree {
              id
              entries {
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

function RepositoryRoute({ matches }) {
  const [{ data, fetching }] = useQuery({ query: QUERY, variables: matches });

  const ownerWithName = `${matches.owner}/${matches.name}`;

  let content = "";
  if (data && !data.repository) {
    content = html`404`;
  } else if (data) {
    const { repository } = data;
    console.log(repository);
    content = html`
      <div
        class="container-xl clearfix new-discussion-timeline  px-3 px-md-4 px-lg-5"
      >
        <div class="gutter-condensed gutter-lg flex-column flex-md-row d-flex">
          <div class="flex-shrink-0 col-12 col-md-9 mb-4 mb-md-0">
            <div class="file-navigation mb-3 d-flex flex-items-start">
              <${Select}
                icon="git-branch"
                label="master"
                title="Switch branches/tags"
              />
              <div
                class="flex-self-center ml-3 flex-self-stretch d-none d-lg-flex flex-items-center lh-condensed-ultra"
              >
                <${Link}
                  href="/${ownerWithName}/branches"
                  class="link-gray-dark no-underline"
                >
                  <${Octicon} name="git-branch" />
                  <strong> 3 </strong>
                  <span class="text-gray-light link-hover-blue">branches</span>
                <//>
                <${Link}
                  href="/${ownerWithName}/tags"
                  class="ml-3 link-gray-dark no-underline"
                >
                  <${Octicon} name="tag" />
                  <strong> 2 </strong>
                  <span class="text-gray-light link-hover-blue">tags</span>
                <//>
              </div>
              <div class="flex-auto"></div>
              <div>
                <${Button} href="/${ownerWithName}/find/main">Go to file<//>
                <${Button} href="#" class="ml-1">Add file<//>
                <${Button} primary href="#" class="ml-1">
                  <${Octicon} name="download" class="mr-1" />
                  Code
                <//>
              </div>
            </div>

            <div class="Box Box--blue mb-3">
              <div class="Box-header">
                <div class="css-truncate css-truncate-overflow">
                  <${Link}
                    href="/${repository.defaultBranchRef?.target.author.login}"
                    class="text-bold"
                  >
                    ${repository.defaultBranchRef?.target.author.login}
                  <//>
                  ${repository.defaultBranchRef?.target.message}
                </div>
              </div>
              <ul>
                ${repository.defaultBranchRef?.target.tree.entries.map(
                  (entry) => html`
                    <li class="Box-row py-2">
                      <${Octicon}
                        name=${entry.type === "tree"
                          ? "file-directory"
                          : "file"}
                        class="mr-3"
                      />
                      ${entry.name}
                    </li>
                  `
                )}
              </ul>
            </div>

            <div class="Box md">
              ${repository.readme &&
              html`
                <div class="Box-header">
                  <h2 class="Box-title">README.md</h2>
                </div>
                <div class="Box-body px-5 pb-5">
                  <${Markdown} markdown=${repository.readme.text} />
                </div>
              `}
            </div>
          </div>

          <!-- Gutter -->

          <div class="flex-shrink-0 col-12 col-md-3">
            <div class="border-bottom border-black-fade py-4 hide-sm hide-md">
              <h2 class="mb-3 h4">
                About${repository.viewerCanAdminister && html`edit?`}
              </h2>
              <p class="f4 mt-3">${repository.description}</p>
              ${repository.homepageUrl &&
              html`
                <div class="mt-3 d-flex flex-items-center">
                  <${Octicon} name="link" class="flex-shrink-0 mr-2" />
                  <span
                    class="flex-auto min-width-0 css-truncate css-truncate-target width-fit"
                  >
                    <${Link}
                      href="${repository.homepageUrl}"
                      class="text-bold"
                      target="_blank"
                    >
                      ${repository.homepageUrl.replace(/^https?:\/\//, "")}
                    <//>
                  </span>
                </div>
              `}
              <${RepositoryTopics} repository=${repository} />
            </div>
            <div class="border-bottom border-black-fade py-4">
              <h2 class="h4">Releases</h2>
            </div>
            <div class="border-bottom border-black-fade py-4">
              <h2 class="h4">Packages</h2>
            </div>
            <div class="border-bottom border-black-fade py-4">
              <h2 class="mb-3 h4">
                Contributors
                <span class="Counter mr-1">
                  ${repository.mentionableUsers.totalCount}
                </span>
              </h2>
              ${repository.mentionableUsers.edges.map(
                ({ node }) => html`
                  <${Link} href=${`/${node.login}`}>
                    <img
                      width="32"
                      height="32"
                      class="avatar mb-2"
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
            <div class="py-4">
              <h2 class="mb-3 h4">Languages</h2>
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
