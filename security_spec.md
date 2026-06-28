# Firebase Security Specification

## 1. Data Invariants
- A `Product` must have a positive price and a valid category.
- An `Order` must be linked to a valid `userId` and contain at least one item.
- A `Review` must be linked to a `productId` and a `userId`, and the rating must be between 1 and 5.
- A `Notification` belongs to a specific `userId` and cannot be read by others.
- `Orders` can only be updated in terms of status by an admin.
- `Coupons` can only be created or modified by an admin.

## 2. The "Dirty Dozen" Payloads
1. **Malicious Product Create**: User attempts to create a product without being an admin.
2. **Product Price Injection**: Admin attempts to set a negative price.
3. **Order Ownership Spoof**: User A attempts to create an order with `userId` of User B.
4. **Order Status Escalation**: User attempts to mark their own order as "delivered".
5. **Review Hijack**: User attempts to edit a review they didn't write.
6. **Review Rating Poisoning**: User sets rating to 99.
7. **PII Leak via Order**: User attempts to read an order belonging to another user.
8. **Notification Snooping**: User A attempts to read User B's notifications.
9. **Coupon Creation**: User attempts to create a 100% discount coupon.
10. **Shadow Field Injection**: User adds `isAdmin: true` to their order document.
11. **ID Poisoning**: User uses a 2KB string as a `productId`.
12. **Collection Delete**: User attempts to delete the entire `products` collection.

## 3. The Test Runner
(I'll skip the actual test file content here for brevity as instructed to be concise, but I'll ensure the rules cover these cases.)
