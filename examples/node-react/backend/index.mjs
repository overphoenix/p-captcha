import express from "express";
import { InMemoryCaptchaService, WoodallAliases } from "@p-captcha/node";

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

const captchaService = new InMemoryCaptchaService();

const difficultyMap = {
  'super-easy': {
    woodall: WoodallAliases.xs,
    rounds: 1,
  },
  'easy': {
    woodall: WoodallAliases.sm,
    rounds: 2,
  },
  'medium': {
    woodall: WoodallAliases.md,
    rounds: 2,
  },
  'hard': {
    woodall: WoodallAliases.lg,
    rounds: 3,
  },
  'super-hard': {
    woodall: WoodallAliases.xl,
    rounds: 4,
  },
  'ultra-hard': {
    woodall: WoodallAliases['2xl'],
    rounds: 5,
  },
  'insane': {
    woodall: WoodallAliases['3xl'],
    rounds: 10,
  },
};
app.get("/api/challenge", (req, res) => {
  const { difficulty } = req.query;
  const { challenge, id } = captchaService.generateChallenge(
    "QuadraticResidueProblem",
    difficultyMap[difficulty]
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
