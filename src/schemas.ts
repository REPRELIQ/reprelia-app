import { z, type ZodType } from 'zod';

export const echoBodySchema = z.object({
  message: z.string({ error: 'message is required and must be a string' }),
});

export const putItemBodySchema = z.object({
  name: z
    .string({ error: 'name is required and must be a non-empty string' })
    .refine((value) => value.trim() !== '', {
      message: 'name is required and must be a non-empty string',
    }),
  description: z.string({ error: 'description must be a string' }).optional(),
});

export const patchItemBodySchema = z
  .object({
    name: z
      .string({ error: 'name must be a non-empty string' })
      .refine((value) => value.trim() !== '', { message: 'name must be a non-empty string' })
      .optional(),
    description: z.string({ error: 'description must be a string' }).optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: 'at least one of name or description must be provided',
  });

export type ParsedBody<T> = { success: true; data: T } | { success: false; error: string };

export function parseBody<T>(schema: ZodType<T>, body: unknown): ParsedBody<T> {
  const result = schema.safeParse(body);

  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'invalid request body' };
  }

  return { success: true, data: result.data };
}
