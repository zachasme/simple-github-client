import { gql } from "urql";

export const ADD_STAR_MUTATION = gql`
  mutation($input: AddStarInput!) {
    addStar(input: $input) {
      starrable {
        id
        viewerHasStarred
        stargazers {
          totalCount
        }
      }
    }
  }
`;
export const REMOVE_STAR_MUTATION = gql`
  mutation($input: RemoveStarInput!) {
    removeStar(input: $input) {
      starrable {
        id
        viewerHasStarred
        stargazers {
          totalCount
        }
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
