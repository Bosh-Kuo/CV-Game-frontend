import { gql } from "@apollo/client";

export const USER_SUBSCRIPTION = gql`
  subscription userUpdated($game: String!) {
    userUpdated(game: $game) {
      mutation
      data {
        name
        scores {
          game
          score
        }
      }
    }
  }
`;
