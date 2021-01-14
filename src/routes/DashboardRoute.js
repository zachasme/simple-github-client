import { html } from "htm/preact";
import useQuery from "../hooks/useQuery.js";
import gql from "graphql-tag";

import Link from "../primitives/Link.js";
import Select from "../primitives/Select.js";
import Octicon from "../primitives/Octicon.js";
import Button from "../primitives/Button.js";

const QUERY = gql`
  query DashboardRouteQuery {
    viewer {
      id
      login
      avatarUrl
      topRepositories(
        first: 10
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        edges {
          node {
            id
            name
            nameWithOwner
            isPrivate
            isFork
          }
        }
      }
      organizations(first: 10) {
        edges {
          node {
            id
            login
            avatarUrl
          }
        }
      }
    }
  }
`;

function repoIconName(repository) {
  const { isFork, isPrivate } = repository;
  if (isPrivate) return "lock";
  if (isFork) return "git-fork";
  else return "repo";
}
function repoIconColor(repository) {
  if (repository.isPrivate) return "yellow";
  else return "gray";
}

function DashboardRoute() {
  const [{ data }] = useQuery({ query: QUERY });

  return html`
    <div class="d-flex flex-wrap bg-gray height-full">
      <aside
        class="col-12 col-md-4 col-lg-3 bg-white border-right border-bottom px-3 py-3"
      >
        <div class="border-bottom py-3 mb-4">
          <${Select}
            label=${html`
              <img class="avatar avatar-1 mr-2" src=${data?.viewer.avatarUrl} />
              <strong>${data?.viewer?.login}</strong>
            `}
            title="Switch dashboard context"
          >
            <${Link} class="SelectMenu-item" role="menuitem" href="/">
              <${Octicon} name="check" class="SelectMenu-icon" />
              <img
                class="avatar avatar-1 mr-2"
                alt="jonrohan"
                src=${data?.viewer?.avatarUrl}
              />
              <span>${data?.viewer?.login}</span>
            <//>
            ${data?.viewer?.organizations?.edges?.map(
              ({ node }) => html`
                <${Link}
                  class="SelectMenu-item pl-6"
                  role="menuitem"
                  href="/orgs/${node.login}/dashboard"
                >
                  <img
                    class="avatar avatar-1 mr-2"
                    alt="jonrohan"
                    src=${node.avatarUrl}
                  />
                  <span>${node.login}</span>
                <//>
              `
            )}
            <${Link}
              class="SelectMenu-item"
              role="menuitem"
              href="/account/organizations"
            >
              <${Octicon} name="organization" class="SelectMenu-icon" />
              <span>Manage organizations</span>
            <//>
            <${Link}
              class="SelectMenu-item"
              role="menuitem"
              href="/account/organizations/new"
            >
              <${Octicon} name="plus" class="SelectMenu-icon" />
              <span>Create organizations</span>
            <//>
          <//>
        </div>

        <h2 class="f5 mb-1 d-flex flex-justify-between">
          Repositories
          <${Button} small primary icon="repo" href="/new">New<//>
        </h2>
        <ul class="list-style-none">
          ${data?.viewer.topRepositories.edges.map(
            ({ node }) => html`
              <li class="text-bold mb-2">
                <${Link} href="/${node.nameWithOwner}">
                  <${Octicon}
                    name=${repoIconName(node)}
                    class="SelectMenu-icon text-${repoIconColor(node)} mr-2"
                  />
                  <span>${node.name}</span>
                <//>
              </li>
            `
          )}
        </ul>
      </aside>
      <div
        class="col-12 col-md-8 col-lg-6 p-responsive mt-3 border-bottom d-flex flex-auto"
      >
        <h1>Recent activity</h1>
        <a href="https://github.community/t/get-event-equivalent-for-v4/13600/7"
          >yo</a
        >
      </div>
    </div>
  `;
}

export default DashboardRoute;
