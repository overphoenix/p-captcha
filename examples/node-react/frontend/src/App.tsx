import { PCaptchaWidget } from "p-captcha-react";
import { useState, useEffect } from "react";

type Difficulty =
  | "super-easy"
  | "easy"
  | "medium"
  | "hard"
  | "super-hard"
  | "ultra-hard"
  | "insane";

const difficultyInfo = {
  "super-easy": { rounds: 1, size: "xs" },
  easy: { rounds: 2, size: "sm" },
  medium: { rounds: 2, size: "md" },
  hard: { rounds: 3, size: "lg" },
  "super-hard": { rounds: 4, size: "xl" },
  "ultra-hard": { rounds: 5, size: "2xl" },
  insane: { rounds: 10, size: "3xl" },
} as const;

async function getChallenge(
  difficulty: Difficulty
): Promise<{ challenge: string; id: string }> {
  const response = await fetch(
    `http://localhost:3000/api/challenge?difficulty=${difficulty}`
  );
  const { challenge, id } = await response.json();
  return { challenge, id };
}

async function validateAnswer(answer: string, id: string) {
  const response = await fetch("http://localhost:3000/api/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answer, id }),
  });
  return response.json();
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number | string>(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [challenge, setChallenge] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    requestChallenge();
  }, [difficulty]);

  const requestChallenge = async () => {
    setResponse(null);
    setAnswer(null);
    setElapsedTime(0);
    const { challenge, id } = await getChallenge(difficulty);
    setChallenge(challenge);
    setId(id);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    validateAnswer(answer!, id!).then((res) => {
      setResponse(res.text);
    });
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-5xl font-semibold text-gray-900 mb-12 text-center tracking-tight">
          P‑Captcha Demo
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Difficulty
            </label>
            <div className="relative inline-block text-left w-full">
              <div>
                <button
                  type="button"
                  className="inline-flex w-full justify-between gap-x-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} (
                  rounds = {difficultyInfo[difficulty].rounds}, size ={" "}
                  {difficultyInfo[difficulty].size})
                  <svg
                    className="-mr-1 size-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {isOpen && (
                <div className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden">
                  <div className="py-1" role="none">
                    {Object.entries(difficultyInfo).map(([level, info]) => (
                      <button
                        key={level}
                        className={`block w-full px-4 py-2 text-left text-sm ${
                          difficulty === level
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setDifficulty(level as Difficulty);
                          setIsOpen(false);
                        }}
                        role="menuitem"
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)} (
                        rounds = {info.rounds}, size = {info.size})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Challenge
            </label>
            <textarea
              disabled
              className="w-full h-24 bg-white border border-gray-300 rounded-lg p-4 text-gray-900 focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
              value={challenge ?? "Loading..."}
            />
          </div>

          <p className="text-gray-500">
            Challenge ID:{" "}
            <span className="text-gray-900">{id ?? "Loading..."}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-x-4">
              <PCaptchaWidget
                challenge={challenge ?? ""}
                onSubmit={() => setElapsedTime(performance.now())}
                onVerified={(solution) => {
                  setElapsedTime(
                    (prev) => `${Math.round(performance.now() - +prev)}ms`
                  );
                  setAnswer(solution);
                }}
              />
              {typeof elapsedTime === "string" && (
                <p className="text-gray-500">
                  Challenge solved in:{" "}
                  <span className="text-gray-900">{elapsedTime}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Answer
              </label>
              <textarea
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full h-24 bg-white border border-gray-300 rounded-lg p-4 text-gray-900 focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
                value={answer ?? ""}
                disabled={!answer}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-full transition duration-300"
            >
              Submit
            </button>

            <div className="text-center flex items-center justify-center gap-x-4">
              <p className="text-gray-500">
                Response:{" "}
                <span className="text-gray-900">{response ?? ""}</span>
              </p>
              {response && (
                <button
                  onClick={() => {
                    requestChallenge();
                  }}
                  className="py-2 px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium rounded-full transition duration-300"
                >
                  Try Another
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
