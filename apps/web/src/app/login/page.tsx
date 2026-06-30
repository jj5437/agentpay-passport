import { AuthFlow } from "../components/AuthFlow";
import { AuthShell } from "../components/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell
      title="Login"
      summary="Enter your email and use the one-time code. No password is stored."
      footerLink={{ href: "/register", label: "Need an account? Create one" }}
    >
      <AuthFlow purpose="login" />
    </AuthShell>
  );
}
