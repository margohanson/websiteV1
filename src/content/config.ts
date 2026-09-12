import { defineCollection, z } from 'astro:content';

const eventsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    endDate: z.date().optional(),
    time: z.string().optional(),
    location: z.string(),
    image: z.string().startsWith('/uploads/events/'),
    summary: z.string(),
    tags: z.array(z.string()).optional(),
    registrationLink: z.string().url().optional(),
    registrationRequired: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});


// English blog
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string().default("Ariane Mader"),
    image: z.object({
      url: z.string().startsWith('/uploads/blog/'),
      alt: z.string(),
    }).optional(),
    tags: z.array(z.string()).default(["general"]),
    draft: z.boolean().default(false),
  }),
});

// German blog
const blogDeCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string().default("Ariane Mader"),
    image: z.object({
      url: z.string().startsWith('/uploads/blog/'),
      alt: z.string(),
    }).optional(),
    tags: z.array(z.string()).default(["Allgemein"]),
    draft: z.boolean().default(false),
  }),
});

const siteInfoCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = {
  events: eventsCollection,
  blog: blogCollection,
  'blog-de': blogDeCollection,
  siteInfo: siteInfoCollection,
};