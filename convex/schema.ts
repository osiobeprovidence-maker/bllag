import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    discount: v.optional(v.number()),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    category: v.string(),
    image: v.string(),
    description: v.string(),
    isNew: v.optional(v.boolean()),
    isBestSeller: v.optional(v.boolean()),
  }).index("by_category", ["category"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.string(),
    profileImage: v.optional(v.string()),
    walletBalance: v.number(),
    passwordHash: v.optional(v.string()),
    emailVerified: v.optional(v.boolean()),
    phone: v.optional(v.string()),
    phoneVerified: v.optional(v.boolean()),
    firebaseUid: v.optional(v.string()),
    verificationToken: v.optional(v.string()),
    verificationTokenExpires: v.optional(v.number()),
    address: v.optional(
      v.object({
        street: v.string(),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
        country: v.string(),
      })
    ),
  }).index("by_email", ["email"]),

  authTokens: defineTable({
    tokenHash: v.string(),
    email: v.string(),
    expiresAt: v.number(),
    usedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_token_hash", ["tokenHash"])
    .index("by_email", ["email"]),

  sessions: defineTable({
    sessionId: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
    expiresAt: v.number(),
  }).index("by_session_id", ["sessionId"])
    .index("by_user_id", ["userId"]),

  transactions: defineTable({
    userId: v.id("users"),
    type: v.string(),
    amount: v.number(),
    reference: v.string(),
    status: v.string(),
    description: v.optional(v.string()),
    provider: v.optional(v.string()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_user_id", ["userId"])
    .index("by_reference", ["reference"]),

  orders: defineTable({
    orderNumber: v.string(),
    userId: v.string(),
    customerEmail: v.string(),
    customerName: v.string(),
    items: v.array(
      v.object({
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
      })
    ),
    subtotal: v.number(),
    shipping: v.number(),
    total: v.number(),
    status: v.string(),
    paymentStatus: v.string(),
    trackingNumber: v.optional(v.string()),
    shippingAddress: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_user_id", ["userId"])
    .index("by_status", ["status"]),

  collections: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
  }),

  reviews: defineTable({
    productId: v.id("products"),
    userId: v.string(),
    userName: v.string(),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.string(),
  }).index("by_product_id", ["productId"]),

  notifications: defineTable({
    userId: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.string(),
    read: v.boolean(),
    createdAt: v.string(),
  }).index("by_user_id", ["userId"]),

  addresses: defineTable({
    userId: v.string(),
    fullName: v.string(),
    phone: v.string(),
    country: v.string(),
    state: v.string(),
    city: v.string(),
    street: v.string(),
    postalCode: v.string(),
    default: v.boolean(),
  }).index("by_user_id", ["userId"]),

  memberships: defineTable({
    userId: v.string(),
    tier: v.string(),
    active: v.boolean(),
    joinedAt: v.string(),
    expiresAt: v.optional(v.string()),
    benefits: v.optional(v.array(v.string())),
  }).index("by_user_id", ["userId"]),

  installments: defineTable({
    userId: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    productName: v.string(),
    totalAmount: v.number(),
    paidAmount: v.number(),
    installmentsCount: v.number(),
    paidInstallments: v.number(),
    nextPaymentDate: v.string(),
    status: v.string(),
    createdAt: v.string(),
  }).index("by_user_id", ["userId"])
    .index("by_status", ["status"]),

  wishlist: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    createdAt: v.string(),
  }).index("by_user_id", ["userId"])
    .index("by_product_id", ["productId"]),
});
