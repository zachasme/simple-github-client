import { Fragment } from "react";
import { html } from "htm/react";
import useQuery from "../hooks/useQuery.js";
import { gql } from "urql";

import Link from "../primitives/Link.js";
import Select from "../primitives/Select.js";
import {
  CheckIcon,
  OrganizationIcon,
  PlusIcon,
  LockIcon,
  RepoIcon,
  GitForkIcon,
} from "@primer/octicons-react";
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
  if (isPrivate) return LockIcon;
  if (isFork) return GitForkIcon;
  else return RepoIcon;
}
function repoIconColor(repository) {
  if (repository.isPrivate) return "yellow";
  else return "gray";
}

function DashboardRoute() {
  const [{ data }] = useQuery({ query: QUERY });

  return html`
    <div className="d-flex flex-wrap bg-gray height-full">
      <aside
        className="col-12 col-md-4 col-lg-3 bg-white border-right border-bottom px-3 py-3"
      >
        <div className="border-bottom py-3 mb-4">
          <${Select}
            label=${html`
              <${Fragment}>
                <img
                  className="avatar avatar-1 mr-2"
                  src=${data?.viewer.avatarUrl}
                />
                <strong>${data?.viewer?.login}</strong>
              <//>
            `}
            title="Switch dashboard context"
          >
            <${Link} className="SelectMenu-item" role="menuitem" href="/">
              <${CheckIcon} className="SelectMenu-icon" />
              <img
                className="avatar avatar-1 mr-2"
                alt="jonrohan"
                src=${data?.viewer?.avatarUrl}
              />
              <span>${data?.viewer?.login}</span>
            <//>
            ${data?.viewer?.organizations?.edges?.map(
              ({ node }) => html`
                <${Link}
                  key=${node.id}
                  className="SelectMenu-item pl-6"
                  role="menuitem"
                  href="/orgs/${node.login}/dashboard"
                >
                  <img
                    className="avatar avatar-1 mr-2"
                    alt="jonrohan"
                    src=${node.avatarUrl}
                  />
                  <span>${node.login}</span>
                <//>
              `
            )}
            <${Link}
              className="SelectMenu-item"
              role="menuitem"
              href="/account/organizations"
            >
              <${OrganizationIcon} className="SelectMenu-icon" />
              <span>Manage organizations</span>
            <//>
            <${Link}
              className="SelectMenu-item"
              role="menuitem"
              href="/account/organizations/new"
            >
              <${PlusIcon} className="SelectMenu-icon" />
              <span>Create organizations</span>
            <//>
          <//>
        </div>

        <h2 className="f5 mb-1 d-flex flex-justify-between">
          Repositories
          <${Button} small primary icon=${html`<${RepoIcon} />`} href="/new">
            New
          <//>
        </h2>
        <ul className="list-style-none">
          ${data?.viewer.topRepositories.edges.map(
            ({ node }) => html`
              <li key=${node.id} className="text-bold mb-2">
                <${Link} href="/${node.nameWithOwner}">
                  <${repoIconName(node)}
                    className="SelectMenu-icon text-${repoIconColor(node)} mr-2"
                  />
                  <span>${node.name}</span>
                <//>
              </li>
            `
          )}
        </ul>
      </aside>
      <div
        className="col-12 col-md-8 col-lg-6 p-responsive mt-3 border-bottom d-flex flex-auto"
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
