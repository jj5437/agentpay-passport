export type VerificationDelivery = {
  delivery: "smtp" | "dev";
  devCode?: string;
};

export type VerificationEmailInput = {
  email: string;
  code: string;
  purpose: "register" | "login";
};

export async function sendVerificationEmail(input: VerificationEmailInput): Promise<VerificationDelivery> {
  const hasSmtpConfig = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

  if (!hasSmtpConfig) {
    return {
      delivery: "dev",
      devCode: input.code
    };
  }

  // SMTP transport is intentionally isolated for Phase 2. The API contract is already stable.
  console.info(`AgentPay verification code for ${input.email}: ${input.code}`);
  return { delivery: "smtp" };
}
