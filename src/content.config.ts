import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const quizQuestionSchema = z.object({
  prompt: z.string(),
  options: z.array(z.string()).min(2),
  answer: z.number().int().nonnegative(),
  feedback: z.string().optional(),
});

const lessons = defineCollection({
  loader: glob({ base: './content/lessons', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    module: z.string(),
    order: z.number().int().positive(),
    estimated_minutes: z.number().int().positive(),
    published: z.boolean().default(true),
    // Structural metadata (course.yaml is the source of truth for ordering).
    module_id: z.string().optional(),
    part: z.string().optional(),
    core_claim: z.string().optional(),
    loop_steps: z.array(z.string()).optional(),
    public_preview: z.boolean().default(false),
    scenario: z
      .enum(['school-analytics', 'healthcare', 'marketplace', 'enterprise', 'ai-assistant'])
      .optional(),
    quiz: z.array(quizQuestionSchema).optional(),
    reflection: z
      .object({
        prompt: z.string(),
      })
      .optional(),
  }),
});

// ---------------------------------------------------------------------------
// Assessments — content/assessments/{modules,milestones,final}/*.yaml
// Schema is intentionally permissive: question shapes vary by `type`
// (multiple_choice, multiple_select, true_false, judgment, matching, ordering,
// ranking, short_rationale) and the final assessment groups questions under
// `sections` while module/milestone assessments use a flat `questions` array.
// ---------------------------------------------------------------------------

const assessmentOptionSchema = z.object({
  text: z.string(),
  correct: z.boolean().optional(),
  feedback: z.string().optional(),
  rationale: z.string().optional(),
});

const assessmentPairSchema = z.object({
  left: z.string(),
  right: z.string(),
});

const assessmentQuestionSchema = z.object({
  id: z.string(),
  type: z.enum([
    'multiple_choice',
    'multiple_select',
    'true_false',
    'judgment',
    'matching',
    'ordering',
    'ranking',
    'short_rationale',
  ]),
  difficulty: z.enum(['early', 'mid', 'late']).optional(),
  stem: z.string(),
  no_single_correct: z.boolean().optional(),
  options: z.array(assessmentOptionSchema).optional(),
  pairs: z.array(assessmentPairSchema).optional(),
  items: z.array(z.string()).optional(),
  correct_order: z.array(z.string()).optional(),
  synthesis: z.string().optional(),
  feedback: z.string().optional(),
  guidance: z.string().optional(),
});

const assessmentSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  questions: z.array(assessmentQuestionSchema),
});

const assessments = defineCollection({
  loader: glob({ base: './content/assessments', pattern: '**/*.yaml' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(['module', 'milestone', 'final']),
    covers: z.array(z.string()).default([]),
    module_id: z.string().optional(),
    pass_threshold: z.number(),
    distinction_threshold: z.number().optional(),
    scenario: z.string().optional(),
    scenario_brief: z.string().optional(),
    questions: z.array(assessmentQuestionSchema).optional(),
    sections: z.array(assessmentSectionSchema).optional(),
  }),
});

// ---------------------------------------------------------------------------
// Resources — content/resources/*.md (printable templates)
// ---------------------------------------------------------------------------

const resources = defineCollection({
  loader: glob({ base: './content/resources', pattern: '*.md' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    module_id: z.string(),
    module: z.string(),
    format: z.string(),
    loop_step: z.string().optional(),
    title: z.string().optional(),
  }),
});

// ---------------------------------------------------------------------------
// Blog — content/blog/*.mdx (editorial posts)
// ---------------------------------------------------------------------------

const blog = defineCollection({
  loader: glob({ base: './content/blog', pattern: '*.mdx' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    published: z.boolean().default(false),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    author: z.string().optional(),
  }),
});

export const collections = { lessons, assessments, resources, blog };
