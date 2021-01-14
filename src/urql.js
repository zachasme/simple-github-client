import { dedupExchange, fetchExchange } from "@urql/preact";
import { cacheExchange } from "@urql/exchange-graphcache";
//import { populateExchange } from "@urql/exchange-populate";

import {
  addStarOptimsitic,
  removeStarOptimsitic,
} from "./repository/starMutations.js";

export async function createClientOptions() {
  const response = await fetch("/src/schema.json");
  const schema = await response.json();

  return {
    url: "https://api.github.com/graphql",
    exchanges: [
      dedupExchange,
      //populateExchange({ schema }),
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
      fetchExchange,
    ],
    fetchOptions: () => {
      const token = JSON.parse(localStorage.getItem("token"));
      return {
        headers: {
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    },
  };
}
