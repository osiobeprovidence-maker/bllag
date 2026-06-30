import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .first();
  },
});

export const updateProfile = mutation({
  args: {
    sessionId: v.string(),
    name: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    address: v.optional(
      v.object({
        street: v.string(),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
        country: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    const existing = await ctx.db.get(session.userId);
    if (!existing) throw new Error("User not found");

    const patch: Record<string, unknown> = {};
    if (args.name) patch.name = args.name;
    if (args.profileImage) patch.profileImage = args.profileImage;
    if (args.address) patch.address = args.address;

    await ctx.db.patch(existing._id, patch);
  },
});

export const updateBalance = mutation({
  args: {
    sessionId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!session || session.expiresAt < Date.now()) throw new Error("Not authenticated");

    const existing = await ctx.db.get(session.userId);
    if (!existing) throw new Error("User not found");

    const newBalance = (existing.walletBalance ?? 0) + args.amount;
    await ctx.db.patch(existing._id, { walletBalance: Math.max(0, newBalance) });
  },
});

export const resetAllWallets = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.patch(user._id, { walletBalance: 0 });
    }
    return { reset: users.length };
  },
});
