import { z } from "zod";
import { priorities, type ContactInput } from "@/lib/types";

export const contactInputSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(1, "Name is required."),
  company: z.string().trim().default(""),
  role: z.string().trim().default(""),
  where_met: z.string().trim().default(""),
  notes: z.string().trim().default(""),
  priority: z.enum(priorities, {
    errorMap: () => ({ message: "Priority must be high, medium, or low." }),
  }),
});

export type ValidationResult =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: string[] };

export function parseContactInput(input: unknown): ValidationResult {
  const result = contactInputSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      errors: result.error.issues.map((issue) => issue.message),
    };
  }

  return {
    ok: true,
    data: result.data,
  };
}
