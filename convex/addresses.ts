import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    return await ctx.db
      .query("addresses")
      .withIndex("by_user_id", (q) => q.eq("userId", session.userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    sessionId: v.string(),
    fullName: v.string(),
    phone: v.string(),
    country: v.string(),
    state: v.string(),
    city: v.string(),
    street: v.string(),
    postalCode: v.string(),
    default: v.boolean(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    if (args.default) {
      const existing = await ctx.db
        .query("addresses")
        .withIndex("by_user_id", (q) => q.eq("userId", session.userId))
        .collect();
      for (const addr of existing) {
        await ctx.db.patch(addr._id, { default: false });
      }
    }

    return await ctx.db.insert("addresses", {
      userId: session.userId,
      fullName: args.fullName,
      phone: args.phone,
      country: args.country,
      state: args.state,
      city: args.city,
      street: args.street,
      postalCode: args.postalCode,
      default: args.default,
    });
  },
});

export const remove = mutation({
  args: { sessionId: v.string(), addressId: v.id("addresses") },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    const addr = await ctx.db.get(args.addressId);
    if (!addr || addr.userId !== session.userId) throw new Error("Address not found");

    await ctx.db.delete(args.addressId);
  },
});
