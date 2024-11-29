import { PCaptchaWidget, challenge } from '../lib/main'

export default function Preview() {
  return <PCaptchaWidget onVerified={() => {}} challenge={challenge} />
}
