import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getBestSellers = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products.filter((p) => p.isBestSeller);
  },
});

export const getNewArrivals = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products.filter((p) => p.isNew || p.discount);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    discount: v.optional(v.number()),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    category: v.string(),
    image: v.string(),
    description: v.string(),
    isNew: v.optional(v.boolean()),
    isBestSeller: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    discount: v.optional(v.number()),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    category: v.optional(v.string()),
    image: v.optional(v.string()),
    description: v.optional(v.string()),
    isNew: v.optional(v.boolean()),
    isBestSeller: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
