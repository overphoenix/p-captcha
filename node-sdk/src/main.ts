import { createHash } from "crypto";
import type {
  ChallengeId,
  ProblemType,
  QuadraticResidueProblem,
  RawAnswer,
  RawChallenge,
} from "./types.js";

import { Woodalls, ChallengeTypes, Errors } from "./constants.js";
import { base64ToBigInt, bigIntToBase64 } from "./utils/serializers.js";
import { parseChallenge } from "./utils/parseChallenge.js";
import {
  CaptchaService,
  CaptchaStorage,
  GenerateChallengeOptions,
  IsSuccess,
  QuadraticResidueProblemOptions,
} from "./types.js";
import { getRandomBigInt } from "./utils/getRandomBigInt.js";

export class BaseCaptchaService implements CaptchaService {
  constructor(private readonly storage: CaptchaStorage) {
    this.storage = storage;
  }

  generateChallenge(type: ProblemType, options: GenerateChallengeOptions) {
    if (!ChallengeTypes.includes(type)) {
      throw new Error(Errors.UnknownProblemType);
    }

    switch (type) {
      case ChallengeTypes[0]:
        const challenge = this.generateQuadraticResidueProblem(options);
        const id = this.storeChallenge(challenge);
        return { id, challenge };
    }
    return null;
  }

  validateAnswer(id: ChallengeId, answer: RawAnswer): IsSuccess {
    const storedChallenge = this.storage.getItem(id);

    if (storedChallenge) {
      this.storage.removeItem(id);
      const { type, problem } = parseChallenge(storedChallenge);

      switch (type) {
        case ChallengeTypes[0]:
          return this.validateQuadraticResidueProblem(answer, problem);
      }
    }

    return false;
  }

  private storeChallenge(challenge: RawChallenge): ChallengeId {
    const hash = createHash("md5").update(challenge).digest("hex");
    this.storage.saveItem(hash, challenge);
    return hash;
  }

  private generateQuadraticResidueProblem(
    options: QuadraticResidueProblemOptions
  ): RawChallenge {
    const p = Woodalls[options.woodall];
    let ns = [];
    for (let i = 0; i < options.rounds; i++) {
      const x = (getRandomBigInt(2 ** 10 * 16) % (p - 1n)) + 1n;
      const n = (x * x) % p;
      ns.push(n);
    }

    ns = ns.map(bigIntToBase64);

    return `QuadraticResidueProblem,${btoa(
      `${options.woodall},${ns.join(",")}`
    )}`;
  }

  private validateQuadraticResidueProblem(
    answer: RawAnswer,
    problem: QuadraticResidueProblem
  ) {
    let answers: bigint[];
    try {
      answers = answer.split(",").map(base64ToBigInt);
    } catch {
      return false;
    }
    const p = problem.prime;
    for (let i = 0; i < problem.challenges.length; i++) {
      const ans = answers[i];
      const resultN = (ans * ans) % p;
      const originalN = problem.challenges[i];
      if (resultN !== originalN) return false;
    }

    return true;
  }
}

export class InMemoryCaptchaService implements CaptchaService {
  private service: BaseCaptchaService;

  constructor() {
    const _inMemoryMap: Map<string, string> = new Map();
    const storate: CaptchaStorage = {
      saveItem: (key: string, value: string) => {
        _inMemoryMap.set(key, value);
        return true;
      },
      getItem: (key: string) => {
        return _inMemoryMap.get(key) ?? null;
      },
      removeItem: (key: string) => {
        return _inMemoryMap.delete(key);
      },
    };
    this.service = new BaseCaptchaService(storate);
  }

  generateChallenge(type: ProblemType, options: GenerateChallengeOptions) {
    return this.service.generateChallenge(type, options);
  }
  validateAnswer(challenge: RawChallenge, answer: RawAnswer) {
    return this.service.validateAnswer(challenge, answer);
  }
}
