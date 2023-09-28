import { z } from 'zod'

export const threadSchema = z.object({
  thread: z.string().min(3, {
    message: 'Thread must be at least 3 characters long'
  }),
  accountId: z.string(),
})

export type ThreadValues = z.infer<typeof threadSchema>

export const commentSchema = z.object({
  comment: z.string().min(3, {
    message: 'Comment must be at least 3 characters long'
  })
})

export type CommentValues = z.infer<typeof commentSchema>