"use client";

import { useState } from "react";

type AuthFlowProps = {
  purpose: "register" | "login";
};

type Step = "email" | "code" | "done";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8787";

export function AuthFlow({ purpose }: AuthFlowProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [message, setMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  async function requestCode() {
    setIsBusy(true);
    setMessage("");
    try {
      const response = await fetch(`${apiBaseUrl}/auth/request-code`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, purpose })
      });
      const body = await response.json();
      if (!response.ok) {
        setMessage("Please enter a valid email address.");
        return;
      }
      setDevCode(body.devCode ?? "");
      setStep("code");
      setMessage(body.delivery === "dev" ? "Dev mode code generated below." : "Verification code sent.");
    } finally {
      setIsBusy(false);
    }
  }

  async function verifyCode() {
    setIsBusy(true);
    setMessage("");
    try {
      const response = await fetch(`${apiBaseUrl}/auth/verify-code`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code })
      });
      if (!response.ok) {
        setMessage("That code is invalid or expired.");
        return;
      }
      setStep("done");
      setMessage("Email verified. Opening the command center.");
      window.setTimeout(() => {
        window.location.href = "/app";
      }, 500);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
      <label>
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={step !== "email"}
        />
      </label>

      {step !== "email" ? (
        <label>
          Verification code
          <input
            name="code"
            inputMode="numeric"
            pattern="[0-9]*"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </label>
      ) : null}

      {devCode ? (
        <div className="dev-code" role="status">
          <span>Local dev code</span>
          <strong>{devCode}</strong>
        </div>
      ) : null}

      {purpose === "register" ? (
        <div className="consent-stack">
          <label className="check-row">
            <input name="terms" type="checkbox" required />
            <span>I accept the Terms of Service.</span>
          </label>
          <label className="check-row">
            <input name="privacy" type="checkbox" required />
            <span>I accept the Privacy Policy.</span>
          </label>
        </div>
      ) : null}

      <button type="button" disabled={isBusy || step === "done"} onClick={step === "email" ? requestCode : verifyCode}>
        {step === "email" ? "Send code" : "Verify code"}
      </button>

      {message ? <p className="form-message">{message}</p> : null}
    </form>
  );
}
