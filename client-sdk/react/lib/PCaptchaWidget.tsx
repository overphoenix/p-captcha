import { useState, useEffect } from "react";
import spinner from "./assets/spinner.svg";
import { worker } from "@p-captcha/js";
import * as styles from "./PCaptchaWidget.module.css";

export type PCaptchaWidgetProps = {
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
};

export function PCaptchaWidget({
  onVerified,
  onSubmit,
  challenge,
  label = "I'm human",
  classNameOverrides,
}: PCaptchaWidgetProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    setIsChecked(false);
    setIsLoading(false);
    setIsVerified(false);
  }, [challenge]);

  const handleCheck = async () => {
    onSubmit?.();
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
    <div className={`${styles.container} ${classNameOverrides?.container}`}>
      {!isChecked && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheck}
          className={`${styles.checkbox} ${classNameOverrides?.checkbox}`}
        />
      )}

      {isLoading && (
        <img
          src={spinner}
          alt="Loading"
          className={`${styles.spinner} ${classNameOverrides?.spinner}`}
        />
      )}

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

      <span className={`${styles.text} ${classNameOverrides?.text}`}>
        {label}
      </span>
    </div>
  );
}
