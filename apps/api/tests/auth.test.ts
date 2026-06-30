import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app";

let dbDir: string;

beforeEach(() => {
  dbDir = mkdtempSync(join(tmpdir(), "agentpay-api-"));
  process.env.AGENTPAY_DB_PATH = join(dbDir, "test.sqlite");
});

afterEach(() => {
  rmSync(dbDir, { recursive: true, force: true });
  delete process.env.AGENTPAY_DB_PATH;
});

describe("passwordless email auth", () => {
  it("requests a registration code, verifies it, and returns the active session", async () => {
    const app = createApp();

    const requestResponse = await app.request("/auth/request-code", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "judge@example.com", purpose: "register" })
    });
    const requestBody = await requestResponse.json();

    expect(requestResponse.status).toBe(200);
    expect(requestBody).toMatchObject({
      ok: true,
      email: "judge@example.com",
      delivery: "dev"
    });
    expect(requestBody.devCode).toMatch(/^\d{6}$/);

    const verifyResponse = await app.request("/auth/verify-code", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "judge@example.com", code: requestBody.devCode })
    });
    const verifyBody = await verifyResponse.json();
    const cookie = verifyResponse.headers.get("set-cookie") ?? "";

    expect(verifyResponse.status).toBe(200);
    expect(verifyBody.user.email).toBe("judge@example.com");
    expect(verifyBody.user.emailVerifiedAt).toBeTruthy();
    expect(cookie).toContain("agentpay_session=");
    expect(cookie).toContain("HttpOnly");

    const sessionResponse = await app.request("/auth/session", {
      headers: { cookie }
    });
    const sessionBody = await sessionResponse.json();

    expect(sessionResponse.status).toBe(200);
    expect(sessionBody.user.email).toBe("judge@example.com");
  });

  it("rejects an invalid verification code", async () => {
    const app = createApp();

    await app.request("/auth/request-code", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "judge@example.com", purpose: "login" })
    });

    const response = await app.request("/auth/verify-code", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "judge@example.com", code: "000000" })
    });

    expect(response.status).toBe(401);
  });
});
