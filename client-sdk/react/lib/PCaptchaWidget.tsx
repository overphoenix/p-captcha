import { useState } from "react";
import spinner from "./assets/spinner.svg";
import { worker } from "p-captcha-vanilla";
import "./PCaptchaWidget.css";

export type PCaptchaWidgetProps = {
  onVerified: (solution: string) => void;
  challenge: string;
  label?: string;
};

export function PCaptchaWidget({
  onVerified,
  challenge,
  label = "I'm human",
}: PCaptchaWidgetProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleCheck = async () => {
    setIsChecked(true);
    setIsLoading(true);

    worker.onmessage = (e: MessageEvent<string>) => {
      onVerified(e.data);
      setIsLoading(false);
      setIsVerified(true);
    };

    worker.postMessage(challenge);
  };

  return (
    <div className="container">
      {!isChecked && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheck}
          className="checkbox"
        />
      )}

      {isLoading && <img src={spinner} alt="Loading" className="spinner" />}

      {isVerified && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="green"
          strokeWidth="2"
        >
          <path d="M20 6L9 17L4 12" />
        </svg>
      )}

      <span className="text">{label}</span>
    </div>
  );
}
