/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as addresses from "../addresses.js";
import type * as auth from "../auth.js";
import type * as categoryImages from "../categoryImages.js";
import type * as collections from "../collections.js";
import type * as emails from "../emails.js";
import type * as homepageBanners from "../homepageBanners.js";
import type * as homepageSections from "../homepageSections.js";
import type * as installments from "../installments.js";
import type * as mediaLibrary from "../mediaLibrary.js";
import type * as memberships from "../memberships.js";
import type * as notifications from "../notifications.js";
import type * as orders from "../orders.js";
import type * as payments from "../payments.js";
import type * as products from "../products.js";
import type * as promotionalBanners from "../promotionalBanners.js";
import type * as reviews from "../reviews.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";
import type * as websiteSettings from "../websiteSettings.js";
import type * as wishlist from "../wishlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  addresses: typeof addresses;
  auth: typeof auth;
  categoryImages: typeof categoryImages;
  collections: typeof collections;
  emails: typeof emails;
  homepageBanners: typeof homepageBanners;
  homepageSections: typeof homepageSections;
  installments: typeof installments;
  mediaLibrary: typeof mediaLibrary;
  memberships: typeof memberships;
  notifications: typeof notifications;
  orders: typeof orders;
  payments: typeof payments;
  products: typeof products;
  promotionalBanners: typeof promotionalBanners;
  reviews: typeof reviews;
  seed: typeof seed;
  users: typeof users;
  websiteSettings: typeof websiteSettings;
  wishlist: typeof wishlist;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
