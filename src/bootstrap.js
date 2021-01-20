import { render } from "react-dom";
import { html } from "htm/react";
import { BrowserRouter as RouterProvider } from "react-router-dom";

import { AuthenticationProvider } from "./user/AuthenticationContext.js";
import { ToastProvider } from "./common/ToastContext.js";
import UrqlProvider from "./graphql/UrqlProvider.js";
import Application from "./common/Application.js";

export async function bootstrap() {
  const response = await fetch("/src/schema.json");
  const schema = await response.json();

  const container = document.getElementById("root");
  const root = html`
    <${RouterProvider}>
      <${ToastProvider}>
        <${AuthenticationProvider}>
          <${UrqlProvider} schema=${schema}>
            <${Application} />
          <//>
        <//>
      <//>
    <//>
  `;

  render(root, container);
}

bootstrap();
