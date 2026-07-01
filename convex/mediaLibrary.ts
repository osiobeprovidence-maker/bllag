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
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
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

export const rename = mutation({
  args: { sessionId: v.string(), id: v.id("mediaLibrary"), name: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");
    const user = await ctx.db.get(session.userId);
    if (!user || user.role !== "admin") throw new Error("Not authorized");
    await ctx.db.patch(args.id, { name: args.name });
  },
});

export const updateAlt = mutation({
  args: { sessionId: v.string(), id: v.id("mediaLibrary"), alt: v.optional(v.string()), title: v.optional(v.string()), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");
    const user = await ctx.db.get(session.userId);
    if (!user || user.role !== "admin") throw new Error("Not authorized");
    const { sessionId, id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("mediaLibrary")
      .order("desc")
      .collect();
    const q = args.query.toLowerCase();
    return all.filter((m) => m.name.toLowerCase().includes(q) || (m.alt && m.alt.toLowerCase().includes(q)));
  },
});

export const getUsage = query({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    const usages: { table: string; ids: string[] }[] = [];

    const homepageBanners = await ctx.db.query("homepageBanners").collect();
    const usedInHomepage = homepageBanners.filter(
      (b) => b.desktopImage === args.url || b.mobileImage === args.url || b.tabletImage === args.url
    );
    if (usedInHomepage.length > 0) {
      usages.push({ table: "homepageBanners", ids: usedInHomepage.map((b) => b._id.toString()) });
    }

    const promoBanners = await ctx.db.query("promotionalBanners").collect();
    const usedInPromo = promoBanners.filter(
      (b) => b.desktopImage === args.url || b.mobileImage === args.url
    );
    if (usedInPromo.length > 0) {
      usages.push({ table: "promotionalBanners", ids: usedInPromo.map((b) => b._id.toString()) });
    }

    const campaigns = await ctx.db.query("campaigns").collect();
    const usedInCampaigns = campaigns.filter((c) => c.bannerImage === args.url);
    if (usedInCampaigns.length > 0) {
      usages.push({ table: "campaigns", ids: usedInCampaigns.map((c) => c._id.toString()) });
    }

    const products = await ctx.db.query("products").collect();
    const usedInProducts = products.filter((p) => p.image === args.url);
    if (usedInProducts.length > 0) {
      usages.push({ table: "products", ids: usedInProducts.map((p) => p._id.toString()) });
    }

    return usages;
  },
});
