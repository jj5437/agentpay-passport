import { AuthFlow } from "../components/AuthFlow";
import { AuthShell } from "../components/AuthShell";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      summary="Register with an email verification code. No password is required."
      footerLink={{ href: "/login", label: "Already have an account? Login" }}
    >
      <AuthFlow purpose="register" />
    </AuthShell>
  );
}
