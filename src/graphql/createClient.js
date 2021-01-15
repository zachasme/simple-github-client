import { createClient, dedupExchange, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
//import { requestPolicyExchange } from "@urql/exchange-request-policy";
import { authExchange } from "./auth";
import { errorExchange } from "./error";
import { progressExchange } from "./progress";

import {
  addStarOptimsitic,
  removeStarOptimsitic,
} from "../repository/starMutations.js";

export default ({ schema, token, logout, addToast }) => {
  return createClient({
    url: "https://api.github.com/graphql",
    requestPolicy: "cache-and-network",
    exchanges: [
      dedupExchange,
      cacheExchange({
        schema,
        keys: {
          TreeEntry: () => null,
        },
        optimistic: {
          addStar: addStarOptimsitic,
          removeStar: removeStarOptimsitic,
        },
      }),
      errorExchange(addToast),
      authExchange({ token, logout, addToast }),
      progressExchange,
      fetchExchange,
    ],
  });
};
