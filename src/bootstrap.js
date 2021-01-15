import { render } from "preact";
import { html } from "htm/preact";

import Application from "./application/Application.js";
import UrqlProvider from "./graphql/UrqlProvider.js";
import { ToastProvider } from "./toast/ToastContext.js";
import { TokenProvider } from "./user/TokenContext.js";

export async function bootstrap() {
  const response = await fetch("/src/schema.json");
  const schema = await response.json();

  const container = document.getElementById("root");
  const root = html`
    <${ToastProvider}>
      <${TokenProvider}>
        <${UrqlProvider} schema=${schema}>
          <${Application} />
        <//>
      <//>
    <//>
  `;

  render(root, container);
}

bootstrap();
