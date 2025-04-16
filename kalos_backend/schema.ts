import { z } from "zod";

export const TransactionSchema = z.object({
  customerName: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().min(1),
});