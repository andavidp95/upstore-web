// src/data/countries.js

import countryData from 'country-telephone-data';

/**
 * countryData.allCountries es un array de objetos con al menos:
 *  - name: nombre del país en inglés
 *  - iso2: código ISO2 en minúsculas (p.ej. "us", "ec")
 *  - dialCode: código telefónico sin '+' (p.ej. "1", "593")
 */
export const countries = countryData.allCountries.map(c => ({
  name: c.name,           // p.ej. "United States"
  iso2: c.iso2,           // p.ej. "us"
  dialCode: `+${c.dialCode}` // p.ej. "+1"
}));
