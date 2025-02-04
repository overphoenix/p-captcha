import { PCaptchaWidget } from "p-captcha-react";
import { useState, useEffect } from "react";

async function getChallenge(): Promise<{ challenge: string; id: string }> {
  const response = await fetch("http://localhost:3000/api/challenge");
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
  const [challenge, setChallenge] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    getChallenge().then(({ challenge, id }) => {
      setChallenge(challenge);
      setId(id);
    });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    validateAnswer(answer!, id!).then((res) => {
      setResponse(res.text);
    });
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-5xl font-semibold text-gray-900 mb-12 text-center tracking-tight">P‑Captcha Demo</h1>
        
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Challenge</label>
            <textarea
              disabled
              className="w-full h-24 bg-white border border-gray-300 rounded-lg p-4 text-gray-900 focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
              value={challenge ?? "Loading..."}
            />
          </div>

          <p className="text-gray-500">Challenge ID: <span className="text-gray-900">{id ?? "Loading..."}</span></p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex">
              <PCaptchaWidget challenge={challenge ?? ""} onVerified={setAnswer} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Answer</label>
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

            <div className="text-center">
              <p className="text-gray-500">Response: <span className="text-gray-900">{response ?? ""}</span></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
