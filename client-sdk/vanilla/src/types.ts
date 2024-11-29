import { ChallengeTypes } from "./constants.ts";

export type RawChallenge = string;
export type RawAnswer = string;
export type Answer = string;

export type ProblemType = (typeof ChallengeTypes)[number];
export type Problem = QuadraticResidueProblem;

export type QuadraticResidueProblem = {
  prime: bigint;
  challenges: Array<bigint>;
};

export type Challenge = {
  type: ProblemType;
  problem: Problem;
};
