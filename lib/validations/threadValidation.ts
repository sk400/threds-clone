"use client";

import * as z from "zod";

export const threadValidation = z.object({
  thread: z.string().min(3, {
    message: "Thread must have at least 3 characters.",
  }),
});
