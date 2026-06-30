import { AgentPayDatabase, normalizeEmail, type AuthPurpose } from "@agentpay/db";
import { sendVerificationEmail } from "@agentpay/email";
import {
  buildPaymentEvidenceBundle,
  evaluatePaymentIntent,
  type AgentPolicy,
  type Invoice,
  type VendorProfile
} from "@agentpay/shared";
import { getCookie, setCookie } from "hono/cookie";
import { Hono } from "hono";

type ApiBindings = {
  db: AgentPayDatabase;
};

const sessionCookieName = "agentpay_session";
let defaultDatabase: AgentPayDatabase | null = null;

export function createApp(db?: AgentPayDatabase) {
  const app = new Hono<{ Variables: ApiBindings }>();

  app.use("*", async (context, next) => {
    context.header("access-control-allow-origin", process.env.CORS_ORIGIN ?? "http://127.0.0.1:3000");
    context.header("access-control-allow-credentials", "true");
    context.header("access-control-allow-headers", "content-type");
    context.header("access-control-allow-methods", "GET,POST,PATCH,DELETE,OPTIONS");
    if (context.req.method === "OPTIONS") {
      return context.body(null, 204);
    }
    await next();
  });

  app.get("/health", (context) =>
    context.json({
      ok: true,
      service: "agentpay-api"
    })
  );

  app.post("/payments/evaluate", async (context) => {
    const payload = (await context.req.json().catch(() => null)) as EvaluatePaymentPayload | null;
    if (!isEvaluatePaymentPayload(payload)) {
      return context.json({ ok: false, error: "INVALID_PAYMENT_PAYLOAD" }, 400);
    }

    const evaluation = evaluatePaymentIntent(payload);
    const evidence = buildPaymentEvidenceBundle({ ...payload, evaluation });

    return context.json({
      ok: true,
      evaluation,
      evidence
    });
  });

  app.post("/auth/request-code", async (context) => {
    const payload = (await context.req.json().catch(() => null)) as { email?: string; purpose?: AuthPurpose } | null;
    const email = normalizeEmail(payload?.email ?? "");
    const purpose = payload?.purpose === "login" ? "login" : "register";

    if (!isEmail(email)) {
      return context.json({ ok: false, error: "INVALID_EMAIL" }, 400);
    }

    const record = getDatabase(db).createEmailCode(email, purpose);
    const delivery = await sendVerificationEmail({ email, code: record.code, purpose });

    return context.json({
      ok: true,
      email,
      purpose,
      delivery: delivery.delivery,
      expiresAt: record.expiresAt,
      ...(delivery.devCode ? { devCode: delivery.devCode } : {})
    });
  });

  app.post("/auth/verify-code", async (context) => {
    const payload = (await context.req.json().catch(() => null)) as { email?: string; code?: string } | null;
    const email = normalizeEmail(payload?.email ?? "");
    const code = String(payload?.code ?? "").trim();

    if (!isEmail(email) || !/^\d{6}$/.test(code)) {
      return context.json({ ok: false, error: "INVALID_CODE" }, 400);
    }

    const database = getDatabase(db);
    const user = database.verifyEmailCode(email, code);
    if (!user) {
      return context.json({ ok: false, error: "INVALID_CODE" }, 401);
    }

    const session = database.createSession(user.id);
    setCookie(context, sessionCookieName, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60
    });

    return context.json({ ok: true, user });
  });

  app.get("/auth/session", (context) => {
    const user = getDatabase(db).getUserBySessionToken(getCookie(context, sessionCookieName));
    if (!user) {
      return context.json({ ok: false, user: null }, 401);
    }
    return context.json({ ok: true, user });
  });

  app.post("/auth/logout", (context) => {
    getDatabase(db).revokeSession(getCookie(context, sessionCookieName));
    setCookie(context, sessionCookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      maxAge: 0
    });
    return context.json({ ok: true });
  });

  return app;
}

export const app = createApp();

function getDatabase(db: AgentPayDatabase | undefined): AgentPayDatabase {
  if (db) {
    return db;
  }

  defaultDatabase ??= new AgentPayDatabase();
  return defaultDatabase;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type EvaluatePaymentPayload = {
  policy: AgentPolicy;
  invoice: Invoice;
  vendor: VendorProfile;
};

function isEvaluatePaymentPayload(value: EvaluatePaymentPayload | null): value is EvaluatePaymentPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  return isPolicy(value.policy) && isInvoice(value.invoice) && isVendor(value.vendor);
}

function isPolicy(value: AgentPolicy | undefined): value is AgentPolicy {
  return Boolean(
    value &&
      typeof value.id === "string" &&
      typeof value.buyerName === "string" &&
      typeof value.maxAmount === "number" &&
      typeof value.currency === "string" &&
      Array.isArray(value.allowedCategories) &&
      typeof value.requireKyc === "boolean" &&
      Array.isArray(value.milestones) &&
      typeof value.expiresAt === "string"
  );
}

function isInvoice(value: Invoice | undefined): value is Invoice {
  return Boolean(
    value &&
      typeof value.id === "string" &&
      typeof value.vendorId === "string" &&
      typeof value.vendorName === "string" &&
      typeof value.category === "string" &&
      typeof value.service === "string" &&
      typeof value.amount === "number" &&
      typeof value.currency === "string" &&
      Array.isArray(value.milestones)
  );
}

function isVendor(value: VendorProfile | undefined): value is VendorProfile {
  return Boolean(
    value &&
      typeof value.id === "string" &&
      typeof value.name === "string" &&
      typeof value.wallet === "string" &&
      ["approved", "pending", "missing", "rejected"].includes(value.kycStatus)
  );
}
