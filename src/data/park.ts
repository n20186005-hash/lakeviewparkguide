// Single source of truth for the SEO entity. Imported by the homepage,
// the subpage layout and every topic page so names, links and the
// canonical domain stay consistent (see SEO report §8 实体一致性).
export const DOMAIN = 'lakeviewparkguide.com';
export const SITE = `https://${DOMAIN}`;

export const park = {
  fullName: 'Lake View Park',
  shortName: 'Lake View Park',
  city: 'Islamabad',
  region: 'Islamabad Capital Territory',
  country: 'Pakistan',
  countryCode: 'PK',
  plusCode: 'P47J+39P',
  street: 'Murree Rd',
  postalCode: '49510',
  lat: 33.71494,
  lng: 73.13281,
  rating: 4.5,
  reviewCount: 14947,
  category: 'Park',
  mapsShareUrl: 'https://maps.app.goo.gl/6Jch5oC2zebDATyq9',
  mapsEmbed: 'https://www.google.com/maps?q=P47J%2B39P%2C%20Murree%20Rd%2C%20Lake%20View%20Park%2C%20Islamabad%2C%20Pakistan&output=embed&hl=ur',
  govtTourismUrl: 'https://tourism.gov.pk/',
  cdaUrl: 'https://www.cda.gov.pk/environmentalProtectionCell',
  cdaDestinationUrl: 'https://cda.gov.pk/destination',
  pmdUrl: 'https://www.pmd.gov.pk/',
  ratingSync: '4 November 2026',
  // General content-review date shown on subpages (not a live-data timestamp).
  contentVerified: '4 November 2026',
};

export const images = {
  hero: '/images/lake-view-park-rawal-lake.jpg',
  lake: '/images/rawal-lake-islamabad.jpg',
  gallery: '/images/rawal-lake-islamabad-view.jpg',
};

export function canonicalFor(path: string): string {
  return new URL(path, SITE).toString();
}
