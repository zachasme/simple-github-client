import { Router, Route, Switch } from "wouter";
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
//import SchemaRoute from "../debug/SchemaRoute.js";
import LogInRoute from "../user/LogInRoute.js";
import UserRepositoriesRoute from "../user/UserRepositoriesRoute.js";
import UserPackagesRoute from "../user/UserPackagesRoute.js";
import UserProjectsRoute from "../user/UserProjectsRoute.js";
import { useLocation } from "./routing.js";

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

/*
<${Route} path="/debug/schema" exact>
  <${SchemaRoute} />
<//>
*/

function Router() {
  return html`
    <${Router} base="/simple-github-client">
      <${Switch}>
        <!-- Base routes -->
        <${Route} path="/" component=${DashboardRoute} />
        <${Route} path="/login" component=${LogInRoute} />
        <!-- Placeholder routes -->
        ${NOT_IMPLEMENTED.map(
          (path) => html`
            <${Route}
              key=${path}
              path=${path}
              component=${NotImplementedRoute}
            />
          `
        )}
        <!-- Organization routes -->
        <${Route}
          path="/orgs/:login/packages"
          component=${OrganizationPackagesRoute}
        />
        <${Route}
          path="/orgs/:login/people"
          component=${OrganizationPeopleRoute}
        />
        <${Route}
          path="/orgs/:login/projects"
          component=${OrganizationProjectsRoute}
        />
        <!-- User routes -->
        <${Route}
          path="/users/:login/repositories"
          component=${UserRepositoriesRoute}
        />
        <${Route}
          path="/users/:login/packages"
          component=${UserPackagesRoute}
        />
        <${Route}
          path="/users/:login/projects"
          component=${UserProjectsRoute}
        />
        <!-- Repository routes -->
        <${Route}
          path="/:owner/:name/issues/:number"
          component=${RepositoryIssueRoute}
        />
        <${Route}
          path="/:owner/:name/issues"
          component=${RepositoryIssuesRoute}
        />
        <${Route}
          path="/:owner/:name/pulls"
          component=${RepositoryPullRequestsRoute}
        />
        <${Route}
          path="/:owner/:name/labels"
          component=${RepositoryLabelsRoute}
        />
        <!-- Catch-alls -->
        <${Route} path="/:owner/:name" component=${RepositoryRoute} />
        <${Route} path="/:login" component=${RepositoryOwnerRoute} />
        <!-- 404 Fallback -->
        <${Route}>
          <${NotFoundRoute} />
        <//>
      <//>
    <//>
  `;
}

export default Router;
