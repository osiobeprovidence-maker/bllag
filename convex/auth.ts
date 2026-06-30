import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const TOKEN_EXPIRY_MS = 15 * 60 * 1000;
const RATE_LIMIT_MS = 60 * 1000;

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const sendMagicLink = action({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();

    const recent = await ctx.runQuery(api.auth.getRecentToken, { email });
    if (recent) {
      throw new Error("Please wait before requesting a new link.");
    }

    const rawToken = crypto.randomUUID();
    const tokenHash = await sha256(rawToken);
    const expiresAt = Date.now() + TOKEN_EXPIRY_MS;

    await ctx.runMutation(api.auth.storeToken, {
      tokenHash,
      email,
      expiresAt,
    });

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set — skipping magic link email");
      return { sent: false };
    }

    const magicLink = `https://www.bllag.xyz/auth/verify?token=${rawToken}&email=${encodeURIComponent(email)}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "bllag <noreply@bllag.xyz>",
        to: email,
        subject: "Sign in to bllag",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-1px">Sign in to bllag</h1>
            <p style="color:#666">Click the button below to sign in. This link expires in 15 minutes.</p>
            <a href="${magicLink}" style="display:inline-block;background:#000;color:#fff;padding:14px 40px;text-decoration:none;text-transform:uppercase;font-size:13px;letter-spacing:2px;margin:24px 0">Sign In</a>
            <p style="color:#999;font-size:12px">If you didn't request this, you can safely ignore this email.</p>
            <p style="color:#999;font-size:12px;margin-top:32px">bllag — Luxury Jewelry & High-End Collections</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error:", body);
      return { sent: false };
    }

    return { sent: true };
  },
});

export const getRecentToken = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const tokens = await ctx.db
      .query("authTokens")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .order("desc")
      .take(1);
    if (tokens.length === 0) return null;
    const last = tokens[0];
    if (last.createdAt > Date.now() - RATE_LIMIT_MS) return last;
    return null;
  },
});

export const storeToken = mutation({
  args: {
    tokenHash: v.string(),
    email: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("authTokens", {
      tokenHash: args.tokenHash,
      email: args.email,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });
  },
});

export const verifyMagicLink = mutation({
  args: {
    token: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const tokenHash = await sha256(args.token);

    const stored = await ctx.db
      .query("authTokens")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash))
      .first();

    if (!stored) throw new Error("Invalid or expired link.");
    if (stored.email !== email) throw new Error("Invalid or expired link.");
    if (stored.usedAt) throw new Error("This link has already been used.");
    if (stored.expiresAt < Date.now()) throw new Error("This link has expired. Request a new one.");

    await ctx.db.patch(stored._id, { usedAt: Date.now() });

    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    const name = email.split("@")[0];
    const role = email === "riderezzy@gmail.com" ? "admin" : "customer";

    if (user) {
      await ctx.db.patch(user._id, { name, role });
    } else {
      const userId = await ctx.db.insert("users", {
        name,
        email,
        role,
        walletBalance: 50000,
      });
      user = await ctx.db.get(userId);
    }

    if (!user) throw new Error("Failed to create/retrieve user.");

    const sessionId = crypto.randomUUID();
    await ctx.db.insert("sessions", {
      sessionId,
      userId: user._id,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    });

    return {
      sessionId,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        walletBalance: user.walletBalance,
        address: user.address,
      },
    };
  },
});

export const getSession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!session) return null;
    if (session.expiresAt < Date.now()) return null;

    const user = await ctx.db.get(session.userId);
    if (!user) return null;

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      walletBalance: user.walletBalance,
      address: user.address,
    };
  },
});

export const logout = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});
