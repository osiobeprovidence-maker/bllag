import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("homepageSections")
      .order("asc")
      .collect();
  },
});

export const getByKey = query({
  args: { sectionKey: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("homepageSections")
      .withIndex("by_section_key", (q) => q.eq("sectionKey", args.sectionKey))
      .first();
  },
});

export const upsert = mutation({
  args: {
    sessionId: v.string(),
    sectionKey: v.string(),
    title: v.optional(v.string()),
    visible: v.boolean(),
    displayOrder: v.number(),
    settings: v.optional(v.any()),
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
    const existing = await ctx.db
      .query("homepageSections")
      .withIndex("by_section_key", (q) => q.eq("sectionKey", data.sectionKey))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    }
    return await ctx.db.insert("homepageSections", {
      ...data,
      createdAt: new Date().toISOString(),
    });
  },
});

export const update = mutation({
  args: {
    sessionId: v.string(),
    id: v.id("homepageSections"),
    title: v.optional(v.string()),
    visible: v.optional(v.boolean()),
    displayOrder: v.optional(v.number()),
    settings: v.optional(v.any()),
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
