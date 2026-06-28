import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const cartItemSchema = v.object({
  id: v.string(),
  name: v.string(),
  price: v.number(),
  quantity: v.number(),
  category: v.string(),
  image: v.string(),
  description: v.string(),
  isPaySmallSmall: v.optional(v.boolean()),
  isGift: v.optional(v.boolean()),
  originalPrice: v.optional(v.number()),
  discount: v.optional(v.number()),
  rating: v.optional(v.number()),
  reviews: v.optional(v.number()),
  isNew: v.optional(v.boolean()),
  isBestSeller: v.optional(v.boolean()),
  pssConfig: v.optional(
    v.object({
      frequency: v.string(),
      startDate: v.string(),
      installments: v.number(),
    })
  ),
});

const addressSchema = v.object({
  street: v.string(),
  city: v.string(),
  state: v.string(),
  zipCode: v.string(),
  country: v.string(),
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    customerEmail: v.string(),
    customerName: v.string(),
    items: v.array(cartItemSchema),
    total: v.number(),
    status: v.string(),
    paymentStatus: v.string(),
    trackingNumber: v.optional(v.string()),
    shippingAddress: addressSchema,
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("orders", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.optional(v.string()),
    paymentStatus: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: new Date().toISOString() });
  },
});
