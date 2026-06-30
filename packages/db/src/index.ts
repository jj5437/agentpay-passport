import { createHash, randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

type SQLiteDatabase = {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...values: unknown[]): unknown;
    get(...values: unknown[]): unknown;
  };
};

const require = createRequire(import.meta.url);
const { DatabaseSync } = require("node:sqlite") as {
  DatabaseSync: new (path: string) => SQLiteDatabase;
};

export type AuthPurpose = "register" | "login";

export type AgentPayUser = {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  createdAt: string;
};

export type CodeRecord = {
  email: string;
  code: string;
  purpose: AuthPurpose;
  expiresAt: string;
};

type UserRow = {
  id: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
};

type SessionRow = {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  revoked_at: string | null;
};

export class AgentPayDatabase {
  private readonly db: SQLiteDatabase;

  constructor(path = defaultDatabasePath()) {
    mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec("PRAGMA journal_mode = WAL");
    this.db.exec("PRAGMA foreign_keys = ON");
    this.migrate();
  }

  createEmailCode(email: string, purpose: AuthPurpose): CodeRecord {
    const normalizedEmail = normalizeEmail(email);
    const user = this.upsertUser(normalizedEmail);
    const code = randomSixDigitCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString();

    this.db
      .prepare(
        `INSERT INTO email_codes (id, user_id, email, code_hash, purpose, expires_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(randomId("code"), user.id, normalizedEmail, hashSecret(code), purpose, expiresAt, now.toISOString());

    return {
      email: normalizedEmail,
      code,
      purpose,
      expiresAt
    };
  }

  verifyEmailCode(email: string, code: string): AgentPayUser | null {
    const normalizedEmail = normalizeEmail(email);
    const now = new Date().toISOString();
    const row = this.db
      .prepare(
        `SELECT id, user_id
         FROM email_codes
         WHERE email = ? AND code_hash = ? AND used_at IS NULL AND expires_at > ?
         ORDER BY created_at DESC
         LIMIT 1`
      )
      .get(normalizedEmail, hashSecret(code), now) as { id: string; user_id: string } | undefined;

    if (!row) {
      return null;
    }

    this.db.prepare("UPDATE email_codes SET used_at = ? WHERE id = ?").run(now, row.id);
    this.db.prepare("UPDATE users SET email_verified_at = ? WHERE id = ?").run(now, row.user_id);
    return this.getUserById(row.user_id);
  }

  createSession(userId: string): { token: string; expiresAt: string } {
    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    this.db
      .prepare(
        `INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(randomId("session"), userId, hashSecret(token), expiresAt, new Date().toISOString());
    return { token, expiresAt };
  }

  getUserBySessionToken(token: string | undefined): AgentPayUser | null {
    if (!token) {
      return null;
    }

    const row = this.db
      .prepare(
        `SELECT sessions.id, sessions.user_id, sessions.token_hash, sessions.expires_at, sessions.revoked_at
         FROM sessions
         WHERE sessions.token_hash = ? AND sessions.revoked_at IS NULL AND sessions.expires_at > ?`
      )
      .get(hashSecret(token), new Date().toISOString()) as SessionRow | undefined;

    return row ? this.getUserById(row.user_id) : null;
  }

  revokeSession(token: string | undefined): void {
    if (!token) {
      return;
    }

    this.db
      .prepare("UPDATE sessions SET revoked_at = ? WHERE token_hash = ?")
      .run(new Date().toISOString(), hashSecret(token));
  }

  private upsertUser(email: string): AgentPayUser {
    const existing = this.getUserByEmail(email);
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const id = randomId("user");
    this.db
      .prepare("INSERT INTO users (id, email, created_at, updated_at) VALUES (?, ?, ?, ?)")
      .run(id, email, now, now);
    return {
      id,
      email,
      emailVerifiedAt: null,
      createdAt: now
    };
  }

  private getUserByEmail(email: string): AgentPayUser | null {
    const row = this.db.prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
    return row ? mapUser(row) : null;
  }

  private getUserById(id: string): AgentPayUser | null {
    const row = this.db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
    return row ? mapUser(row) : null;
  }

  private migrate(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        email_verified_at TEXT,
        terms_accepted_at TEXT,
        privacy_accepted_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS email_codes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        code_hash TEXT NOT NULL,
        purpose TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        used_at TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        revoked_at TEXT,
        created_at TEXT NOT NULL
      );
    `);
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function defaultDatabasePath(): string {
  return process.env.AGENTPAY_DB_PATH ?? join(process.cwd(), ".agentpay", "agentpay.sqlite");
}

function randomSixDigitCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function randomId(prefix: string): string {
  return `${prefix}_${randomBytes(12).toString("hex")}`;
}

function hashSecret(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function mapUser(row: UserRow): AgentPayUser {
  return {
    id: row.id,
    email: row.email,
    emailVerifiedAt: row.email_verified_at,
    createdAt: row.created_at
  };
}
