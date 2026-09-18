/* Search Wikimedia Commons for public-domain anatomy plates.
   Prints: license, size, title, url, short description. */
const https = require('https');

const QUERIES = process.argv.length > 2 ? process.argv.slice(2) : [
  'Gray anatomy skin section epidermis dermis',
  'Gray anatomy compact bone osteon transverse section',
  'Gray anatomy horizontal section eye',
  'Gray anatomy cochlea inner ear'
];

function get(url) {
  return new Promise((res, rej) => {
    https.get(url, { headers: { 'User-Agent': 'StudyLabBuild/1.0 (educational use)' } }, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(d));
    }).on('error', rej);
  });
}

(async () => {
  for (const q of QUERIES) {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search' +
      '&gsrsearch=' + encodeURIComponent('filetype:bitmap ' + q) +
      '&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|extmetadata' +
      '&iiextmetadatafilter=LicenseShortName|ImageDescription&format=json&formatversion=2';
    let j;
    try { j = JSON.parse(await get(url)); } catch (e) { console.log('ERR ' + q); continue; }
    console.log('\n### ' + q);
    const pages = (j.query && j.query.pages) || [];
    pages.forEach(p => {
      const ii = (p.imageinfo || [])[0];
      if (!ii) return;
      const md = ii.extmetadata || {};
      const lic = (md.LicenseShortName && md.LicenseShortName.value) || '?';
      const desc = ((md.ImageDescription && md.ImageDescription.value) || '')
        .replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').slice(0, 95);
      console.log([lic.padEnd(14), (ii.width + 'x' + ii.height).padEnd(11), p.title.replace('File:', '').slice(0, 44)].join(' | '));
      console.log('    ' + ii.url);
      if (desc) console.log('    ' + desc);
    });
  }
})();
