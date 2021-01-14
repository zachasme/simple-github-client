import { html } from "htm/preact";
import { useState } from "preact/hooks";
import { useClient } from "@urql/preact";

import usePersistedState from "../hooks/usePersistedState.js";

import Octicon from "../primitives/Octicon.js";
import Button from "../primitives/Button.js";

function LogInRoute() {
  const client = useClient();
  const [token, setToken] = usePersistedState("", "token");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await client
      .query("{ viewer { login }}", {
        requestPolicy: "network-only",
      })
      .toPromise();
    setLoading(false);
    if (!result.error) {
      location.reload();
    } else {
      console.log(result.error);
      setError(result.error);
    }
  }

  return html`<div
    class="d-flex flex-column flex-items-center flex-justify-center bg-gray-light"
    style="min-height: 100vh"
  >
    <${Octicon} name="mark-github" large />

    <h1 class="f1-light mt-4">Sign in to GitHub Clone</h1>

    <form class="border px-4 pb-4 pt-2 my-4 bg-white" onSubmit=${handleSubmit}>
      <div class="form-group ${error ? "errored" : ""}">
        <div class="form-group-header">
          <label for="token">
            Personal Access Token
            <a
              class="float-right"
              href="https://github.com/settings/tokens/new?scopes=read:org,read:packages,read:repo_hook,repo,user"
              target="_blank"
            >
              Create token
            </a>
          </label>
        </div>
        <div class="form-group-body">
          <input
            disabled=${loading}
            class="form-control"
            type="text"
            value=${token}
            onInput=${(e) => setToken(e.currentTarget.value)}
            id="token"
          />
        </div>
        ${error && html` <p class="note error">${error.message}</p> `}
      </div>

      <${Button}
        disabled=${loading}
        type="submit"
        value="Sign in"
        primary
        block
      >
        Sign in
      <//>
    </form>
  </div>`;
}

export default LogInRoute;
