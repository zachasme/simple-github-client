import { render } from "react-dom";
import { html } from "htm/react";
import { BrowserRouter as RouterProvider } from "react-router-dom";

import Application from "./application/Application.js";
import UrqlProvider from "./graphql/UrqlProvider.js";
import { ToastProvider } from "./toast/ToastContext.js";
import { TokenProvider } from "./user/TokenContext.js";

export async function bootstrap() {
  const response = await fetch("/src/schema.json");
  const schema = await response.json();

  const container = document.getElementById("root");
  const root = html`
    <${RouterProvider}>
      <${ToastProvider}>
        <${TokenProvider}>
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
