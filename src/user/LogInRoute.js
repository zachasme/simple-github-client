import { html } from "htm/react";
import { useState } from "react";

import { useAuthentication } from "./AuthenticationContext.js";

import { MarkGithubIcon } from "@primer/octicons-react";
import Button from "../primitives/Button.js";

function LogInRoute() {
  const { login } = useAuthentication();
  const [token, setToken] = useState("");

  const error = false;
  const loading = false;

  async function handleSubmit(event) {
    event.preventDefault();
    login(token);
  }

  return html`<div
    className="d-flex flex-column flex-items-center flex-justify-center bg-gray-light"
    style=${{ minHeight: "100vh" }}
  >
    <${MarkGithubIcon} size="large" />

    <h1 className="f1-light mt-4">Sign in to GitHub Clone</h1>

    <form
      className="border px-4 pb-4 pt-2 my-4 bg-white"
      onSubmit=${handleSubmit}
    >
      <div className="form-group ${error ? "errored" : ""}">
        <div className="form-group-header">
          <label htmlFor="token">
            Personal Access Token
            <a
              className="float-right"
              href="https://github.com/settings/tokens/new?scopes=read:org,read:packages,read:repo_hook,repo,user"
              target="_blank"
            >
              Create token
            </a>
          </label>
        </div>
        <div className="form-group-body">
          <input
            disabled=${loading}
            className="form-control"
            type="text"
            value=${token}
            onInput=${(e) => setToken(e.currentTarget.value)}
            id="token"
          />
        </div>
        ${error && html` <p className="note error">${error.message}</p> `}
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
