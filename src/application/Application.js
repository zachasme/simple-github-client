import Router from "preact-router";
import { useErrorBoundary } from "preact/hooks";
import { html } from "htm/preact";

import useQuery from "../hooks/useQuery.js";
import gql from "graphql-tag";

import ApplicationShell from "./ApplicationShell.js";
import DashboardRoute from "../routes/DashboardRoute.js";
import OrganizationPackagesRoute from "../organization/OrganizationPackagesRoute.js";
import OrganizationPeopleRoute from "../organization/OrganizationPeopleRoute.js";
import OrganizationProjectsRoute from "../organization/OrganizationProjectsRoute.js";
import RepositoryRoute from "../repository/RepositoryRoute.js";
import RepositoryIssuesRoute from "../repository/RepositoryIssuesRoute.js";
import RepositoryLabelsRoute from "../repository/RepositoryLabelsRoute.js";
import RepositoryIssueRoute from "../repository/RepositoryIssueRoute.js";
import RepositoryOwnerRoute from "../repositoryOwner/RepositoryOwnerRoute.js";
import NotFoundRoute from "../routes/NotFoundRoute.js";
import LogInRoute from "../user/LogInRoute.js";
import UserRepositoriesRoute from "../user/UserRepositoriesRoute.js";
import UserPackagesRoute from "../user/UserPackagesRoute.js";
import UserProjectsRoute from "../user/UserProjectsRoute.js";

import RedBox from "https://cdn.skypack.dev/redbox-react@latest";

const QUERY = gql`
  query ApplicationQuery {
    viewer {
      id
      login
    }
  }
`;

function Application() {
  const [{ data, error }] = useQuery({
    query: QUERY,
  });

  const [errorBoundary] = useErrorBoundary((error) => {});
  if (errorBoundary)
    return html`<${RedBox}
      error=${errorBoundary}
      style=${{ redbox: { background: "rgba(150, 0, 0, 0.7)" } }}
    />`;

  if (error) {
    return html`<${LogInRoute} />`;
  } else {
    console.log(`Signed in as: ${data?.viewer?.login}`);
  }

  // hack to support optional url prefix in preact-router
  const routes = (p = "") => [
    // p is prefix
    html`<${DashboardRoute} path="${p}/" />`,
    html`<${LogInRoute} path="${p}/login" />`,
    html`<${OrganizationPackagesRoute} path="${p}/orgs/:login/packages" />`,
    html`<${OrganizationPeopleRoute} path="${p}/orgs/:login/people" />`,
    html`<${OrganizationProjectsRoute} path="${p}/orgs/:login/projects" />`,
    html`<${UserRepositoriesRoute} path="${p}/users/:login/repositories" />`,
    html`<${UserPackagesRoute} path="${p}/users/:login/packages" />`,
    html`<${UserProjectsRoute} path="${p}/users/:login/projects" />`,
    html`<${RepositoryRoute} path="${p}/:owner/:name" />`,
    html`<${RepositoryIssueRoute} path="${p}/:owner/:name/issues/:number" />`,
    html`<${RepositoryIssuesRoute} path="${p}/:owner/:name/issues" />`,
    html`<${RepositoryIssuesRoute} path="${p}/:owner/:name/pulls" />`,
    html`<${RepositoryLabelsRoute} path="${p}/:owner/:name/labels" />`,
    html`<${RepositoryOwnerRoute} path="${p}/:login" />`,
    html`<${NotFoundRoute} default />`,
  ];

  return html`
    <${ApplicationShell}>
      <${Router}>${routes("/simple-github-client")}${routes()}<//>
    <//>
  `;
}

export default Application;
