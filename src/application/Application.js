import { useErrorBoundary } from "preact/hooks";
import { html } from "htm/preact";

import useQuery from "../hooks/useQuery.js";
import { gql } from "@urql/preact";

import ApplicationShell from "./ApplicationShell.js";
import LogInRoute from "../user/LogInRoute.js";
import Router from "./Router.js";

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
      <${Router} />
    <//>
  `;
}

export default Application;
