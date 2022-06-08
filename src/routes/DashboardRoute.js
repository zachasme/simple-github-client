import {
  CheckIcon,
  OrganizationIcon,
  PlusIcon,
  LockIcon,
  RepoIcon,
  RepoForkedIcon,
  PeopleIcon,
} from "@primer/octicons-react";
import { Fragment, useState } from "react";
import { html } from "htm/react";
import { gql } from "@apollo/client";

import useQuery from "../graphql/useQuery.js";
import Link from "../primitives/Link.js";
import Select from "../primitives/Select.js";
import Button from "../primitives/Button.js";

const QUERY = gql`
  query DashboardRouteQuery($first: Int, $teamsQuery: String) {
    viewer {
      id
      login
      avatarUrl
      topRepositories: watching(
        first: $first
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
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
      organizations(first: 100) {
        nodes {
          id
          login
          avatarUrl
          teams(first: 100, query: $teamsQuery) {
            nodes {
              id
              combinedSlug
              name
              viewerSubscription
            }
          }
        }
      }
    }
  }
`;

function repoIconName(repository) {
  const { isFork, isPrivate } = repository;
  if (isPrivate) return LockIcon;
  if (isFork) return RepoForkedIcon;
  else return RepoIcon;
}
function repoIconColor(repository) {
  if (repository.isPrivate) return "yellow";
  else return "gray";
}

function DashboardRoute() {
  const [showMoreRepos, setShowMoreRepos] = useState(false);
  const [teamsQuery, setTeamsQuery] = useState("");
  const { data } = useQuery(QUERY, {
    variables: { teamsQuery, first: showMoreRepos ? 100 : 7 },
  });

  const organizations = data?.viewer?.organizations?.nodes?.filter(
    (node) => node !== null
  );

  // REQUEST: A root query field for user teams
  const teams = organizations
    ?.map((organization) => organization?.teams?.nodes || [])
    .flat();

  function handleLoadMore(event) {
    event.preventDefault();
    setShowMoreRepos(true);
  }

  /*const { token } = useAuthentication();
  useEffect(() => {
    async function getEvents() {
      const response = await fetch(
        `https://api.github.com/users/${data.viewer.login}/received_events`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const events = await response.json();
      console.log(events);
    }
    if (data) getEvents();
  }, [data]);*/

  return html`
    <div className="d-flex flex-wrap bg-gray height-full">
      <aside
        className="col-12 col-md-4 col-lg-3 bg-white border-right border-bottom px-3 py-3"
      >
        <div className="border-bottom py-3 mb-2">
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
            ${organizations?.map(
              (node) => html`
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

        <div className="border-bottom py-3 mb-2">
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
                      className="SelectMenu-icon text-${repoIconColor(
                        node
                      )} mr-2"
                    />
                    <span>${node.nameWithOwner}</span>
                  <//>
                </li>
              `
            )}
          </ul>
          ${showMoreRepos === false &&
          html`
            <form onSubmit=${handleLoadMore}>
              <button className="btn-link">Show more</button>
            </form>
          `}
        </div>

        <div className="py-3 mb-2">
          <h2 className="f5 mb-1">Teams</h2>

          <div className="mt-2 mb-3" role="search" aria-label="Teams">
            <input
              type="text"
              className="form-control input-contrast input-block mb-3"
              placeholder="Find a team…"
              aria-label="Find a team…"
              value=${teamsQuery}
              onChange=${(e) => setTeamsQuery(e.target.value)}
            />
          </div>

          <ul className="list-style-none">
            ${teams?.map(
              (team) => html`
                <li key=${team.id}>
                  <div className="width-full text-bold">
                    <${Link}
                      href="/orgs/laosdirg/teams/devs"
                      className="d-inline-flex mb-2width-fit"
                    >
                      <div className="text-gray-light mr-2">
                        <${PeopleIcon} />
                      </div>
                      <span className="css-truncate css-truncate-target">
                        ${team.combinedSlug}
                      </span>
                    <//>
                  </div>
                </li>
              `
            )}
          </ul>
        </div>
      </aside>
      <div
        className="col-12 col-md-8 col-lg-6 p-responsive mt-3 border-bottom d-flex flex-auto"
      >
        <div>
          <h1>Recent activity</h1>
          <a
            href="https://github.community/t/get-event-equivalent-for-v4/13600/7"
          >
            Unsupported in GitHub GraphQL API
          </a>
        </div>
      </div>
    </div>
  `;
}

export default DashboardRoute;
