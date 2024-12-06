import express from "express";
import { InMemoryCaptchaService, WoodallAliases } from "p-captcha-node";

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

const captchaService = new InMemoryCaptchaService();

app.get("/api/challenge", (req, res) => {
  const { challenge, id } = captchaService.generateChallenge(
    "QuadraticResidueProblem",
    {
      woodall: WoodallAliases.md,
      rounds: 2,
    }
  );
  res.json({ challenge, id });
});

app.post("/api/validate", (req, res) => {
  const { answer, id } = req.body;
  const success = captchaService.validateAnswer(id, answer);

  if (!success) {
    res.json({ text: "Invalid captcha!" });
    return;
  }

  res.json({ text: "Form processed correctly, captcha is valid!" });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
