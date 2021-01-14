import { gql } from "@urql/preact";

export const UPDATE_SUBSCRIPTION_MUTATION = gql`
  mutation($input: UpdateSubscriptionInput!) {
    updateSubscription(input: $input) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

export const addOrRemoveStarOptimistic = (add) => (variables, cache, info) => {
  const stargazers = cache.resolve(
    `Repository:${variables.input.starrableId}`,
    "stargazers"
  );
  const totalCount = cache.resolve(stargazers, "totalCount");
  return {
    starrable: {
      id: variables.input.starrableId,
      viewerHasStarred: add,
      stargazers: {
        totalCount: totalCount + (add ? 1 : -1),
        __typename: "StargazerConnection",
      },
      __typename: "Repository",
    },
    __typename: add ? "AddStarPayload" : "RemoveStarPayload",
  };
};

export const addStarOptimsitic = addOrRemoveStarOptimistic(true);
export const removeStarOptimsitic = addOrRemoveStarOptimistic(false);
