import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
    status: z
      .enum(['COMPLETED', 'IN_PROGRESS', 'ARCHIVED'])
      .default('COMPLETED'),
    github: z.url().optional(),
    demo: z.url().optional(),
    badgeColor: z.string().default('bg-yellow-300'),
  }),
})

export const collections = { projects }
