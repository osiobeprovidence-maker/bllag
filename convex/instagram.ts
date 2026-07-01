import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const defaultSettings = {
  enabled: true,
  title: "@blag_official",
  subtitle: "Follow us on Instagram",
  username: "blag_official",
  profileUrl: "https://instagram.com/blag_official",
  buttonText: "Follow Us",
  feedSource: "manual",
};

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("instagramSettings").collect();
    const map: Record<string, any> = {};
    rows.forEach((r) => { map[r.key] = r.value; });
    return { ...defaultSettings, ...map };
  },
});

export const updateSettings = mutation({
  args: {
    sessionId: v.string(),
    settings: v.object({
      enabled: v.boolean(),
      title: v.string(),
      subtitle: v.string(),
      username: v.string(),
      profileUrl: v.string(),
      buttonText: v.string(),
      feedSource: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");
    const user = await ctx.db.get(session.userId);
    if (!user || user.role !== "admin") throw new Error("Not authorized");
    for (const [key, value] of Object.entries(args.settings)) {
      const existing = await ctx.db
        .query("instagramSettings")
        .withIndex("by_key", (q) => q.eq("key", key))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, { value });
      } else {
        await ctx.db.insert("instagramSettings", { key, value, createdAt: new Date().toISOString() });
      }
    }
  },
});

export const listPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("instagramPosts")
      .withIndex("by_order")
      .collect();
  },
});

export const getActivePosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("instagramPosts")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();
  },
});

export const createPost = mutation({
  args: {
    sessionId: v.string(),
    image: v.string(),
    video: v.optional(v.string()),
    caption: v.string(),
    link: v.string(),
    altText: v.optional(v.string()),
    displayOrder: v.number(),
    active: v.boolean(),
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
    return await ctx.db.insert("instagramPosts", {
      ...data,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updatePost = mutation({
  args: {
    sessionId: v.string(),
    id: v.id("instagramPosts"),
    image: v.optional(v.string()),
    video: v.optional(v.string()),
    caption: v.optional(v.string()),
    link: v.optional(v.string()),
    altText: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    active: v.optional(v.boolean()),
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

export const removePost = mutation({
  args: { sessionId: v.string(), id: v.id("instagramPosts") },
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

export const reorderPosts = mutation({
  args: {
    sessionId: v.string(),
    items: v.array(v.object({ id: v.id("instagramPosts"), displayOrder: v.number() })),
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
