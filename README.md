# P-Captcha

P-Captcha is a lightweight, open-source CAPTCHA solution that uses proof-of-work to protect against bots. It's self-hosted, has zero dependencies, and is developer-friendly.

## Features

- 🪶 **Truly Lightweight** - Zero dependencies, only 2KB gzipped, powered by Web-workers
- 🎨 **Fully Customizable** - Easy to override styles and customize behavior
- 👥 **User-Friendly** - Supports both invisible and one-click verification modes

## Protection Against

- 🚫 **Spam** - Secure forms from spam and automated submissions
- 🤖 **Scraping and Automation** - Protect content from scraping and platform abuse
- 🛡️ **DDoS** - Guard compute-expensive API endpoints
- 🔒 **Account Takeover** - Prevent credential stuffing and brute force attacks

Live demo: https://p-captcha.com/#demo

[![P-captcha Demo]](https://github.com/user-attachments/assets/8d5cc70a-ce2a-40fa-a258-e6436a467cc1)

## Quick Start

### 1. Server-side Installation

```bash
npm install @p-captcha/node
```

### 2. Client-side Installation

```bash
npm install @p-captcha/react
```

### 3. Generate a challenge

```javascript
import { InMemoryCaptchaService, WoodallAliases } from "@p-captcha/node";

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
```

### 4. Solve the challenge

```javascript
import { PCaptchaWidget, PCaptchaWidgetInvisible } from "@p-captcha/react";

/* Requests to fetch challenge and validate */

<PCaptchaWidget
  challenge={challenge}
  onVerified={(solution) => {
    validateOnServer(solution);
  }}
/>

/* Or use invisible component that solves challenge when mounted */

challenge && (
  <PCaptchaWidgetInvisible
    challenge={challenge}
    onVerified={(solution) => {
      validateOnServer(solution);
    }}
  />
)
```

### 5. Validate the solution

```javascript
app.post("/api/validate", (req, res) => {
  const { answer, id } = req.body;
  const success = captchaService.validateAnswer(id, answer);

  if (!success) {
    res.json({ text: "Invalid captcha!" });
    return;
  }

  res.json({ text: "Form processed correctly, captcha is valid!" });
});
```

## Customization

###  Customize difficulty

```javascript
captchaService.generateChallenge(
  "QuadraticResidueProblem",
  {
    woodall: WoodallAliases.md,
    rounds: 2,
  }
);
```

`rounds`: How many problems user needs to solve
`woodall`: Woodall prime number size controls problem difficulty

| Woodall Prime number | Alias | Bits  | Time on Apple M2 Pro* |
| -------------------- | ----- | ----- | --------------------- |
| 83*2^5318-1          | xs    | 5322  | 238 ms                |
| 7755*2^7755-1        | sm    | 7765  | 598 ms                |
| 9531*2^9531-1        | md    | 9542  | 931 ms                |
| 12379*2^12379-1      | lg    | 12387 | 1995 ms               |
| 7911*2^15823-1       | xl    | 15830 | 3466 ms               |
| 18885*2^18885-1      | 2xl   | 18891 | 5581 ms               |
| 22971*2^22971-1      | 3xl   | 22974 | 9199 ms               |
____
\*Average time of 10 runs solving quadratic residue problem with Tonelli-Shanks algorithm

### Customize storage

Out-of-the-box `@p-captcha/node` provides in memory service. But you can easily compose a service with any KV database like Redis. All you need to do is to implement this interface:

```javascript
interface CaptchaStorage {
  saveItem: (key: string, value: string) => IsSuccess;
  getItem: (key: string) => string | null;
  removeItem: (key: string) => IsSuccess;
}
```

### Customize React Component

Widget provides className overrides of all significant elements and allows you to override spinner and success (checkmark) elements.

```javascript
type PCaptchaWidgetProps = {
  onVerified: (solution: string) => void;
  challenge: string;
  label?: string;
  onSubmit?: () => void;
  classNameOverrides?: {
    container?: string;
    checkbox?: string;
    spinner?: string;
    text?: string;
  };
  renderSpinner?: () => React.ReactNode;
  renderSuccess?: () => React.ReactNode;
};
```
