// data/SEOData.js - Configuración SEO para UPStore

export const SEO_CONFIG = {
  COMPANY: {
    name: 'UPStore',
    legalName: 'UPStore',
    ruc: '',
    country: 'Ecuador',
    description: 'Tienda especializada en sistemas UPS y respaldo energético en Ecuador. UPS monofásicos, trifásicos, mini UPS, baterías y accesorios con envío a todo el país.',
    establishedYear: 2026,
    businessHours: {
      display: 'Lun - Dom: 8:00 AM - 8:00 PM',
      structured: 'Mo-Su 08:00-20:00'
    }
  },

  CONTACT: {
    email: 'ventas@upstore.com.ec',
    whatsapp: {
      number: '+593987799459',
      link: 'https://wa.me/593987799459',
      displayText: '+593 98 779 9459'
    },
    phone: '+593-98-779-9459',
    location: {
      country: 'Ecuador',
      regions: ['Costa', 'Sierra', 'Oriente']
    }
  },

  ASSETS: {
    baseUrl: 'https://upstore.com.ec',
    logo: 'https://upstore.com.ec/images/upstore-logo.svg',
    ogImage: 'https://upstore.com.ec/images/upstore-og-image.jpg',
    twitterCard: 'https://upstore.com.ec/images/upstore-twitter-card.jpg',
    appleTouchIcon: '/apple-touch-icon.png',
    favicon32: '/favicon-32x32.png',
    favicon16: '/favicon-16x16.png',
    manifest: '/site.webmanifest'
  },

  SOCIAL_LINKS: {
    instagram: { url: 'https://instagram.com/upstore_ec', username: '@upstore_ec' },
    facebook: { url: 'https://facebook.com/upstoreec', username: '@upstoreec' }
  },

  PWA: {
    themeColor: '#0f1117',
    backgroundColor: '#ffffff'
  }
};

export const PAGE_CONFIGS = {
  home: {
    title: 'UPStore Ecuador – Venta de UPS, Mini UPS y Respaldo Energético | Envío a Todo el País',
    description: 'Tienda oficial UPStore Ecuador. Venta de sistemas UPS monofásicos, trifásicos, mini UPS para routers, baterías y accesorios de respaldo energético. Distribuidores oficiales APC, Vertiv, Eaton, Victron Energy. Envío gratis a Quito, Guayaquil, Cuenca y todo Ecuador. Pago con Payphone, tarjeta y transferencia.',
    keywords: [
      'ups ecuador comprar',
      'venta ups ecuador',
      'sistemas ups trifásicos ecuador',
      'ups monofásicos ecuador',
      'respaldo energético ecuador',
      'baterias ups ecuador',
      'mini ups ecuador',
      'mini ups router ecuador',
      'ups para centros datos ecuador',
      'ups online ecuador',
      'ups APC ecuador',
      'ups vertiv ecuador',
      'ups eaton ecuador',
      'mantenimiento ups ecuador',
      'tienda ups ecuador',
      'comprar ups guayaquil',
      'comprar ups quito',
      'comprar ups cuenca',
      'ups samborondón',
      'ups la mariscal quito',
      'ups norte quito',
      'ups sur quito',
      'respaldo eléctrico ecuador',
      'protección eléctrica ups',
      'ups empresas ecuador',
      'ups industria ecuador',
      'UPStore',
      'ups precio ecuador 2026',
      'mini ups crisis energética ecuador',
      'ups con envío ecuador',
      'ups garantía ecuador',
      'ups online monofásico',
      'ups trifásico 3000va',
      'ups 1000va ecuador',
      'ups rack ecuador',
      'batería vrla ups',
      'distribuidor ups ecuador'
    ],
    schemas: ['organization', 'localBusiness']
  },
  
  terms: {
    title: 'Términos y Condiciones - UPStore',
    description: 'Términos y condiciones, política de privacidad y protección de datos de UPStore Ecuador.',
    keywords: [
      'términos condiciones upstore ecuador',
      'política privacidad upstore ecuador',
      'protección datos tienda ups',
      'aviso legal upstore',
      'términos uso sitio web ecuador',
      'política confidencialidad datos ecuador'
    ],
    schemas: ['organization', 'legalDocument']
  }
};

