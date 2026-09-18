const fs = require('fs');
const vm = require('vm');
const P = 'C:/Users/DaniM/OneDrive/Desktop/Personal Projects/structure-and-function/index.html';
const html = fs.readFileSync(P, 'utf8');

let fails = 0, checks = 0;
function ok(cond, label, detail) {
  checks++;
  if (!cond) { fails++; console.log('  FAIL  ' + label + (detail ? '  -> ' + detail : '')); }
}
function head(t) { console.log('\n== ' + t + ' =='); }

// ---------- load ----------
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.log('NO SCRIPT BLOCK'); process.exit(1); }
const src = m[1];
try { new vm.Script(src); } catch (e) { console.log('JS PARSE ERROR: ' + e.message); process.exit(1); }
const sandbox = { module: { exports: {} }, console };
sandbox.global = sandbox;
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const A = sandbox.module.exports;
console.log('script loaded, exports: ' + Object.keys(A).length);

// ---------- 1. shape of the content ----------
head('units');
ok(A.UNITS.length === 11, 'eleven units', 'got ' + A.UNITS.length);
const ids = new Set();
A.UNITS.forEach(u => {
  ok(!!u.id && !!u.name && !!u.short && !!u.blurb, 'unit has id, name, short name and blurb: ' + u.id);
  ok(!ids.has(u.id), 'unit id is unique: ' + u.id); ids.add(u.id);
  ok(u.cards.length >= 15, u.id + ' has at least 15 cards', 'got ' + u.cards.length);
  ok(u.qs.length >= 8, u.id + ' has at least 8 questions', 'got ' + u.qs.length);
  const app = u.qs.filter(q => q.o === 2).length;
  ok(app >= 3, u.id + ' has at least 3 application questions', 'got ' + app);
});
console.log('  ' + A.ALL_CARDS.length + ' cards, ' + A.ALL_QS.length + ' questions across ' + A.UNITS.length + ' units');
console.log('  application questions: ' + A.ALL_QS.filter(q => q.o === 2).length + ' of ' + A.ALL_QS.length);

// ---------- 2. cards ----------
head('cards');
const cardIds = new Set();
A.ALL_CARDS.forEach(c => {
  ok(!cardIds.has(c.id), 'card id unique: ' + c.id); cardIds.add(c.id);
  ok(!!c.f && c.f.trim().length > 2, 'card has a front: ' + c.id);
  ok(!!c.b && c.b.trim().length > 8, 'card has a back: ' + c.id);
  ok(!!c.why && c.why.trim().length > 12, 'card explains why it matters: ' + c.id, c.f);
  ok(!/\bTODO\b|\bTBD\b|lorem/i.test(c.f + c.b + c.why), 'no placeholder text: ' + c.id);
});
A.UNITS.forEach(u => {
  const fronts = u.cards.map(c => c.f.toLowerCase());
  ok(new Set(fronts).size === fronts.length, 'no duplicate card fronts in ' + u.id);
});

// ---------- 3. questions ----------
head('questions');
const qIds = new Set();
A.ALL_QS.forEach(q => {
  ok(!qIds.has(q.id), 'question id unique: ' + q.id); qIds.add(q.id);
  ok(q.o === 1 || q.o === 2, 'question tagged recall or application: ' + q.id, 'o=' + q.o);
  ok(!!q.s && q.s.trim().length > 10, 'question has a stem: ' + q.id);
  ok(!!q.e && q.e.trim().length > 15, 'question has a take-home explanation: ' + q.id);
  ok(q.a.length === 4, 'exactly four options: ' + q.id, 'got ' + q.a.length);
  const right = q.a.filter(a => a.ok);
  ok(right.length === 1, 'exactly one correct option: ' + q.id, 'got ' + right.length);
  const texts = q.a.map(a => a.t.toLowerCase().trim());
  ok(new Set(texts).size === 4, 'no repeated option text: ' + q.id, texts.join(' | '));
  q.a.forEach((a, i) => {
    ok(!!a.t && a.t.trim().length > 0, 'option ' + i + ' has text: ' + q.id);
    ok(!!a.w && a.w.trim().length > 8, 'option ' + i + ' explains itself: ' + q.id, a.t);
  });
  if (q.o === 2) ok(q.v !== undefined || /why|predict|explain|what would|which principle|most likely|consequence|expect|best explains|makes this|does this/i.test(q.s),
    'application question actually applies something: ' + q.id, q.s.slice(0, 60));
});

