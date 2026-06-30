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
      emailVerified: false,
    });
  },
});

export const setVerificationToken = mutation({
  args: {
    firebaseUid: v.string(),
    token: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        verificationToken: args.token,
        verificationTokenExpires: args.expiresAt,
      });
    }
  },
});

export const verifyEmail = mutation({
  args: {
    token: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (!user) throw new Error("User not found");
    if (user.emailVerified) return { verified: true };
    if (!user.verificationToken || user.verificationToken !== args.token) {
      throw new Error("Invalid verification token");
    }
    if (user.verificationTokenExpires && user.verificationTokenExpires < Date.now()) {
      throw new Error("Verification token has expired. Request a new one.");
    }
    await ctx.db.patch(user._id, {
      emailVerified: true,
      verificationToken: undefined,
      verificationTokenExpires: undefined,
    });
    return { verified: true };
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
