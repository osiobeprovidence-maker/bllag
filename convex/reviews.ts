import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_product_id", (q) => q.eq("productId", args.productId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    productId: v.id("products"),
    userId: v.string(),
    userName: v.string(),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviews", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});
