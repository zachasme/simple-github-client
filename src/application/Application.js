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

  return html`
    <${ApplicationShell}>
      <${Router}>
        <${DashboardRoute} path="/" />
        <${LogInRoute} path="/login" />
        <${OrganizationPackagesRoute} path="/orgs/:login/packages" />
        <${OrganizationPeopleRoute} path="/orgs/:login/people" />
        <${OrganizationProjectsRoute} path="/orgs/:login/projects" />
        <${UserRepositoriesRoute} path="/users/:login/repositories" />
        <${UserPackagesRoute} path="/users/:login/packages" />
        <${UserProjectsRoute} path="/users/:login/projects" />
        <${RepositoryRoute} path="/:owner/:name" />
        <${RepositoryIssueRoute} path="/:owner/:name/issues/:number" />
        <${RepositoryIssuesRoute} path="/:owner/:name/issues" />
        <${RepositoryIssuesRoute} path="/:owner/:name/pulls" />
        <${RepositoryLabelsRoute} path="/:owner/:name/labels" />
        <${RepositoryOwnerRoute} path="/:login" />
        <${NotFoundRoute} default />
      <//>
    <//>
  `;
}

export default Application;
