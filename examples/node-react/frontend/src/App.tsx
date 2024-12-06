import { useState, useEffect } from "react";
import "./App.css";
import { PCaptchaWidget } from "p-captcha-react";

async function getChallenge(): Promise<{ challenge: string; id: string }> {
  const response = await fetch("http://localhost:3000/api/challenge");
  const { challenge, id } = await response.json();
  return { challenge, id };
}

async function processForm(answer: string, id: string) {
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
    processForm(answer!, id!).then((res) => {
      setResponse(res.text);
    });
  };

  return (
    <>
      <h1>P-Captcha React Example</h1>
      <label style={{ display: "block" }}>Challenge</label>
      <textarea
        disabled
        style={{ width: 450, height: 100 }}
        value={challenge ?? "Loading..."}
      />
      <p>Challenge ID: {id ?? "Loading..."}</p>
      <form onSubmit={handleSubmit}>
        <PCaptchaWidget challenge={challenge ?? ""} onVerified={setAnswer} />
        <br />
        <label style={{ display: "block" }}>Answer</label>
        <textarea
          onChange={(e) => setAnswer(e.target.value)}
          style={{ width: 450, height: 100 }}
          value={answer ?? ""}
          disabled={!answer}
        />
        <br />
        <button type="submit">Submit</button>
        <p>Response: {response ?? ""}</p>
      </form>
    </>
  );
}

export default App;
