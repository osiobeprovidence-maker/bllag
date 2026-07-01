import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("websiteSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("websiteSettings").collect();
    const result: Record<string, unknown> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return result;
  },
});

export const set = mutation({
  args: {
    sessionId: v.string(),
    key: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");
    const user = await ctx.db.get(session.userId);
    if (!user || user.role !== "admin") throw new Error("Not authorized");
    const { sessionId, key, value } = args;
    const existing = await ctx.db
      .query("websiteSettings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { value });
    } else {
      await ctx.db.insert("websiteSettings", { key, value });
    }
  },
});
