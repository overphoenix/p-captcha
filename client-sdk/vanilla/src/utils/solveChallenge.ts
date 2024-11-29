import { ChallengeTypes } from "../constants.ts";
import { Answer, Challenge } from "../types.ts";
import { tonelliShanks } from "./math/tonelliShanksModSquareRoot.ts";
import { bigIntToBase64 } from "./serializers.ts";

export function solveChallenge(challenge: Challenge): Answer[] {
  switch (challenge.type) {
    case ChallengeTypes[0]:
      let answers = [];
      for (let ch of challenge.problem.challenges) {
        const ans = tonelliShanks(ch, challenge.problem.prime);
        answers.push(bigIntToBase64(ans));
      }
      return answers;
  }
}
