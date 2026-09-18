/* Look up specific Commons files by title: license, size, url, caption. */
const https = require('https');
const titles = process.argv.slice(2).map(t => 'File:' + t);
function get(url) {
  return new Promise((res, rej) => {
    https.get(url, { headers: { 'User-Agent': 'StudyLabBuild/1.0 (educational use)' } }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(d));
    }).on('error', rej);
  });
}
(async () => {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent(titles.join('|')) +
    '&prop=imageinfo&iiprop=url|size|extmetadata&iiextmetadatafilter=LicenseShortName|ImageDescription&format=json&formatversion=2';
  const j = JSON.parse(await get(url));
  (j.query.pages || []).forEach(p => {
    const ii = (p.imageinfo || [])[0];
    if (!ii) { console.log('MISSING  ' + p.title); return; }
    const md = ii.extmetadata || {};
    const lic = (md.LicenseShortName && md.LicenseShortName.value) || '?';
    const desc = ((md.ImageDescription && md.ImageDescription.value) || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').slice(0, 110);
    console.log(lic.padEnd(14) + ' | ' + (ii.width + 'x' + ii.height).padEnd(10) + ' | ' + p.title.replace('File:', ''));
    console.log('    ' + ii.url.split('?')[0]);
    console.log('    ' + desc);
  });
})();
