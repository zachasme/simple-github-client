import { createRoot } from "react-dom/client";
import { html } from "htm/react";

import { AuthenticationProvider } from "./user/AuthenticationContext.js";
import { ToastProvider } from "./common/ToastContext.js";
import GraphQLProvider from "./graphql/GraphQLProvider.js";
import Application from "./common/Application.js";

export async function bootstrap() {
  const response = await fetch("/src/schema.json");
  const schema = await response.json();

  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(html`
    <${ToastProvider}>
      <${AuthenticationProvider}>
        <${GraphQLProvider} schema=${schema}>
          <${Application} />
        <//>
      <//>
    <//>
  `);
}

bootstrap();
