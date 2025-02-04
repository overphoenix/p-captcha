import { useEffect } from "react";
import { worker } from "p-captcha-vanilla";

export type PCaptchaWidgetInvisibleProps = {
  onVerified: (solution: string) => void;
  challenge: string;
};

export function PCaptchaWidgetInvisible({
  onVerified,
  challenge,
}: PCaptchaWidgetInvisibleProps) {
  useEffect(() => {
    worker.postMessage(challenge);

    worker.onmessage = (e: MessageEvent<string>) => {
      onVerified(e.data);
    };
  }, []);

  return null;
}
