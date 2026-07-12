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

const bateriasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    imageUrl: z.string(),
    productLink: z.string().url().optional(),
    category: z.enum(['VRLA', 'AGM', 'BANCO_BATERIAS', 'GABINETE_BATERIA', 'OTROS']),
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
    category: z.enum(['TARJETA_SNMP', 'TARJETA_COMUNICACION', 'PDU', 'BYPASS', 'RACK', 'CABLEADO', 'KIT_MONTAJE', 'REPUESTO', 'OTROS']),
    status: z.enum(['STOCK', 'PREVENTA', 'POR_LLEGAR', 'BAJO_PEDIDO', 'AGOTADO']),
  }),
});

const serviciosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    shortDescription: z.string(),
    imageUrl: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = {
  'equipos': equiposCollection,
  'baterias': bateriasCollection,
  'accesorios': accesoriosCollection,
  'servicios': serviciosCollection,
};
