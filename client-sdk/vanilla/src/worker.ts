import { RawChallenge, RawAnswer } from "./types.ts";
import { parseChallenge } from "./utils/parseChallenge.ts";
import { solveChallenge } from "./utils/solveChallenge.ts";

onmessage = function (e) {
  const ans = solve(e.data);
  postMessage(ans);
};

function solve(rawChallenge: RawChallenge): RawAnswer {
  const challenge = parseChallenge(rawChallenge);
  const answers = solveChallenge(challenge);

  return answers.join(",");
}
