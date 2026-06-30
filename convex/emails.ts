import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const sendVerificationEmail = action({
  args: {
    email: v.string(),
    name: v.string(),
    token: v.string(),
  },
  handler: async (_, args) => {
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set — skipping verification email");
      return { sent: false };
    }

    const verifyUrl = `https://www.bllag.xyz/verify-email?token=${args.token}&email=${encodeURIComponent(args.email)}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "bllag <noreply@bllag.xyz>",
        to: args.email,
        subject: "Verify your email — bllag",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-1px">Welcome to bllag, ${args.name}.</h1>
            <p style="color:#666">Click the button below to verify your email address and activate your account.</p>
            <a href="${verifyUrl}" style="display:inline-block;background:#000;color:#fff;padding:14px 40px;text-decoration:none;text-transform:uppercase;font-size:13px;letter-spacing:2px;margin:24px 0">Verify Email</a>
            <p style="color:#999;font-size:12px">This link expires in 24 hours.</p>
            <p style="color:#999;font-size:12px;margin-top:32px">bllag — Luxury Jewelry & High-End Collections</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error:", body);
      return { sent: false };
    }

    return { sent: true };
  },
});

export const sendWelcomeEmail = action({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (_, args) => {
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set — skipping welcome email");
      return { sent: false };
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "bllag <noreply@bllag.xyz>",
        to: args.email,
        subject: "Welcome to bllag",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-1px">Welcome to bllag, ${args.name}.</h1>
            <p style="color:#666">You're now part of the bllag universe — where every piece tells a story.</p>
            <p style="color:#666">Browse our latest collections and discover jewelry crafted with precision and elegance.</p>
            <a href="https://www.bllag.xyz/shop" style="display:inline-block;background:#000;color:#fff;padding:12px 32px;text-decoration:none;text-transform:uppercase;font-size:12px;letter-spacing:2px;margin-top:16px">Explore the Collection</a>
            <p style="color:#999;font-size:12px;margin-top:32px">bllag — Luxury Jewelry & High-End Collections</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error:", body);
      return { sent: false };
    }

    return { sent: true };
  },
});

export const sendOrderConfirmation = action({
  args: {
    email: v.string(),
    customerName: v.string(),
    orderId: v.string(),
    total: v.number(),
    items: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        price: v.number(),
      })
    ),
  },
  handler: async (_, args) => {
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set — skipping email");
      return { sent: false };
    }

    const itemsHtml = args.items
      .map(
        (i) =>
          `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₦${i.price.toLocaleString()}</td></tr>`
      )
      .join("");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "bllag <orders@bllag.xyz>",
        to: args.email,
        subject: `Order Confirmed — #${args.orderId}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-1px">Thank you, ${args.customerName}.</h1>
            <p style="color:#666">Your order <strong>#${args.orderId}</strong> has been received and is being processed.</p>
            <table style="width:100%;border-collapse:collapse;margin:24px 0">
              <thead><tr style="background:#f5f5f5"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px">Qty</th><th style="padding:8px;text-align:right">Price</th></tr></thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <p style="text-align:right;font-size:18px;font-weight:bold">Total: ₦${args.total.toLocaleString()}</p>
            <p style="color:#999;font-size:12px;margin-top:32px">BLAG — Luxury Jewelry & High-End Collections</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error:", body);
      return { sent: false };
    }

    return { sent: true };
  },
});
