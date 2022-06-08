import { gql } from "@apollo/client";

// input = { subjectId, content }

export const ADD_REACTION_MUTATION = gql`
  mutation ($input: AddReactionInput!) {
    addReaction(input: $input) {
      subject {
        id
        reactionGroups {
          content
          viewerHasReacted
          users {
            totalCount
          }
        }
      }
    }
  }
`;

export const REMOVE_REACTION_MUTATION = gql`
  mutation ($input: RemoveReactionInput!) {
    removeReaction(input: $input) {
      subject {
        id
        reactionGroups {
          content
          viewerHasReacted
          users {
            totalCount
          }
        }
      }
    }
  }
`;
