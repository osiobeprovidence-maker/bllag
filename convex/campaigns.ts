import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("campaigns").collect();
  },
});

export const getById = query({
  args: { id: v.id("campaigns") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    description: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
    ctaText: v.optional(v.string()),
    ctaLink: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    priority: v.number(),
    targetAudience: v.string(),
    status: v.string(),
    views: v.number(),
    clicks: v.number(),
    ctr: v.number(),
    conversions: v.number(),
    revenue: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("campaigns", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("campaigns"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    description: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
    ctaText: v.optional(v.string()),
    ctaLink: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    priority: v.optional(v.number()),
    targetAudience: v.optional(v.string()),
    status: v.optional(v.string()),
    views: v.optional(v.number()),
    clicks: v.optional(v.number()),
    ctr: v.optional(v.number()),
    conversions: v.optional(v.number()),
    revenue: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("campaigns") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
