import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("promotionalBanners")
      .withIndex("by_priority")
      .collect();
  },
});

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const banners = await ctx.db
      .query("promotionalBanners")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
    return banners.filter((b) => {
      if (b.startDate && b.startDate > now) return false;
      if (b.endDate && b.endDate < now) return false;
      return true;
    }).sort((a, b) => a.priority - b.priority);
  },
});

export const create = mutation({
  args: {
    sessionId: v.string(),
    desktopImage: v.string(),
    mobileImage: v.optional(v.string()),
    title: v.string(),
    subtitle: v.optional(v.string()),
    ctaText: v.string(),
    ctaLink: v.string(),
    bgColor: v.optional(v.string()),
    overlayOpacity: v.optional(v.number()),
    priority: v.number(),
    active: v.boolean(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
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
    return await ctx.db.insert("promotionalBanners", {
      ...data,
      createdAt: new Date().toISOString(),
    });
  },
});

export const update = mutation({
  args: {
    sessionId: v.string(),
    id: v.id("promotionalBanners"),
    desktopImage: v.optional(v.string()),
    mobileImage: v.optional(v.string()),
    title: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    ctaText: v.optional(v.string()),
    ctaLink: v.optional(v.string()),
    bgColor: v.optional(v.string()),
    overlayOpacity: v.optional(v.number()),
    priority: v.optional(v.number()),
    active: v.optional(v.boolean()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
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
  args: { sessionId: v.string(), id: v.id("promotionalBanners") },
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