// ---------- 4. exam building ----------
head('exam builder');
for (let run = 0; run < 200; run++) {
  const e = A.buildExam({ unit: 'cell', scope: 'unit', order: 0, n: 10 });
  ok(e.length === 10, 'ten questions requested, ten returned', 'got ' + e.length);
  e.forEach(q => {
    ok(q.unit === 'cell', 'unit scope respected', q.unit);
    ok(q.opts.filter(o => o.ok).length === 1, 'exactly one right answer after shuffling', q.s);
    ok(q.opts.length === 4, 'four options after shuffling');
  });
}
const apOnly = A.buildExam({ unit: 'all', scope: 'all', order: 2, n: 40 });
ok(apOnly.every(q => q.o === 2), 'application-only filter returns only application questions');
ok(apOnly.length === 40, 'application-only pool is deep enough for a 40-question exam', 'got ' + apOnly.length);
const recOnly = A.buildExam({ unit: 'all', scope: 'all', order: 1, n: 40 });
ok(recOnly.every(q => q.o === 1), 'recall-only filter returns only recall questions');
const only = A.buildExam({ unit: 'all', scope: 'all', order: 0, n: 10, only: ['cell-q1', 'bone-q2'] });
ok(only.length === 2 && only.every(q => ['cell-q1', 'bone-q2'].includes(q.id)), 'the "missed questions" filter works', only.map(q => q.id).join(','));
ok(A.buildExam({ unit: 'org', scope: 'unit', order: 0, n: 500 }).length === A.qsFor('org').length, 'asking for more questions than exist returns all of them');
// shuffling actually varies the order
const first = A.buildExam({ unit: 'all', scope: 'all', order: 0, n: 20 }).map(q => q.id).join();
let differs = false;
for (let i = 0; i < 20 && !differs; i++) if (A.buildExam({ unit: 'all', scope: 'all', order: 0, n: 20 }).map(q => q.id).join() !== first) differs = true;
ok(differs, 'exams are reshuffled each time, not the same set');

// ---------- 5. spaced repetition ----------
head('spaced repetition');
const s0 = A.newState();
ok(s0.b === 0 && s0.seen === 0, 'a new card starts in box 0, unseen');
ok(A.isDue(s0, 100), 'a new card is due immediately');
const good1 = A.schedule(s0, 2, 100);
ok(good1.b === 1 && good1.d === 101, '"Good" from box 0 moves to box 1, due tomorrow', JSON.stringify(good1));
const easy = A.schedule(s0, 3, 100);
ok(easy.b === 2 && easy.d === 103, '"Easy" jumps two boxes', JSON.stringify(easy));
const again = A.schedule(easy, 0, 103);
ok(again.b === 0 && again.d === 103 && again.lapse === 1, '"Again" drops to box 0, due the same day, and counts a lapse', JSON.stringify(again));
const hard = A.schedule({ b: 3, d: 0, seen: 5, lapse: 0 }, 1, 200);
ok(hard.b === 3 && hard.d === 207, '"Hard" holds the box and reschedules by that interval', JSON.stringify(hard));
let st = A.newState();
for (let i = 0; i < 10; i++) st = A.schedule(st, 2, 100 + i);
ok(st.b === 5, 'boxes cap at 5', 'got ' + st.b);
ok(A.INTERVAL.length === 6 && A.INTERVAL[0] === 0, 'six boxes, box 0 is same-day');
ok(A.INTERVAL.every((v, i, a) => i === 0 || v > a[i - 1]), 'intervals get longer with every box', A.INTERVAL.join(','));
ok(!A.isDue({ b: 3, d: 500, seen: 2, lapse: 0 }, 400), 'a scheduled card is not due before its date');
ok(A.isDue({ b: 3, d: 400, seen: 2, lapse: 0 }, 400), 'a card is due on its date');
ok(A.isMastered({ b: 4, d: 0, seen: 3, lapse: 0 }) && !A.isMastered({ b: 3, d: 0, seen: 3, lapse: 0 }), 'mastery starts at box 4');
ok(typeof A.todayIndex() === 'number' && A.todayIndex() > 20000, 'day index is sane');
ok(A.todayIndex(new Date(2026, 0, 2)) - A.todayIndex(new Date(2026, 0, 1)) === 1, 'consecutive days differ by exactly one');

