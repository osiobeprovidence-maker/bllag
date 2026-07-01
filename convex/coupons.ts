import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("coupons").collect();
  },
});

export const getById = query({
  args: { id: v.id("coupons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("coupons").filter(q => q.eq(q.field("active"), true)).collect();
  },
});

export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("coupons").withIndex("by_code", q => q.eq("code", args.code)).first();
  },
});

export const create = mutation({
  args: {
    code: v.string(),
    discountType: v.string(),
    percentage: v.optional(v.number()),
    fixedAmount: v.optional(v.number()),
    minSpend: v.optional(v.number()),
    usageLimit: v.optional(v.number()),
    usageCount: v.number(),
    expiryDate: v.optional(v.string()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("coupons", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("coupons"),
    code: v.optional(v.string()),
    discountType: v.optional(v.string()),
    percentage: v.optional(v.number()),
    fixedAmount: v.optional(v.number()),
    minSpend: v.optional(v.number()),
    usageLimit: v.optional(v.number()),
    usageCount: v.optional(v.number()),
    expiryDate: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("coupons") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
