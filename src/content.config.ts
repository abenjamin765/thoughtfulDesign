import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const quizQuestionSchema = z.object({
  prompt: z.string(),
  options: z.array(z.string()).min(2),
  answer: z.number().int().nonnegative(),
});

const lessons = defineCollection({
  loader: glob({ base: './content/lessons', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    module: z.string(),
    order: z.number().int().positive(),
    estimated_minutes: z.number().int().positive(),
    published: z.boolean().default(true),
    quiz: z.array(quizQuestionSchema).optional(),
    reflection: z
      .object({
        prompt: z.string(),
      })
      .optional(),
  }),
});

export const collections = { lessons };
