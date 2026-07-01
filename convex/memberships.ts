import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByUser = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    return await ctx.db
      .query("memberships")
      .withIndex("by_user_id", (q) => q.eq("userId", session.userId))
      .first();
  },
});

export const create = mutation({
  args: {
    sessionId: v.string(),
    tier: v.string(),
    expiresAt: v.optional(v.string()),
    benefits: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    return await ctx.db.insert("memberships", {
      userId: session.userId,
      tier: args.tier,
      active: true,
      joinedAt: new Date().toISOString(),
      expiresAt: args.expiresAt,
      benefits: args.benefits,
    });
  },
});