// ---------- 6. matching ----------
head('matching');
A.UNITS.forEach(u => {
  const set = A.matchSet(u.id, 8);
  ok(set.length >= 6, u.id + ' can fill a match round', 'got ' + set.length);
  ok(new Set(set.map(x => x.def)).size === set.length, u.id + ': no two definitions read the same');
  ok(new Set(set.map(x => x.id)).size === set.length, u.id + ': pair ids are unique');
  ok(set.every(x => x.def.length <= 150 && x.term.length <= 54), u.id + ': tiles are short enough to read',
    set.map(x => x.def.length).sort((a, b) => b - a)[0] + ' longest');
  ok(set.length === 8 || set.length === A.cardsFor(u.id).length, u.id + ': a full round of 8 where possible', 'got ' + set.length);
});

// ---------- 7. diagrams ----------
head('diagrams');
ok(A.DIAGRAMS.length >= 6, 'at least six diagrams', 'got ' + A.DIAGRAMS.length);
const dgIds = new Set();
A.DIAGRAMS.forEach(d => {
  ok(!dgIds.has(d.id), 'diagram id unique: ' + d.id); dgIds.add(d.id);
  ok(!!A.UNITS.find(u => u.id === d.unit), 'diagram belongs to a real unit: ' + d.id, d.unit);
  ok(d.pins.length >= 6, d.id + ' has at least six labels', 'got ' + d.pins.length);
  ok(new Set(d.pins.map(p => p.n)).size === d.pins.length, d.id + ': pin numbers unique');
  ok(new Set(d.pins.map(p => p.label)).size === d.pins.length, d.id + ': labels unique (needed for the quiz)');
  d.pins.forEach(p => {
    ok(p.x >= 0 && p.x <= d.w, d.id + ' pin ' + p.n + ' sits inside the drawing horizontally', p.x + ' of ' + d.w);
    ok(p.y >= 0 && p.y <= d.h, d.id + ' pin ' + p.n + ' sits inside the drawing vertically', p.y + ' of ' + d.h);
    ok(!!p.label && !!p.note, d.id + ' pin ' + p.n + ' has a label and a note');
  });
  ok(d.art.indexOf('<') === 0, d.id + ': art is svg markup');
  const open = (d.art.match(/<(g|path|rect|circle|ellipse|text)\b/g) || []).length;
  ok(open > 3, d.id + ': art actually draws something', open + ' shapes');
});
A.DIAGRAMS.forEach(d => {
  const q = A.diagramQuiz(d);
  ok(q.length === d.pins.length, d.id + ' quiz covers every label');
  q.forEach(x => {
    ok(x.opts.length === 4, d.id + ' quiz gives four options');
    ok(x.opts.filter(o => o.ok).length === 1, d.id + ' quiz has one right answer');
    ok(x.opts.filter(o => o.ok)[0].t === x.label, d.id + ' quiz marks the right label correct');
    ok(new Set(x.opts.map(o => o.t)).size === 4, d.id + ' quiz options are distinct');
  });
});

