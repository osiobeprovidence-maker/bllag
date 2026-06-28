import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByFirebaseUid = query({
  args: { firebaseUid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const upsert = mutation({
  args: {
    firebaseUid: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.string(),
    profileImage: v.optional(v.string()),
    walletBalance: v.optional(v.number()),
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
    const existing = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        role: args.role,
        profileImage: args.profileImage ?? existing.profileImage,
        walletBalance: args.walletBalance ?? existing.walletBalance,
        address: args.address ?? existing.address,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      ...args,
      walletBalance: args.walletBalance ?? 50000,
    });
  },
});

export const updateProfile = mutation({
  args: {
    firebaseUid: v.string(),
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
    const { firebaseUid, ...fields } = args;
    const existing = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, fields);
    }
  },
});

export const updateBalance = mutation({
  args: {
    firebaseUid: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();

    if (existing) {
      const newBalance = (existing.walletBalance ?? 50000) + args.amount;
      await ctx.db.patch(existing._id, { walletBalance: Math.max(0, newBalance) });
    }
  },
});
