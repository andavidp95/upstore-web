import { defineCollection, z } from 'astro:content';

const equiposCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    imageUrl: z.string(),
    productLink: z.string().url().optional(),
    category: z.enum(['MINI_UPS', 'MONOFASICO', 'BIFASICO', 'TRIFASICO']),
    status: z.enum(['STOCK', 'PREVENTA', 'POR_LLEGAR', 'BAJO_PEDIDO', 'AGOTADO']),
  }),
});

const accesoriosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    imageUrl: z.string(),
    productLink: z.string().url().optional(),
    category: z.enum(['BATERIA', 'TARJETA_SNMP', 'RACK', 'CABLEADO', 'OTROS']),
    status: z.enum(['STOCK', 'PREVENTA', 'POR_LLEGAR', 'BAJO_PEDIDO', 'AGOTADO']),
  }),
});

const serviciosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    shortDescription: z.string(),
    imageUrl: z.string(),
  }),
});

export const collections = {
  'equipos': equiposCollection,
  'accesorios': accesoriosCollection,
  'servicios': serviciosCollection,
};
