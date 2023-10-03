"use client";

import * as z from "zod";

export const commentValidation = z.object({
  comment: z.string().min(3, {
    message: "Thread must have at least 3 characters.",
  }),
});
