import { gql } from "@apollo/client";

export const USER_QUERY = gql`
  query users($game: String!) {
    users(game: $game) {
      name
      scores {
        game
        score
      }
    }
  }
`;