// ---------- 7b. plates ----------
head('plates');
const IMG = 'C:/Users/DaniM/OneDrive/Desktop/Personal Projects/structure-and-function/';
ok(A.PLATES.length >= 8, 'at least eight plates', 'got ' + A.PLATES.length);
const plIds = new Set(), plNames = new Set();
A.PLATES.forEach(p => {
  ok(!plIds.has(p.id), 'plate id unique: ' + p.id); plIds.add(p.id);
  ok(!plNames.has(p.name), 'plate name unique (needed for the quiz): ' + p.name); plNames.add(p.name);
  ok(!!A.UNITS.find(u => u.id === p.unit), 'plate belongs to a real unit: ' + p.id, p.unit);
  ok(fs.existsSync(IMG + p.file), 'plate image file exists on disk: ' + p.file);
  if (fs.existsSync(IMG + p.file)) {
    const b = fs.readFileSync(IMG + p.file);
    ok(b.length > 5000 && b.slice(1, 4).toString() === 'PNG', 'plate image is a real PNG: ' + p.file, b.length + ' bytes');
  }
  ok(/public domain/i.test(p.credit), 'plate is credited and public domain: ' + p.id, p.credit);
  ok(p.caption.length > 60, 'plate has a real caption: ' + p.id);
  ok(p.find.length >= 3, 'plate lists things to find: ' + p.id);
  ok(!/\bTODO\b|lorem/i.test(p.caption), 'no placeholder in caption: ' + p.id);
});
['skin','bone','jnt','mus','nrv','sen'].forEach(u => ok(A.platesFor(u).length >= 1, 'unit has a plate: ' + u));
ok(A.platesFor('all').length === A.PLATES.length, '"all" shows every plate');
for (let run = 0; run < 50; run++) {
  const q = A.plateQuiz(A.PLATES);
  ok(q.length === A.PLATES.length, 'plate quiz covers every plate');
  q.forEach(x => {
    ok(x.opts.length === 4 && x.opts.filter(o => o.ok).length === 1, 'plate quiz: four options, one right');
    ok(x.opts.filter(o => o.ok)[0].t === x.name, 'plate quiz: the right option is the plate name');
    ok(new Set(x.opts.map(o => o.t)).size === 4, 'plate quiz: options distinct');
  });
  const one = A.plateQuiz(A.platesFor('skin'));
  ok(one.length === 1 && one[0].opts.length === 4, 'a unit with a single plate still gets four options (distractors from all plates)');
}
ok(/data-v="plates"/.test(src), 'Plates view is reachable from the Diagrams tab');
ok(/name the plate/i.test(src), 'plate recognition quiz exists');

// ---------- 8. markup ----------
head('markup');
ok((html.match(/<script>/g) || []).length === 1, 'a single script block');
['study', 'exam', 'match', 'diagrams', 'progress'].forEach(mo => {
  ok(html.includes('data-mode="' + mo + '"'), 'mode button exists: ' + mo);
  ok(html.includes('data-panel="' + mo + '"'), 'panel exists: ' + mo);
});
const refIds = [...new Set((src.match(/\$\("#([A-Za-z0-9_-]+)"/g) || []).map(s => s.slice(4, -1)))];
const builtIn = ['studyRoot','examRoot','matchRoot','dgRoot','progRoot','unitSel','unitMeta','duePill','dueN','themeBtn','themeIcon'];
builtIn.forEach(id => ok(html.includes('id="' + id + '"'), 'static element exists in the page: ' + id));
ok(refIds.length > 20, 'the script wires up a real interface', refIds.length + ' ids referenced');
['svg','g','div','section','button','header','nav','main','select'].forEach(t => {
  const o = (html.match(new RegExp('<' + t + '[\\s>]', 'g')) || []).length;
  const c = (html.match(new RegExp('</' + t + '>', 'g')) || []).length;
  ok(o === c, t + ' tags balanced', o + ' open vs ' + c + ' close');
});
ok(!/\uFFFD/.test(html), 'no broken characters');
ok(/data-theme="dark"/.test(html), 'dark theme defined');
ok(/prefers-color-scheme/.test(src) || /prefers-color-scheme/.test(html), 'follows the system theme on first visit');
ok(/localStorage/.test(src), 'progress is saved locally');
ok(/try\s*\{[^}]*localStorage/.test(src), 'storage access is guarded against being blocked');
ok(/aria-selected/.test(html) && /aria-label/.test(html), 'tabs and controls are labelled for screen readers');
ok(/prefers-reduced-motion/.test(html), 'respects reduced-motion preference');
console.log('  file size: ' + (fs.statSync(P).size / 1024).toFixed(1) + ' KB');

console.log('\n' + (fails === 0 ? 'ALL ' + checks + ' CHECKS PASSED' : fails + ' FAILURES out of ' + checks + ' checks'));
process.exit(fails ? 1 : 0);
