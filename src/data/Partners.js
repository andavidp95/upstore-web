// ====================================
// PARTNERS DATA MODULE - UPStore
// ====================================

// ====================================
// CONFIGURACIÓN DE RUTAS
// ====================================
const PARTNERS_PATHS = {
  IMAGES: '/images',
  PARTNERS: '/images/partners'
};

// ====================================
// CATEGORÍAS DE PARTNERS
// ====================================
export const PARTNERS_CATEGORIES = {
  UPS_BACKUP: {
    name: 'UPS y Respaldo',
    description: 'Sistemas de energía ininterrumpida',
    brands: ['APC by Schneider Electric', 'Vertiv', 'Eaton', 'Victron Energy']
  }
};

// ====================================
// MAPEO DE PARTNERS A LOGOS
// ====================================
export const PARTNER_LOGOS = {
  'APC by Schneider Electric': 'apc.svg',
  'Vertiv': 'vertiv.svg',
  'Eaton': 'eaton.svg',
  'Victron Energy': 'victron-energy.png'
};

// ====================================
// MAPEO DE PARTNERS A SITIOS WEB
// ====================================
export const PARTNER_URLS = {
  'APC by Schneider Electric': 'https://www.apc.com',
  'Vertiv': 'https://www.vertiv.com',
  'Eaton': 'https://www.eaton.com',
  'Victron Energy': 'https://www.victronenergy.com'
};

// ====================================
// CONFIGURACIÓN DE PARTNERS
// ====================================
export const DIVISION_PARTNERS = {
  upstore: {
    title: 'Marcas Líderes en Respaldo Energético',
    subtitle: 'Trabajamos exclusivamente con marcas líderes en tecnología de protección eléctrica',
    categories: [
      {
        name: 'UPS y Respaldo',
        brands: PARTNERS_CATEGORIES.UPS_BACKUP.brands
      }
    ]
  }
};

// ====================================
// FUNCIONES HELPER PARA PARTNERS
// ====================================

export function getPartnerLogoPath(partnerName) {
  const logoFile = PARTNER_LOGOS[partnerName];
  if (logoFile) {
    return `${PARTNERS_PATHS.PARTNERS}/${logoFile}`;
  }
  const fallbackName = partnerName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `${PARTNERS_PATHS.PARTNERS}/${fallbackName}.svg`;
}

export function hasPartnerLogo(partnerName) {
  return PARTNER_LOGOS.hasOwnProperty(partnerName);
}

export function isLogoSVG(partnerName) {
  const logoFile = PARTNER_LOGOS[partnerName];
  return logoFile && logoFile.endsWith('.svg');
}

export function getPartnersByDivision(division) {
  const divisionKey = division.toUpperCase();
  const divisionCategories = PARTNERS_CATEGORIES[divisionKey];
  
  if (!divisionCategories) {
    console.warn(`División no encontrada: ${division}`);
    return [];
  }

  const allPartners = [];
  Object.values(divisionCategories).forEach(category => {
    allPartners.push(...category.brands);
  });

  return [...new Set(allPartners)];
}

export function getPartnersByCategory(division, categoryKey) {
  const divisionKey = division.toUpperCase();
  const divisionCategories = PARTNERS_CATEGORIES[divisionKey];
  
  if (!divisionCategories || !divisionCategories[categoryKey]) {
    console.warn(`Categoría no encontrada: ${division}.${categoryKey}`);
    return [];
  }

  return divisionCategories[categoryKey].brands;
}

export function getCategoryInfo(division, categoryKey) {
  const divisionKey = division.toUpperCase();
  const divisionCategories = PARTNERS_CATEGORIES[divisionKey];
  
  if (!divisionCategories || !divisionCategories[categoryKey]) {
    return null;
  }

  return divisionCategories[categoryKey];
}

export function getDivisionPartnersConfig(division) {
  return DIVISION_PARTNERS[division] || null;
}

export function searchPartners(searchTerm, division = null) {
  const term = searchTerm.toLowerCase();
  const allPartners = [];

  const divisionsToSearch = division ? [division] : Object.keys(DIVISION_PARTNERS);

  divisionsToSearch.forEach(div => {
    const partners = getPartnersByDivision(div);
    partners.forEach(partner => {
      if (partner.toLowerCase().includes(term)) {
        allPartners.push({
          name: partner,
          division: div,
          logoPath: getPartnerLogoPath(partner)
        });
      }
    });
  });

  return allPartners;
}

export function getPartnersWithLogos(division = null) {
  const result = {};
  const divisionsToProcess = division ? [division] : Object.keys(DIVISION_PARTNERS);

  divisionsToProcess.forEach(div => {
    const config = getDivisionPartnersConfig(div);
    if (config) {
      result[div] = {
        ...config,
        categories: config.categories.map(category => ({
          ...category,
          brands: category.brands.map(brand => ({
            name: brand,
            logoPath: getPartnerLogoPath(brand),
            website: PARTNER_URLS[brand] || null,
            hasLogo: hasPartnerLogo(brand),
            isSVG: isLogoSVG(brand)
          }))
        }))
      };
    }
  });

  return result;
}

export function isValidDivision(division) {
  return DIVISION_PARTNERS.hasOwnProperty(division);
}

export function getPartnersStats() {
  const stats = {
    totalPartners: 0,
    byDivision: {},
    totalCategories: 0,
    logoStats: {
      svg: 0,
      png: 0,
      jpg: 0,
      webp: 0
    }
  };

  Object.keys(DIVISION_PARTNERS).forEach(division => {
    const partners = getPartnersByDivision(division);
    stats.byDivision[division] = partners.length;
    stats.totalPartners += partners.length;
    
    partners.forEach(partner => {
      const logoFile = PARTNER_LOGOS[partner];
      if (logoFile) {
        const extension = logoFile.split('.').pop().toLowerCase();
        if (stats.logoStats[extension] !== undefined) {
          stats.logoStats[extension]++;
        }
      }
    });
  });

  Object.values(PARTNERS_CATEGORIES).forEach(divisionCategories => {
    stats.totalCategories += Object.keys(divisionCategories).length;
  });

  return stats;
}

// ====================================
// EXPORTS LEGACY (Para compatibilidad)
// ====================================

export const PARTNERS_DATA = {
  UPS_BACKUP: PARTNERS_CATEGORIES.UPS_BACKUP.brands
};

export const PARTNER_LOGO_MAP = PARTNER_LOGOS;
