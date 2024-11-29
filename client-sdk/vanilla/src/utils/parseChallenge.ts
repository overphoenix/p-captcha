import { ChallengeTypes, Errors, Woodalls } from "../constants.ts";
import { Challenge, ProblemType, RawChallenge } from "../types.ts";
import { base64ToBigInt } from "./serializers.ts";

export function parseChallenge(rawChallenge: RawChallenge): Challenge {
  const [type, rawProblem] = rawChallenge.split(",");

  if (!validateType(type)) {
    throw Errors.UnknownProblemType;
  }

  switch (type) {
    case ChallengeTypes[0]:
      const [woodall, ...challenges] = atob(rawProblem).split(",");
      return {
        type: ChallengeTypes[0],
        problem: {
          prime: Woodalls[woodall],
          challenges: challenges.map(base64ToBigInt),
        },
      };
  }
}

function validateType(type: string): type is ProblemType {
  return ChallengeTypes.includes(type as ProblemType);
}
