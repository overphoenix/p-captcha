import { useEffect } from "react";
import { worker } from "p-captcha-vanilla";

export type PCaptchaWidgetInvisibleProps = {
  onVerified: (solution: string) => void;
  onSubmit?: () => void;
  challenge: string;
};

export function PCaptchaWidgetInvisible({
  onVerified,
  onSubmit,
  challenge,
}: PCaptchaWidgetInvisibleProps) {
  useEffect(() => {
    onSubmit?.();
    worker.postMessage(challenge);

    worker.onmessage = (e: MessageEvent<string>) => {
      onVerified(e.data);
    };
  }, [challenge]);

  return null;
}
