export const ChallengeTypes = ["QuadraticResidueProblem"] as const;

export const Errors = {
  UnknownProblemType: "UNKNOWN_PROBLEM_TYPE",
  SerializerFailed: "SERIALIZER_FAILED",
  NoChallengeFound: "NO_CHALLENGE_FOUND",
};

/**
 * 751*2^751-1 - ??? ms
 * 83*2^5318-1 - 238 ms
 * 7755*2^7755-1 - 598 ms
 * 9531*2^9531-1 - 931 ms
 * 12379*2^12379-1 - 1995 ms
 * 7911*2^15823-1 - 3466 ms
 * 18885*2^18885-1 - 5581 ms
 * 22971*2^22971-1 - 9199 ms
 */

export const Woodalls: Record<string, bigint> = {
  "751*2^751-1": 751n * 2n ** 751n - 1n,
  "83*2^5318-1": 83n * 2n ** 5318n - 1n,
  "7755*2^7755-1": 7755n * 2n ** 7755n - 1n,
  "9531*2^9531-1": 9531n * 2n ** 9531n - 1n,
  "12379*2^12379-1": 12379n * 2n ** 12379n - 1n,
  "7911*2^15823-1": 7911n * 2n ** 15823n - 1n,
  "18885*2^18885-1": 18885n * 2n ** 18885n - 1n,
  "22971*2^22971-1": 22971n * 2n ** 22971n - 1n,
};

const sizes = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;

export const WoodallAliases: Record<string, string> = Object.keys(
  Woodalls
).reduce((acc: Record<string, string>, value, index) => {
  acc[sizes[index]] = value;
  return acc;
}, {});
