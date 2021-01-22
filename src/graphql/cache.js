import { cacheExchange } from "@urql/exchange-graphcache";
import { relayPagination } from "@urql/exchange-graphcache/extras";

import {
  addStarOptimsitic,
  removeStarOptimsitic,
} from "../repository/starMutations.js";
import {
  updateSubscriptionOptimsitic,
  updateSubscriptionUpdate,
} from "../repository/subscriptionMutations.js";

export default ({ schema }) => {
  return cacheExchange({
    schema,
    resolvers: {
      Issue: {
        timelineItems: relayPagination(),
      },
    },
    keys: {
      TreeEntry: () => null,
      User: (user) => user.login,
      GitActor: (actor) => actor.name,
      ReactionGroup: () => null,
    },
    optimistic: {
      addStar: addStarOptimsitic,
      removeStar: removeStarOptimsitic,
      updateSubscription: updateSubscriptionOptimsitic,
    },
    updates: {
      Mutation: {
        updateSubscription: updateSubscriptionUpdate,
      },
    },
  });
};
