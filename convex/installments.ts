import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("installments").order("desc").collect();
  },
});

export const getBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) return [];
    return await ctx.db
      .query("installments")
      .withIndex("by_user_id", (q) => q.eq("userId", session.userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    productName: v.string(),
    totalAmount: v.number(),
    paidAmount: v.number(),
    installmentsCount: v.number(),
    paidInstallments: v.number(),
    nextPaymentDate: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("installments", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("installments"),
    paidAmount: v.optional(v.number()),
    paidInstallments: v.optional(v.number()),
    nextPaymentDate: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});
