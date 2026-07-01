import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categoryImages")
      .withIndex("by_order")
      .filter((q) => q.eq(q.field("visible"), true))
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categoryImages").collect();
  },
});

export const create = mutation({
  args: {
    sessionId: v.string(),
    name: v.string(),
    image: v.string(),
    link: v.string(),
    displayOrder: v.number(),
    visible: v.boolean(),
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
    return await ctx.db.insert("categoryImages", {
      ...data,
      createdAt: new Date().toISOString(),
    });
  },
});

export const update = mutation({
  args: {
    sessionId: v.string(),
    id: v.id("categoryImages"),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    link: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");
    const user = await ctx.db.get(session.userId);
    if (!user || user.role !== "admin") throw new Error("Not authorized");
    const { sessionId, id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { sessionId: v.string(), id: v.id("categoryImages") },
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
