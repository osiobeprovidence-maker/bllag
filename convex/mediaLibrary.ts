import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("mediaLibrary")
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    sessionId: v.string(),
    url: v.string(),
    name: v.string(),
    alt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");
    const user = await ctx.db.get(session.userId);
    if (!user || user.role !== "admin") throw new Error("Not authorized");
    const { sessionId, ...data } = args;
    return await ctx.db.insert("mediaLibrary", {
      ...data,
      createdAt: new Date().toISOString(),
    });
  },
});

export const remove = mutation({
  args: { sessionId: v.string(), id: v.id("mediaLibrary") },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");
    const user = await ctx.db.get(session.userId);
    if (!user || user.role !== "admin") throw new Error("Not authorized");
    await ctx.db.delete(args.id);
  },
});
