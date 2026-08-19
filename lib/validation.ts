import { z } from "zod";

export const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20),
  city: z.string().trim().min(2).max(60),
  address: z.string().trim().min(5).max(250),
  notes: z.string().trim().max(500).optional().default(""),
  items: z.array(z.object({
    productId: z.string().min(1),
    size: z.string().min(1).max(20),
    color: z.string().max(50).optional(),
    qty: z.number().int().min(1).max(10),
  })).min(1).max(20),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20),
  message: z.string().trim().min(5).max(1000),
  company: z.string().max(0).optional(), // honeypot
});
