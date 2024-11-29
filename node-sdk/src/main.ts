import { getRandomValues, createHash } from "crypto";
import type {
  ProblemType,
  QuadraticResidueProblem,
  RawAnswer,
  RawChallenge,
} from "./types.ts";

import { Woodalls, ChallengeTypes, Errors } from "./constants.ts";
import { base64ToBigInt, bigIntToBase64 } from "./utils/serializers.ts";
import { parseChallenge } from "./utils/parseChallenge.ts";
import {
  CaptchaService,
  CaptchaStorage,
  GenerateChallengeOptions,
  IsSuccess,
  QuadraticResidueProblemOptions,
} from "./types.ts";
import { getRandomBigInt } from "./utils/getRandomBigInt.ts";

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
        this.storeChallenge(challenge);
        return challenge;
    }
    return null;
  }

  validateAnswer(challenge: RawChallenge, answer: RawAnswer): IsSuccess {
    const hash = createHash("md5").update(challenge).digest("hex");
    const storedChallenge = this.storage.getItem(hash);

    if (challenge && challenge === storedChallenge) {
      this.storage.removeItem(hash);
      const { type, problem } = parseChallenge(challenge);

      switch (type) {
        case ChallengeTypes[0]:
          return this.validateQuadraticResidueProblem(answer, problem);
      }
    }

    return false;
  }

  private storeChallenge(challenge: RawChallenge): IsSuccess {
    const hash = createHash("md5").update(challenge).digest("hex");
    this.storage.saveItem(hash, challenge);
    return true;
  }

  private generateQuadraticResidueProblem(
    options: QuadraticResidueProblemOptions
  ): RawChallenge {
    const p = Woodalls[options.woodall];
    let ns = [];
    for (let i = 0; i < options.rounds; i++) {
      const array = new Uint8Array(32);
      getRandomValues(array);
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
    const answers = answer.split(",").map(base64ToBigInt);
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
