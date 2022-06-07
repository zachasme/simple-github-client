import { Routes, Route } from "react-router-dom";
import { html } from "htm/react";

import NotImplementedRoute from "../routes/NotImplementedRoute.js";
import NotFoundRoute from "../routes/NotFoundRoute.js";
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
import LogInRoute from "../user/LogInRoute.js";
import UserRepositoriesRoute from "../user/UserRepositoriesRoute.js";
import UserPackagesRoute from "../user/UserPackagesRoute.js";
import UserProjectsRoute from "../user/UserProjectsRoute.js";

const NOT_IMPLEMENTED = [
  "/issues",
  "/pulls",
  "/new",
  "/discussions",
  "/settings/profile",
  "/settings/organizations",
  "/users/:login/stars",
  "/users/:login/following",
  "/users/:login/followers",
  "/orgs/:login/dashboard",
  "/:owner/:repo/milestones",
  "/:owner/:repo/stargazers",
  "/:owner/:repo/watchers",
  "/:owner/:repo/network/members",
  "/:owner/:repo/issues/new",
  "/:owner/:repo/issues/new/choose",
];

function Router() {
  return html`
    <${Routes}>
      <!-- Base routes -->
      <${Route} path="/" exact>
        <${DashboardRoute} />
      <//>
      <${Route} path="/login" exact>
        <${LogInRoute} />
      <//>
      <${Route} path="/debug/schema" exact>
        <${SchemaRoute} />
      <//>
      <!-- Placeholder routes -->
      ${NOT_IMPLEMENTED.map(
        (path) => html`
          <${Route} key=${path} path=${path} exact>
            <${NotImplementedRoute} />
          <//>
        `
      )}
      <!-- Organization routes -->
      <${Route} path="/orgs/:login/packages" exact>
        <${OrganizationPackagesRoute} />
      <//>
      <${Route} path="/orgs/:login/people" exact>
        <${OrganizationPeopleRoute} />
      <//>
      <${Route} path="/orgs/:login/projects" exact>
        <${OrganizationProjectsRoute} />
      <//>
      <!-- User routes -->
      <${Route} path="/users/:login/repositories" exact>
        <${UserRepositoriesRoute} />
      <//>
      <${Route} path="/users/:login/packages" exact>
        <${UserPackagesRoute} />
      <//>
      <${Route} path="/users/:login/projects" exact>
        <${UserProjectsRoute} />
      <//>
      <!-- Repository routes -->
      <${Route} path="/:owner/:name/issues/:number" exact>
        <${RepositoryIssueRoute} />
      <//>
      <${Route} path="/:owner/:name/issues" exact>
        <${RepositoryIssuesRoute} />
      <//>
      <${Route} path="/:owner/:name/pulls" exact>
        <${RepositoryPullRequestsRoute} />
      <//>
      <${Route} path="/:owner/:name/labels" exact>
        <${RepositoryLabelsRoute} />
      <//>
      <!-- Catch-alls -->
      <${Route} path="/:owner/:name" exact>
        <${RepositoryRoute} />
      <//>
      <${Route} path="/:login" exact>
        <${RepositoryOwnerRoute} />
      <//>
      <!-- 404 Fallback -->
      <${Route}>
        <${NotFoundRoute} />
      <//>
    <//>
  `;
}

export default Router;
