import { defineCollection, z } from 'astro:content';

const equiposCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    imageUrl: z.string(),
    productLink: z.string().url().optional(),
    brand: z.enum(['APC', 'VERTIV', 'EATON', 'VICTRON', 'OTROS']),
    category: z.enum(['MINI_UPS', 'MONOFASICO', 'BIFASICO', 'TRIFASICO']),
    status: z.enum(['STOCK', 'PREVENTA', 'POR_LLEGAR', 'BAJO_PEDIDO', 'AGOTADO']),
    capacity: z.string().optional(),
    voltage: z.string().optional(),
    formFactor: z.enum(['TORRE', 'RACK', 'AMBOS', 'OTRO']).optional(),
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
    brand: z.enum(['APC', 'VERTIV', 'EATON', 'VICTRON', 'OTROS']),
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
    brand: z.enum(['APC', 'VERTIV', 'EATON', 'VICTRON', 'OTROS']).optional(),
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

const marcasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    url: z.string().url().optional(),
    order: z.number().optional(),
    active: z.boolean().default(true),
  }),
});

export const collections = {
  'equipos': equiposCollection,
  'baterias': bateriasCollection,
  'accesorios': accesoriosCollection,
  'servicios': serviciosCollection,
  'marcas': marcasCollection,
};
