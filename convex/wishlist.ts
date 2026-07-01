import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) return [];

    return await ctx.db
      .query("wishlist")
      .withIndex("by_user_id", (q) => q.eq("userId", session.userId))
      .collect();
  },
});

export const count = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) return 0;

    const items = await ctx.db
      .query("wishlist")
      .withIndex("by_user_id", (q) => q.eq("userId", session.userId))
      .collect();
    return items.length;
  },
});

export const add = mutation({
  args: { sessionId: v.string(), productId: v.id("products") },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("wishlist")
      .withIndex("by_product_id", (q) => q.eq("productId", args.productId))
      .first();
    if (existing) return existing._id;

    return await ctx.db.insert("wishlist", {
      userId: session.userId,
      productId: args.productId,
      createdAt: new Date().toISOString(),
    });
  },
});

export const remove = mutation({
  args: { sessionId: v.string(), productId: v.id("products") },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    const item = await ctx.db
      .query("wishlist")
      .withIndex("by_product_id", (q) => q.eq("productId", args.productId))
      .first();
    if (item && item.userId === session.userId) {
      await ctx.db.delete(item._id);
    }
  },
});
