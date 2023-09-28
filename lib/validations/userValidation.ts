"use client";

import * as z from "zod";

export const userValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .min(5, {
      message: "Name must have at least 5 characters.",
    })
    .max(30, {
      message: "Maximum 30 characters.",
    }),
  username: z
    .string()
    .min(5, {
      message: "Username must have at least 5 characters.",
    })
    .max(30, {
      message: "Maximum 30 characters.",
    }),
  bio: z
    .string()
    .min(5, {
      message: "Bio must have at least 5 characters.",
    })
    .max(1000, {
      message: "Maximum 1000 characters.",
    }),
});
