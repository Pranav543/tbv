import { z } from "zod";

export const formSchemaTransaction = z.object({
  receiver: z.string().min(1, { message: "Receiver address is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
  token: z.string().min(1, { message: "Token address is required" }).optional(),
});
export const formSchemaLoadToken = z.object({
  token: z.string().min(1, { message: "Token address is required" }),
});
