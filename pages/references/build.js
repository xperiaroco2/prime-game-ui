// Builds refs-page.html from the template and curated.json; an item gets img when img/<id>.<ext> exists.
const fs = require('fs');
const cur = JSON.parse(fs.readFileSync('curated.json', 'utf8'));
const imgs = fs.existsSync('img') ? fs.readdirSync('img') : [];
const data = cur.map((c) => {
  const f = imgs.find((n) => n.startsWith(c.id + '.'));
  return { id: c.id, game: c.game, screen: c.screen, v: c.v, title: c.title, note: c.note, url: c.url, page: c.page, img: f ? 'img/' + f : null };
});
const t = fs.readFileSync('page-template.html', 'utf8');
fs.writeFileSync('refs-page.html', t.replace('/*DATA*/[]', JSON.stringify(data)));
const js = t.slice(t.indexOf('<script>') + 8, t.lastIndexOf('</script>')).replace('/*DATA*/[]', JSON.stringify(data));
new Function(js);
console.log('built', data.length, 'cards,', data.filter((d) => d.img).length, 'with images; script parses');
