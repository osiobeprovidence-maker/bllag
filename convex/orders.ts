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

export const getBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) return [];

    return await ctx.db
      .query("orders")
      .withIndex("by_user_id", (q) => q.eq("userId", session.userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    sessionId: v.string(),
    orderNumber: v.string(),
    customerEmail: v.string(),
    customerName: v.string(),
    items: v.array(cartItemSchema),
    subtotal: v.number(),
    shipping: v.number(),
    total: v.number(),
    status: v.string(),
    paymentStatus: v.string(),
    trackingNumber: v.optional(v.string()),
    shippingAddress: addressSchema,
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    const now = new Date().toISOString();
    return await ctx.db.insert("orders", {
      orderNumber: args.orderNumber,
      userId: session.userId,
      customerEmail: args.customerEmail,
      customerName: args.customerName,
      items: args.items,
      subtotal: args.subtotal,
      shipping: args.shipping,
      total: args.total,
      status: args.status,
      paymentStatus: args.paymentStatus,
      trackingNumber: args.trackingNumber,
      shippingAddress: args.shippingAddress,
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
