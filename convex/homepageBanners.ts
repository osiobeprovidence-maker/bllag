import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("homepageBanners")
      .withIndex("by_order")
      .collect();
  },
});

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const banners = await ctx.db
      .query("homepageBanners")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();
    return banners.filter((b) => {
      if (b.startDate && b.startDate > now) return false;
      if (b.endDate && b.endDate < now) return false;
      return true;
    }).sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

export const create = mutation({
  args: {
    sessionId: v.string(),
    image: v.string(),
    smallHeading: v.string(),
    mainHeading: v.string(),
    description: v.string(),
    ctaText: v.string(),
    ctaLink: v.string(),
    displayOrder: v.number(),
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
    return await ctx.db.insert("homepageBanners", {
      ...data,
      createdAt: new Date().toISOString(),
    });
  },
});

export const update = mutation({
  args: {
    sessionId: v.string(),
    id: v.id("homepageBanners"),
    image: v.optional(v.string()),
    smallHeading: v.optional(v.string()),
    mainHeading: v.optional(v.string()),
    description: v.optional(v.string()),
    ctaText: v.optional(v.string()),
    ctaLink: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
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
  args: { sessionId: v.string(), id: v.id("homepageBanners") },
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

export const reorder = mutation({
  args: {
    sessionId: v.string(),
    items: v.array(v.object({ id: v.id("homepageBanners"), displayOrder: v.number() })),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");
    const user = await ctx.db.get(session.userId);
    if (!user || user.role !== "admin") throw new Error("Not authorized");
    for (const item of args.items) {
      await ctx.db.patch(item.id, { displayOrder: item.displayOrder });
    }
  },
});
