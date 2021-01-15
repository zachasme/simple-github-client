import PreactRouter from "preact-router";
import { html } from "htm/preact";

import DashboardRoute from "../routes/DashboardRoute.js";
import OrganizationPackagesRoute from "../organization/OrganizationPackagesRoute.js";
import OrganizationPeopleRoute from "../organization/OrganizationPeopleRoute.js";
import OrganizationProjectsRoute from "../organization/OrganizationProjectsRoute.js";
import RepositoryRoute from "../repository/RepositoryRoute.js";
import RepositoryIssuesRoute from "../repository/RepositoryIssuesRoute.js";
import RepositoryPullRequestsRoute from "../repository/RepositoryPullRequestsRoute.js";
import RepositoryLabelsRoute from "../repository/RepositoryLabelsRoute.js";
import RepositoryIssueRoute from "../repository/RepositoryIssueRoute.js";
import RepositoryOwnerRoute from "../repositoryOwner/RepositoryOwnerRoute.js";
import SchemaRoute from "../debug/SchemaRoute.js";
import NotFoundRoute from "../routes/NotFoundRoute.js";
import LogInRoute from "../user/LogInRoute.js";
import UserRepositoriesRoute from "../user/UserRepositoriesRoute.js";
import UserPackagesRoute from "../user/UserPackagesRoute.js";
import UserProjectsRoute from "../user/UserProjectsRoute.js";

function Router() {
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
    html`<${RepositoryPullRequestsRoute} path="${p}/:owner/:name/pulls" />`,
    html`<${RepositoryLabelsRoute} path="${p}/:owner/:name/labels" />`,
    html`<${RepositoryOwnerRoute} path="${p}/:login" />`,
    html`<${SchemaRoute} path="${p}/debug/schema" />`,
    html`<${NotFoundRoute} default />`,
  ];

  return html`
    <${PreactRouter}>${routes("/simple-github-client")}${routes()}<//>
  `;
}

export default Router;
