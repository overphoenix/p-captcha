import { PCaptchaWidget } from "@p-captcha/react";
import { useState, useEffect } from "react";
import { HyperText } from "./HyperText";
import * as styles from "./App.module.css";

type Difficulty =
  | "micro"
  | "super-easy"
  | "easy"
  | "medium"
  | "hard"
  | "super-hard"
  | "ultra-hard"
  | "insane";

type Theme = 
  | "default"
  | "dark"
  | "material";

const difficultyInfo = {
  micro: { rounds: 1, size: "2xs" },
  "super-easy": { rounds: 1, size: "xs" },
  easy: { rounds: 2, size: "sm" },
  medium: { rounds: 2, size: "md" },
  hard: { rounds: 3, size: "lg" },
  "super-hard": { rounds: 4, size: "xl" },
  "ultra-hard": { rounds: 5, size: "2xl" },
  insane: { rounds: 10, size: "3xl" },
} as const;

const themeInfo = {
  default:  {
    label: "I'm not a robot",
    classNameOverrides: {
      container: undefined,
      checkbox: undefined,
      spinner: undefined,
      success: undefined,
      text: undefined,
    },
    renderSpinner: undefined,
    renderSuccess: undefined,
  },
  dark: {
    label: "我不是机器人",
    classNameOverrides: {
      container: styles.containerDark,
      checkbox: styles.checkboxDark,
      spinner: styles.spinnerDark,
      success: styles.successDark,
      text: styles.textDark,
    },
    renderSpinner: undefined,
    renderSuccess: undefined,
  },
  material: {
    label: "No soy un robot",
    classNameOverrides: {
      container: styles.containerMaterial,
      checkbox: styles.checkboxMaterial,
      spinner: styles.spinnerMaterial,
      success: undefined,
      text: styles.textMaterial,
    },
    renderSpinner: () => (
      <svg className={`animate-spin size-5 ${styles.spinnerMaterial}`} viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    ),
    renderSuccess: undefined,
  },
  fancy: {
    label: "I'm human",
    classNameOverrides: {
      container: styles.containerFancy,
      checkbox: styles.checkboxFancy,
      spinner: styles.spinnerFancy,
      success: styles.successFancy,
      text: styles.textFancy,
    },
    renderSpinner: undefined,
    renderSuccess: undefined,
  },
} as const;

type DropdownProps<T extends string> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Record<T, unknown>;
  renderValue: (value: T) => string;
  renderOption: (value: T) => string;
};

function Dropdown<T extends string>({ 
  label,
  value,
  onChange,
  options,
  renderValue,
  renderOption
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-2">
        {label}
      </label>
      <div className="relative inline-block text-left w-full">
        <div>
          <button
            type="button"
            className="inline-flex w-full justify-between gap-x-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
            onClick={() => setIsOpen(!isOpen)}
            onBlur={() => setIsOpen(false)}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            {renderValue(value)}
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
              {Object.keys(options).map((optionValue) => (
                <button
                  key={optionValue}
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    value === optionValue
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onMouseDown={() => {
                    onChange(optionValue as T);
                    setIsOpen(false);
                  }}
                  role="menuitem"
                >
                  {renderOption(optionValue as T)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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

function Demo() {
  const [key, setKey] = useState(0);
  const [elapsedTime, setElapsedTime] = useState<number | string>(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [theme, setTheme] = useState<Theme>("default");
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
    <div
      className="flex items-center justify-center p-6"
      onClick={() => setKey((_) => _ + 1)}
    >
      <div className="w-full max-w-3xl">
        <h1 className="text-5xl font-semibold text-gray-900 mb-12 text-center cursor-default">
          <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-[length:100%_auto]">
            P‑Captcha
          </span>{" "}
          <HyperText key={key} as="span">
            Demo
          </HyperText>
        </h1>

        <div className="space-y-6">
          <Dropdown<Difficulty>
            label="Difficulty"
            value={difficulty}
            onChange={setDifficulty}
            options={difficultyInfo}
            renderValue={(value) =>
              `${value.charAt(0).toUpperCase() + value.slice(1)} (rounds = ${
                difficultyInfo[value].rounds
              }, size = ${difficultyInfo[value].size})`
            }
            renderOption={(value) =>
              `${value.charAt(0).toUpperCase() + value.slice(1)} (rounds = ${
                difficultyInfo[value].rounds
              }, size = ${difficultyInfo[value].size})`
            }
          />

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

          <Dropdown<Theme>
            label="Widget theme"
            value={theme}
            onChange={setTheme}
            options={themeInfo}
            renderValue={(value) => `${value.charAt(0).toUpperCase() + value.slice(1)}`}
            renderOption={(value) => `${value.charAt(0).toUpperCase() + value.slice(1)}`}
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-x-4">
              <PCaptchaWidget
                challenge={challenge ?? ""}
                onSubmit={() => setElapsedTime(performance.now())}
                label={themeInfo[theme].label}
                classNameOverrides={themeInfo[theme].classNameOverrides}
                renderSpinner={themeInfo[theme].renderSpinner}
                renderSuccess={themeInfo[theme].renderSuccess}
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
              disabled={!answer}
              className="w-full py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-full transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default Demo;