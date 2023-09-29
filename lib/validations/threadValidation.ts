"use client";

import * as z from "zod";

export const threadValidation = z.object({
  thread: z
    .string()
    .min(5, {
      message: "Thread must have at least 5 characters.",
    })
    .max(30, {
      message: "Maximum 1000 characters.",
    }),
});
