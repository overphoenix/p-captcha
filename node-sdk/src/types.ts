import { ChallengeTypes, Woodalls } from "./constants.ts";

export type RawChallenge = string;
export type RawAnswer = string;

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

export type IsSuccess = boolean;
export interface CaptchaStorage {
  saveItem: (key: string, value: string) => IsSuccess;
  getItem: (key: string) => string | null;
  removeItem: (key: string) => IsSuccess;
}

export interface CaptchaService {
  generateChallenge: (
    type: ProblemType,
    options: GenerateChallengeOptions
  ) => RawChallenge | null;
  validateAnswer: (challenge: RawChallenge, answer: RawAnswer) => IsSuccess;
}

export type GenerateChallengeOptions = QuadraticResidueProblemOptions;

export type QuadraticResidueProblemOptions = {
  woodall: keyof typeof Woodalls;
  rounds: number;
};