export const generateMetadata = (pageConfig = {}) => {
  const config = PAGE_CONFIGS[pageConfig.pageType] || PAGE_CONFIGS.home;
  
  let title = pageConfig.title || config.title;
  if (title && !title.includes('UPStore')) {
    title = `${title} | UPStore Ecuador`;
  }
  
  const description = pageConfig.description || config.description;
  
  const keywords = [
    ...(config.keywords || []),
    ...(pageConfig.keywords || [])
  ].filter(Boolean);
  
  const canonical = pageConfig.canonical || `${SEO_CONFIG.ASSETS.baseUrl}${pageConfig.path || ''}`;
  
  return {
    title,
    description,
    keywords: keywords.join(', '),
    canonical,
    openGraph: {
      title,
      description,
      type: pageConfig.ogType || 'website',
      siteName: SEO_CONFIG.COMPANY.name,
      locale: 'es_EC',
      images: [{
        url: pageConfig.ogImage || SEO_CONFIG.ASSETS.ogImage,
        width: 1200,
        height: 630,
        alt: `${title} - UPStore Ecuador`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [pageConfig.twitterImage || SEO_CONFIG.ASSETS.twitterCard]
    }
  };
};

export const getStructuredData = (type) => {
  const schemas = {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": SEO_CONFIG.COMPANY.name,
      "alternateName": ["UPStore Ecuador"],
      "url": SEO_CONFIG.ASSETS.baseUrl,
      "logo": SEO_CONFIG.ASSETS.logo,
      "foundingDate": SEO_CONFIG.COMPANY.establishedYear.toString(),
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": SEO_CONFIG.CONTACT.phone,
        "contactType": "customer service",
        "availableLanguage": "Spanish",
        "areaServed": "EC",
        "hoursAvailable": SEO_CONFIG.COMPANY.businessHours.structured
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "EC"
      },
      "sameAs": Object.values(SEO_CONFIG.SOCIAL_LINKS).map(social => social.url)
    },

    localBusiness: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": SEO_CONFIG.COMPANY.name,
      "image": SEO_CONFIG.ASSETS.logo,
      "telephone": SEO_CONFIG.CONTACT.phone,
      "email": SEO_CONFIG.CONTACT.email,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "Ecuador"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      "serviceArea": {
        "@type": "Country",
        "name": "Ecuador"
      }
    },

    legalDocument: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Términos y Condiciones - UPStore Ecuador",
      "description": "Términos y condiciones, política de privacidad y protección de datos",
      "publisher": {
        "@type": "Organization",
        "name": SEO_CONFIG.COMPANY.name,
        "url": SEO_CONFIG.ASSETS.baseUrl
      },
      "datePublished": "2026-01-01",
      "dateModified": "2026-01-01",
      "inLanguage": "es-EC",
      "isPartOf": {
        "@type": "WebSite",
        "name": SEO_CONFIG.COMPANY.name,
        "url": SEO_CONFIG.ASSETS.baseUrl
      }
    }
  };

  return schemas[type];
};

export const getStoreProductSchema = (products = []) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Sistemas UPS Ecuador",
  "description": "Catálogo de sistemas UPS y respaldo energético",
  "numberOfItems": products.length,
  "itemListElement": products.map((product, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.imageUrl,
      "brand": {
        "@type": "Brand",
        "name": "UPStore"
      },
      "offers": {
        "@type": "Offer",
        "price": Number(product.price).toFixed(2),
        "priceCurrency": "USD",
        "availability": product.status === 'STOCK' ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
        "seller": {
          "@type": "Organization",
          "name": SEO_CONFIG.COMPANY.name,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "EC",
            "addressRegion": "Guayas",
            "addressLocality": "Guayaquil"
          }
        }
      }
    }
  }))
});

export const getStoreAvailabilitySchema = () => ({
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "UPStore",
  "description": "Tienda especializada en sistemas UPS y respaldo energético",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "EC",
    "addressRegion": "Guayas",
    "addressLocality": "Guayaquil"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Catálogo UPS",
    "itemListElement": [
      {
        "@type": "OfferCatalog",
        "name": "UPS Monofásicos",
        "description": "Sistemas UPS para equipos domésticos y oficinas"
      },
      {
        "@type": "OfferCatalog", 
        "name": "UPS Trifásicos",
        "description": "Sistemas UPS – Sistemas de Alimentación Ininterrumpida (SAI) para centros de datos"
      },
      {
        "@type": "OfferCatalog",
        "name": "Mini UPS",
        "description": "UPS compactos para routers y dispositivos pequeños"
      },
      {
        "@type": "OfferCatalog",
        "name": "Baterías UPS",
        "description": "Baterías de respaldo para sistemas UPS"
      }
    ]
  }
});

export const getUPSCategorySchema = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Catálogo UPS Ecuador por Categorías",
  "description": "Mini UPS para crisis energética y UPS – Sistemas de Alimentación Ininterrumpida (SAI) para empresas",
  "numberOfItems": 2,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "ProductGroup",
        "name": "Mini UPS",
        "description": "Para routers, cámaras y dispositivos pequeños. Ideal crisis energética y conectividad continua",
        "audience": "Hogares, oficinas pequeñas, crisis energética"
      }
    },
    {
      "@type": "ListItem", 
      "position": 2,
      "item": {
        "@type": "ProductGroup",
        "name": "UPS – Sistemas de Alimentación Ininterrumpida (SAI)",
        "description": "Sistemas monofásicos y trifásicos para empresas, centros de datos y equipos críticos",
        "audience": "Empresas, industrias, centros de datos"
      }
    }
  ]
});

