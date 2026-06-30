import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_API = "https://api.paystack.co";

export const initializePayment = action({
  args: {
    sessionId: v.string(),
    email: v.string(),
    amount: v.number(),
    callbackUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error("Paystack secret key not configured.");
    }

    const user = await ctx.runQuery(api.auth.getSession, { sessionId: args.sessionId });
    if (!user) throw new Error("Not authenticated.");

    const reference = `BLG-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: args.email,
        amount: Math.round(args.amount * 100),
        reference,
        callback_url: args.callbackUrl || "https://www.bllag.xyz/wallet/payment-success",
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Paystack initialize error:", body);
      throw new Error("Failed to initialize payment.");
    }

    const data = await res.json();
    return {
      authorizationUrl: data.data.authorization_url,
      reference,
    };
  },
});

export const verifyPayment = action({
  args: {
    sessionId: v.string(),
    reference: v.string(),
  },
  handler: async (ctx, args) => {
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error("Paystack secret key not configured.");
    }

    const user = await ctx.runQuery(api.auth.getSession, { sessionId: args.sessionId });
    if (!user) throw new Error("Not authenticated.");

    const existing = await ctx.runQuery(api.payments.getTransactionByReference, {
      reference: args.reference,
    });
    if (existing) {
      throw new Error("This payment has already been processed.");
    }

    const res = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(args.reference)}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Paystack verify error:", body);
      throw new Error("Failed to verify payment.");
    }

    const data = await res.json();

    if (data.data.status !== "success") {
      throw new Error("Payment was not successful.");
    }

    const amountPaid = data.data.amount / 100;
    const metadata = {
      paystack_status: data.data.status,
      paystack_channel: data.data.channel,
      paystack_id: data.data.id,
      paid_at: data.data.paid_at,
    };

    await ctx.runMutation(api.payments.createTransaction, {
      sessionId: args.sessionId,
      type: "deposit",
      amount: amountPaid,
      reference: args.reference,
      status: "completed",
      description: `Wallet top-up via Paystack`,
      provider: "paystack",
      metadata,
    });

    await ctx.runMutation(api.users.updateBalance, {
      sessionId: args.sessionId,
      amount: amountPaid,
    });

    return {
      verified: true,
      amount: amountPaid,
      reference: args.reference,
    };
  },
});

export const getTransactionByReference = query({
  args: { reference: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .first();
  },
});

export const createTransaction = mutation({
  args: {
    sessionId: v.string(),
    type: v.string(),
    amount: v.number(),
    reference: v.string(),
    status: v.string(),
    description: v.optional(v.string()),
    provider: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated.");

    await ctx.db.insert("transactions", {
      userId: session.userId,
      type: args.type,
      amount: args.amount,
      reference: args.reference,
      status: args.status,
      description: args.description,
      provider: args.provider,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
  },
});

export const getTransactions = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated.");

    return await ctx.db
      .query("transactions")
      .withIndex("by_user_id", (q) => q.eq("userId", session.userId))
      .order("desc")
      .collect();
  },
});
