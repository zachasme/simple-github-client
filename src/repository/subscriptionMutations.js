import { gql } from "urql";

export const UPDATE_SUBSCRIPTION_MUTATION = gql`
  mutation($input: UpdateSubscriptionInput!) {
    updateSubscription(input: $input) {
      subscribable {
        id
      }
    }
  }
`;

export const updateSubscriptionOptimsitic = (variables, cache, info) => {
  return {
    updateSubscription: {
      __typename: "UpdateSubscriptionPayload",
      subscribable: {
        __typename: "Subscribable",
        id: variables.input.subscribableId,
      },
    },
  };
};

export const updateSubscriptionUpdate = (parent, args, cache, info) => {
  const subscription = cache.resolve(
    `Repository:${args.input.subscribableId}`,
    "viewerSubscription"
  );
  const watchers = cache.resolve(
    `Repository:${args.input.subscribableId}`,
    "watchers"
  );
  let totalCount = cache.resolve(watchers, "totalCount");
  const wasSubscribed = subscription === "SUBSCRIBED";
  const isSubscribing = args.input.state === "SUBSCRIBED";
  if (wasSubscribed && !isSubscribing) totalCount -= 1;
  if (!wasSubscribed && isSubscribing) totalCount += 1;
  cache.writeFragment(
    gql`
      fragment _ on Repository {
        id
        viewerSubscription
        watchers {
          totalCount
        }
      }
    `,
    {
      __typename: "Repository",
      id: args.input.subscribableId,
      viewerSubscription: args.input.state,
      watchers: {
        __typename: "UserConnection",
        totalCount: totalCount,
      },
    }
  );
};