export const getFAQSchema = (pageType = 'home') => {
  const faqMap = {
    'home': [
      {
        question: "¿Qué tipos de UPS tienen disponibles?",
        answer: "Ofrecemos UPS monofásicos y trifásicos, desde 500VA hasta 200kVA, ideales para oficinas, centros de datos e industrias"
      },
      {
        question: "¿Incluyen garantía los sistemas UPS?",
        answer: "Sí, todos nuestros sistemas UPS incluyen garantía del fabricante y soporte técnico especializado de nuestro equipo."
      },
      {
        question: "¿Realizan mantenimiento preventivo de UPS?",
        answer: "Ofrecemos planes de mantenimiento preventivo para UPS, incluyendo revisión de baterías, calibración y limpieza de componentes."
      },
      {
        question: "¿Cuánto tiempo de respaldo proporcionan?",
        answer: "El tiempo de respaldo depende de la carga conectada. Desde 15 minutos hasta varias horas según la capacidad del UPS y las baterías."
      },
      {
        question: "¿Qué marcas de UPS ofrecen?",
        answer: "Trabajamos con marcas líderes mundial como APC by Schneider Electric y Vertiv, garantizando calidad y respaldo para tu inversión en sistemas de alimentación ininterrumpida."
      },
      {
        question: "¿Puedo solicitar un presupuesto?",
        answer: "Sí, puedes solicitar un presupuesto contactándonos por WhatsApp o email."
      },
      {
        question: "¿Tienen Mini UPS para routers y dispositivos pequeños?",
        answer: "Sí, ofrecemos Mini UPS diseñados para routers, cámaras y dispositivos pequeños, ideales para mantener tu conexión activa durante cortes de energía."
      },
      {
        question: "¿Para qué sirven los Mini UPS y cómo ayudan en crisis energética?",
        answer: "Los Mini UPS mantienen routers, cámaras y dispositivos pequeños funcionando durante cortes de luz. Son ideales para crisis energética, trabajo remoto y mantener conexión a internet durante apagones."
      },
      {
        question: "¿Cuál es la diferencia entre Mini UPS y UPS – Sistemas de Alimentación Ininterrumpida (SAI)?",
        answer: "Mini UPS: para routers, cámaras, dispositivos pequeños (12V/24V, 1A-5A). UPS: para servidores, centros de datos, equipos críticos empresariales (750VA-200kVA, monofásicos/trifásicos)."
      },
      {
        question: "¿Los UPS – Sistemas de Alimentación Ininterrumpida (SAI) son para empresas únicamente?",
        answer: "Los UPS – Sistemas de Alimentación Ininterrumpida (SAI) están diseñados para empresas, fábricas, centros de datos y cargas críticas que requieren respaldo robusto. Para uso doméstico recomendamos Mini UPS o UPS residenciales."
      },
      {
        question: "¿Cuánto tiempo funcionan los Mini UPS para routers?",
        answer: "Los Mini UPS pueden mantener un router funcionando 2-8 horas según el modelo (1A, 3A, 5A). Perfectos para mantener internet durante apagones y crisis energética."
      }
    ],
    'terms': [
      {
        question: "¿Cómo protegen mis datos personales cuando solicito un presupuesto?",
        answer: "Almacenamos tus datos en servidores seguros con acceso restringido. Solo los utilizamos para responder consultas y evaluar proyectos. No compartimos información con terceros."
      },
      {
        question: "¿Puedo solicitar la eliminación de mis datos enviados?",
        answer: "Sí, tienes derecho al olvido. Puedes solicitar la eliminación de tus datos escribiendo a ventas@upstore.com.ec en cualquier momento."
      },
      {
        question: "¿Los archivos que envío están protegidos legalmente?",
        answer: "Sí, mantenemos confidencialidad de todos los archivos recibidos. Sin embargo, debes garantizar que posees los derechos de uso de los documentos que envías."
      },
      {
        question: "¿El envío de información constituye un contrato?",
        answer: "No, el envío de información solo es una solicitud de presupuesto. Cualquier acuerdo se formalizará mediante contrato independiente por escrito."
      }
    ]
  };

  const faqs = faqMap[pageType] || [];
  
  if (!faqs || faqs.length === 0) {
    return null;
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export const getBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": `${SEO_CONFIG.ASSETS.baseUrl}${crumb.url}`
  }))
});

export const getProductSchema = (productData = {}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": productData.name || "Sistemas UPS",
  "category": productData.category || "Equipos de Protección Eléctrica",
  "brand": {
    "@type": "Brand", 
    "name": productData.brand || "UPStore"
  },
  "description": `${productData.name || 'Sistemas UPS'} de alta calidad para respaldo energético en Ecuador.`,
  ...(productData.price && productData.price > 0 && {
    "offers": {
      "@type": "Offer",
      "price": Number(productData.price).toFixed(2),
      "priceCurrency": "USD", 
      "availability": `https://schema.org/${productData.availability || 'InStock'}`,
      "seller": {
        "@type": "Organization",
        "name": "UPStore",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "EC",
          "addressRegion": "Guayas",
          "addressLocality": "Guayaquil"
        }
      }
    }
  })
});

// Helpers
export const getServiceKeywords = (serviceKey) => {
  const config = PAGE_CONFIGS[serviceKey];
  return config ? config.keywords : [];
};

export const getFaviconForService = (serviceKey) => {
  const config = PAGE_CONFIGS[serviceKey];
  return config?.favicon || '/favicon.svg';
};
