import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

/**
 * Reads products from Firestore and seeds them into Convex.
 * Call this after deploying to sync your Firebase data.
 *
 * Usage: npx convex run firebaseSync:syncFromFirestore
 */
export const syncFromFirestore = action({
  args: {
    productsJson: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const results: { productsImported: number; errors: string[] } = {
      productsImported: 0,
      errors: [],
    };

    if (args.productsJson) {
      const products = JSON.parse(args.productsJson) as Array<{
        name: string;
        price: number;
        originalPrice?: number;
        discount?: number;
        rating?: number;
        reviews?: number;
        category: string;
        image: string;
        description: string;
        isNew?: boolean;
        isBestSeller?: boolean;
      }>;

      for (const product of products) {
        try {
          await ctx.runMutation(api.products.create, product);
          results.productsImported++;
        } catch (e) {
          results.errors.push(`Failed to import "${product.name}": ${e}`);
        }
      }
    }

    return results;
  },
});

/**
 * Sync a single Firebase user to Convex.
 * Gets called from the frontend after Firebase auth.
 */
export const syncFirebaseUser = action({
  args: {
    firebaseUid: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.string(),
    walletBalance: v.optional(v.number()),
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
    return await ctx.runMutation(api.users.upsert, args);
  },
});

/**
 * Sync all Firestore collections to Convex by providing JSON strings.
 * Usage: npx convex run firebaseSync:syncAll --args='{"productsJson": "[...]", "usersJson": "[...]", "ordersJson": "[...]"}'
 */
export const syncAll = action({
  args: {
    productsJson: v.optional(v.string()),
    usersJson: v.optional(v.string()),
    ordersJson: v.optional(v.string()),
    collectionsJson: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const results: {
      productsImported: number;
      usersImported: number;
      ordersImported: number;
      collectionsImported: number;
      errors: string[];
    } = {
      productsImported: 0,
      usersImported: 0,
      ordersImported: 0,
      collectionsImported: 0,
      errors: [],
    };

    if (args.productsJson) {
      const products = JSON.parse(args.productsJson);
      for (const p of products) {
        try {
          await ctx.runMutation(api.products.create, {
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice,
            discount: p.discount,
            rating: p.rating,
            reviews: p.reviews,
            category: p.category,
            image: p.image,
            description: p.description,
            isNew: p.isNew,
            isBestSeller: p.isBestSeller,
          });
          results.productsImported++;
        } catch (e) {
          results.errors.push(`Product "${p.name}": ${e}`);
        }
      }
    }

    if (args.usersJson) {
      const users = JSON.parse(args.usersJson);
      for (const u of users) {
        try {
          await ctx.runMutation(api.users.upsert, {
            firebaseUid: u.firebaseUid || u.uid || u.id,
            name: u.name || u.displayName || "User",
            email: u.email || "",
            role: u.role || "customer",
            walletBalance: u.walletBalance ?? 50000,
            profileImage: u.profileImage || u.photoURL,
            address: u.address,
          });
          results.usersImported++;
        } catch (e) {
          results.errors.push(`User "${u.email}": ${e}`);
        }
      }
    }

    if (args.ordersJson) {
      const orders = JSON.parse(args.ordersJson);
      for (const o of orders) {
        try {
          await ctx.runMutation(api.orders.create, {
            userId: o.userId,
            customerEmail: o.customerEmail,
            customerName: o.customerName,
            items: o.items || [],
            total: o.total,
            status: o.status || "pending",
            paymentStatus: o.paymentStatus || "unpaid",
            trackingNumber: o.trackingNumber,
            shippingAddress: o.shippingAddress || {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "Nigeria",
            },
          });
          results.ordersImported++;
        } catch (e) {
          results.errors.push(`Order "${o.id}": ${e}`);
        }
      }
    }

    if (args.collectionsJson) {
      const collections = JSON.parse(args.collectionsJson);
      for (const c of collections) {
        try {
          await ctx.runMutation(api.collections.create, {
            name: c.name,
            description: c.description,
            image: c.image,
          });
          results.collectionsImported++;
        } catch (e) {
          results.errors.push(`Collection "${c.name}": ${e}`);
        }
      }
    }

    return results;
  },
});
