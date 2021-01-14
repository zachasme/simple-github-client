import { render } from "preact";
import { html } from "htm/preact";
import { createClient, Provider } from "@urql/preact";
import "@github/time-elements";
import { createClientOptions } from "./urql.js";

import Application from "./application/Application.js";

async function bootstrap() {
  const client = createClient(await createClientOptions());

  const container = document.getElementById("root");
  const root = html`
    <${Provider} value=${client}>
      <${Application} />
    <//>
  `;

  render(root, container);
}

bootstrap();
