import { createClient, dedupExchange, fetchExchange } from "@urql/core";
//import { requestPolicyExchange } from "@urql/exchange-request-policy";
import authExchange from "./auth.js";
import errorExchange from "./error.js";
import progressExchange from "./progress.js";
import cacheExchange from "./cache.js";

export default ({ schema, token, logout, addToast }) => {
  return createClient({
    url: "https://api.github.com/graphql",
    requestPolicy: "cache-and-network",
    exchanges: [
      dedupExchange,
      /*requestPolicyExchange({
        ttl: 2000,
      }),*/
      cacheExchange({ schema }),
      errorExchange({ addToast }),
      authExchange({ token, logout, addToast }),
      progressExchange,
      fetchExchange,
    ],
  });
};
