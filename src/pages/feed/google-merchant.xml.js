// src/pages/feed/google-merchant.xml.js
import { getCollection } from 'astro:content';

export const prerender = true;

const escapeXML = (str) => {
  if (!str) return '';
  return str.toString().replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

export async function GET(context) {
  const products = await getCollection('equipos');
  const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://upstore.com.ec';

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n`;
  xml += `  <channel>\n`;
  xml += `    <title>UPStore Ecuador</title>\n`;
  xml += `    <link>${SITE_URL}</link>\n`;
  xml += `    <description>Sistemas de respaldo de energía y UPS en Ecuador.</description>\n`;

  products.forEach(product => {
    const { name, description, price, imageUrl, status, category } = product.data;
    
    const slug = product.slug; 

    let availability = 'out_of_stock';
    if (status === 'STOCK') availability = 'in_stock';
    if (status === 'PREVENTA' || status === 'POR_LLEGAR') availability = 'preorder';
    if (status === 'BAJO_PEDIDO') availability = 'backorder';

    let brand = 'UPStore';
    if (name.includes('APC')) brand = 'APC';
    else if (name.includes('Vertiv') || name.includes('Liebert')) brand = 'Vertiv';
    else if (name.includes('HKIVI')) brand = 'HKIVI';
    else if (name.includes('SHANQIU')) brand = 'SHANQIU';

    const productLink = `${SITE_URL}/producto/${slug}`;
    
    const absoluteImageUrl = new URL(imageUrl, SITE_URL).toString();

    const cleanDescription = description.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    xml += `    <item>\n`;
    xml += `      <g:id>${slug}</g:id>\n`;
    xml += `      <g:title>${escapeXML(name)}</g:title>\n`;
    xml += `      <g:description>${escapeXML(cleanDescription)}</g:description>\n`;
    xml += `      <g:link>${productLink}</g:link>\n`; 
    xml += `      <g:image_link>${escapeXML(absoluteImageUrl)}</g:image_link>\n`;
    xml += `      <g:condition>new</g:condition>\n`;
    xml += `      <g:availability>${availability}</g:availability>\n`;
    xml += `      <g:price>${Number(price).toFixed(2)} USD</g:price>\n`;
    xml += `      <g:brand>${brand}</g:brand>\n`;
    xml += `      <g:product_type>${escapeXML(category.replace('_', ' '))}</g:product_type>\n`;
    xml += `    </item>\n`;
  });

  xml += `  </channel>\n`;
  xml += `</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
