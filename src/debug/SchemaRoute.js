import { html } from "htm/preact";
import { useEffect, useState, useMemo } from "preact/hooks";
import { getIntrospectionQuery } from "graphql";
import {
  getIntrospectedSchema,
  minifyIntrospectionQuery,
} from "@urql/introspection";

import Toast from "../primitives/Toast.js";
import Octicon from "../primitives/Octicon.js";
import useQuery from "../hooks/useQuery.js";

function useFile(url) {
  useEffect(() => {
    async function fetchSchema() {
      const response = await fetch(url);
      return await response.text();
    }

    fetchSchema().then(setSchema);
  }, []);

  const [schema, setSchema] = useState(null);

  return schema;
}

function SchemaRoute() {
  const schema = useFile("/src/schema.json");

  const [{ data, fetching, error }, execute] = useQuery({
    query: getIntrospectionQuery({ descriptions: false }),
    pause: true,
  });

  const minified = useMemo(() => {
    if (!data) return null;
    const minified = minifyIntrospectionQuery(getIntrospectedSchema(data));
    return JSON.stringify(minified);
  }, [data]);

  if (error) throw error;

  const upToDate = minified === schema;

  return html`
    <div
      class="container-xl clearfix new-discussion-timeline px-3 px-md-4 px-lg-5"
    >
      ${data
        ? html`
            <div class="p-1">
              <${Toast} type=${upToDate ? "success" : "warning"}>
                Schema is ${upToDate ? "up-to-date" : "outdated"}.
              <//>
            </div>
            <div class="form-group">
              <div class="form-group-body">
                <textarea class="form-control" readonly>${minified}</textarea>
              </div>
            </div>
          `
        : html`
            <div>
              <button
                class="btn btn-primary mt-3"
                onClick=${execute}
                disabled=${fetching}
              >
                <span>Compar${fetching ? "ing" : "e"}</span>
                ${fetching && html`<span class="AnimatedEllipsis"></span>`}
              </button>
            </div>
          `}
    </div>
  `;
}

export default SchemaRoute;
