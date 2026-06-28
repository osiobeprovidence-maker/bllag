import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("collections").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("collections", args);
  },
});

export const remove = mutation({
  args: { id: v.id("collections") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
