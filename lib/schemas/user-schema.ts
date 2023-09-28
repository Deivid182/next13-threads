import { z } from "zod";

export const UserSchema = z.object({
  image: z.string().url().nonempty(),
  name: z.string().min(1).max(20).nonempty(),
  username: z.string().min(1).max(20).nonempty(),
  bio: z.string().min(1).max(1000),
})

export type UserValues = z.infer<typeof UserSchema>