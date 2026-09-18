(function(){
"use strict";
var G = (typeof window !== "undefined") ? window : global;
var UNITS = G.__UNITS, DIAGRAMS = G.__DIAGRAMS;

/* ================================================================ helpers */
function $(s,r){ return (r||document).querySelector(s); }
function $$(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)), t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function pick(a,n){ return shuffle(a).slice(0,n); }
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function pct(n,d){ return d ? Math.round(n/d*100) : 0; }
function unitById(id){ for(var i=0;i<UNITS.length;i++){ if(UNITS[i].id===id) return UNITS[i]; } return null; }

/* every card and question, tagged with the unit it came from */
var ALL_CARDS = [], ALL_QS = [];
UNITS.forEach(function(u){
  u.cards.forEach(function(c){ ALL_CARDS.push({id:c.id, unit:u.id, unitName:u.short, f:c.f, b:c.b, why:c.why||""}); });
  u.qs.forEach(function(q){ ALL_QS.push({id:q.id, unit:u.id, unitName:u.short, o:q.o, v:q.v||"", s:q.s, a:q.a, e:q.e}); });
});
/* Structure sets (regions, bones, muscles...). Sets marked drill:true also
   become flashcards and identification questions. Identification questions
   keep every other pair as a candidate wrong answer; three are drawn when the
   exam is built, so the same question reads differently each time.         */
var MATCHSETS = G.__MATCHSETS || [], GEN_QS = [];
MATCHSETS.forEach(function(s){
  var u = unitById(s.unit); if(!u || !s.drill) return;
  s.pairs.forEach(function(p, i){
    ALL_CARDS.push({id:s.id+"-c"+(i+1), unit:u.id, unitName:u.short, f:p[0], b:p[1], why:s.why || "", gen:true});
    var otherF = s.pairs.filter(function(o){ return o[1] !== p[1]; }).map(function(o){ return {t:o[1], ok:false, w:"That is the "+s.left.toLowerCase()+" <b>"+o[0]+"</b>."}; });
    var otherR = s.pairs.filter(function(o){ return o[0] !== p[0]; }).map(function(o){ return {t:o[0], ok:false, w:o[0]+": "+o[1]+"."}; });
    GEN_QS.push({id:s.id+"-qf"+(i+1), unit:u.id, unitName:u.short, o:1, gen:true, v:"", e:s.why || "",
      s:"<b>"+esc(p[0])+"</b> — which "+s.right.toLowerCase()+" is correct?",
      a:[{t:p[1], ok:true, w:p[0]+": "+p[1]+"."}].concat(otherF)});
    GEN_QS.push({id:s.id+"-qr"+(i+1), unit:u.id, unitName:u.short, o:1, gen:true, v:"", e:s.why || "",
      s:"Which "+s.left.toLowerCase()+" matches: <b>"+esc(p[1])+"</b>?",
      a:[{t:p[0], ok:true, w:p[0]+": "+p[1]+"."}].concat(otherR)});
  });
});
function cardsFor(sel){ return sel==="all" ? ALL_CARDS : ALL_CARDS.filter(function(c){ return c.unit===sel; }); }
function qsFor(sel){ return sel==="all" ? ALL_QS : ALL_QS.filter(function(q){ return q.unit===sel; }); }
function genFor(sel){ return sel==="all" ? GEN_QS : GEN_QS.filter(function(q){ return q.unit===sel; }); }
function matchSetsFor(sel){ return sel==="all" ? MATCHSETS : MATCHSETS.filter(function(s){ return s.unit===sel; }); }
function setById(id){ for(var i=0;i<MATCHSETS.length;i++){ if(MATCHSETS[i].id===id) return MATCHSETS[i]; } return null; }
function matchFromSet(id, n){
  var s = setById(id); if(!s) return [];
  var seen = {}, items = [];
  s.pairs.forEach(function(p, i){ if(seen[p[1]]) return; seen[p[1]] = 1; items.push({id:s.id+"-"+i, term:p[0], def:p[1]}); });
  return pick(items, Math.min(n || 8, items.length));
}

/* ================================================================ scheduling */
/* A Leitner box system. Box 0 is new or just failed; box 5 is long-term.
   Intervals are in days. Rating: 0 again, 1 hard, 2 good, 3 easy.          */
var INTERVAL = [0, 1, 3, 7, 16, 35];
function todayIndex(now){
  var d = now ? new Date(now) : new Date();
  return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86400000);
}
function newState(){ return {b:0, d:0, seen:0, lapse:0}; }
function schedule(st, rating, day){
  var s = {b:st.b, d:st.d, seen:(st.seen||0)+1, lapse:st.lapse||0};
  if(rating === 0){ s.b = 0; s.lapse++; }
  else if(rating === 1){ s.b = Math.max(1, s.b); }
  else if(rating === 2){ s.b = Math.min(5, s.b + 1); }
  else { s.b = Math.min(5, s.b + 2); }
  s.d = day + INTERVAL[s.b];
  return s;
}
function isDue(st, day){ return !st || st.seen === 0 || st.d <= day; }
function isMastered(st){ return !!st && st.b >= 4; }

/* ================================================================ exam building */
/* order: 0 mixed (written + identification), 1 recall (written recall +
   identification), 2 application only, 3 identification only.             */
function examPool(opts){
  var scope = opts.scope === "all" ? "all" : opts.unit;
  var hand = qsFor(scope), gen = genFor(scope), pool;
  if(opts.order === 2) pool = hand.filter(function(q){ return q.o === 2; });
  else if(opts.order === 1) pool = hand.filter(function(q){ return q.o === 1; }).concat(gen);
  else if(opts.order === 3) pool = gen;
  else pool = hand.concat(gen);
  if(opts.only && opts.only.length) pool = pool.filter(function(q){ return opts.only.indexOf(q.id) >= 0; });
  return pool;
}
function materialize(q){
  var a = q.a.map(function(x){ return {t:x.t, ok:!!x.ok, w:x.w || ""}; });
  if(q.gen){ a = a.filter(function(x){ return x.ok; }).concat(pick(a.filter(function(x){ return !x.ok; }), 3)); }
  return {id:q.id, unit:q.unit, unitName:q.unitName, o:q.o, gen:!!q.gen, v:q.v, s:q.s, e:q.e, opts:shuffle(a)};
}
function buildExam(opts){
  var pool = examPool(opts), n = opts.n || 10;
  if(!pool.length) return [];
  var picks;
  if(opts.order === 0 && !(opts.only && opts.only.length)){
    /* a mixed exam is mostly written questions; identification fills at most a third */
    var hand = pool.filter(function(q){ return !q.gen; }), gen = pool.filter(function(q){ return q.gen; });
    var nGen = Math.min(gen.length, Math.floor(n / 3)), nHand = Math.min(hand.length, n - nGen);
    nGen = Math.min(gen.length, n - nHand);
    picks = shuffle(pick(hand, nHand).concat(pick(gen, nGen)));
  } else {
    picks = pick(pool, Math.min(n, pool.length));
  }
  return picks.map(materialize);
}

/* ================================================================ matching sets */
/* Tiles have to stay readable. Long definitions are cut back to their first
   sentence, which is where the actual definition lives in these cards. */
function shortDef(b){
  if(b.length <= 150) return b;
  var first = b.split(". ")[0];
  if(first.length >= 28 && first.length <= 150) return first + ".";
  var cut = b.slice(0, 146);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}
function matchSet(sel, n){
  var seen = {}, out = [];
  cardsFor(sel).forEach(function(c){
    if(c.f.length > 54) return;
    var def = shortDef(c.b);
    if(def.length > 150 || seen[def]) return;
    seen[def] = 1;
    out.push({id:c.id, term:c.f, def:def});
  });
  return pick(out, Math.min(n || 8, out.length));
}

/* ================================================================ diagrams & plates */
var PLATES = G.__PLATES || [];
function diagramsFor(sel){ return sel==="all" ? DIAGRAMS : DIAGRAMS.filter(function(d){ return d.unit===sel; }); }
function platesFor(sel){ return sel==="all" ? PLATES : PLATES.filter(function(p){ return p.unit===sel; }); }
/* "Name this plate": the picture, four names. Distractors come from every plate
   so a unit with only one plate still gets a real question. */
function plateQuiz(list){
  return shuffle(list).map(function(p){
    var others = pick(PLATES.filter(function(x){ return x.id !== p.id; }), 3);
    return {id:p.id, file:p.file, name:p.name, caption:p.caption,
            opts:shuffle([{t:p.name, ok:true}].concat(others.map(function(x){ return {t:x.name, ok:false}; })))};
  });
}
/* A numbered plate: "what is structure 14?" with the other numbers as wrong answers. */
function plateKeyQuiz(p){
  if(!p.key) return [];
  return shuffle(p.key).map(function(k){
    var others = pick(p.key.filter(function(x){ return x.label !== k.label; }), 3);
    return {n:k.n, label:k.label, note:k.note || "",
            opts:shuffle([{t:k.label, ok:true}].concat(others.map(function(x){ return {t:x.label, ok:false}; })))};
  });
}
function diagramQuiz(dg){
  return shuffle(dg.pins).map(function(p){
    var others = pick(dg.pins.filter(function(x){ return x.n !== p.n; }), 3);
    return {n:p.n, label:p.label, note:p.note,
            opts:shuffle([{t:p.label, ok:true}].concat(others.map(function(x){ return {t:x.label, ok:false}; })))};
  });
}

/* The verdict on a score: title first, then the honest advice. */
function verdictFor(p){
  if(p === 100) return {t:"You’re the GOAT.", a:"Nothing left here. Push into a harder mix — all units, application only."};
  if(p >= 85)   return {t:"You’re him.", a:"Strong. The misses below are the whole job now."};
  if(p >= 70)   return {t:"Main character energy.", a:"Solid base, but the gaps are real. Work the misses, then retake."};
  if(p >= 50)   return {t:"You’re a bot.", a:"About half. Back to the flashcards for this unit before testing again."};
  return {t:"You’re cheeks.", a:"Start with the flashcards and the diagrams. Testing before the material is in place mostly measures frustration."};
}

/* ---- tests run without a browser ---- */
if(typeof window === "undefined"){
  module.exports = {UNITS:UNITS, DIAGRAMS:DIAGRAMS, PLATES:PLATES, ALL_CARDS:ALL_CARDS, ALL_QS:ALL_QS,
    MATCHSETS:MATCHSETS, GEN_QS:GEN_QS, genFor:genFor, matchSetsFor:matchSetsFor, matchFromSet:matchFromSet, plateKeyQuiz:plateKeyQuiz,
    cardsFor:cardsFor, qsFor:qsFor, buildExam:buildExam, examPool:examPool, matchSet:matchSet,
    diagramQuiz:diagramQuiz, diagramsFor:diagramsFor, platesFor:platesFor, plateQuiz:plateQuiz, verdictFor:verdictFor, schedule:schedule, newState:newState,
    isDue:isDue, isMastered:isMastered, INTERVAL:INTERVAL, todayIndex:todayIndex};
  return;
}

/* ================================================================ storage */
var KEY = "sf.v1";
var store = {
  read:function(){
    try{ return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; }catch(e){ return {}; }
  },
  write:function(o){ try{ localStorage.setItem(KEY, JSON.stringify(o)); }catch(e){} }
};
var DB = store.read();
DB.cards = DB.cards || {};       /* cardId -> {b,d,seen,lapse}            */
DB.qs    = DB.qs    || {};       /* questionId -> {seen,right,sure,sureRight} */
DB.prefs = DB.prefs || {};
function save(){ store.write(DB); }
function cardState(id){ return DB.cards[id] || newState(); }

/* ================================================================ unit selector */
var sel = DB.prefs.unit || UNITS[0].id;
if(sel !== "all" && !unitById(sel)) sel = UNITS[0].id;
(function(){
  var s = $("#unitSel"), html = "";
  UNITS.forEach(function(u, i){ html += '<option value="'+u.id+'">'+(i+1)+'. '+esc(u.name)+'</option>'; });
  html += '<option value="all">All units</option>';
  s.innerHTML = html;
  s.value = sel;
  s.addEventListener("change", function(){ sel = s.value; DB.prefs.unit = sel; save(); renderAll(); });
})();
function unitLabel(){ return sel === "all" ? "All units" : unitById(sel).name; }
function updateMeta(){
  var c = cardsFor(sel).length, q = qsFor(sel).length, g = genFor(sel).length, d = diagramsFor(sel).length, p = platesFor(sel).length;
  var app = qsFor(sel).filter(function(x){ return x.o === 2; }).length;
  $("#unitMeta").textContent = c + " cards · " + q + " questions (" + app + " application)" + (g ? " + " + g + " identification" : "") +
    " · " + d + " diagram" + (d===1?"":"s") + (p ? " · " + p + " plate" + (p===1?"":"s") : "");
}
function updateDue(){
  var day = todayIndex();
  var n = cardsFor("all").filter(function(c){ return isDue(cardState(c.id), day); }).length;
  var pill = $("#duePill");
  pill.hidden = n === 0;
  $("#dueN").textContent = n;
}

/* ================================================================ mode switching */
var mode = DB.prefs.mode || "study";
$$(".mode").forEach(function(b){
  b.addEventListener("click", function(){
    mode = b.getAttribute("data-mode"); DB.prefs.mode = mode; save(); renderAll();
    window.scrollTo({top:0, behavior:"smooth"});
  });
});
function showMode(){
  $$(".mode").forEach(function(b){ b.setAttribute("aria-selected", String(b.getAttribute("data-mode") === mode)); });
  $$(".panel").forEach(function(p){ p.hidden = p.getAttribute("data-panel") !== mode; });
}

/* ================================================================ 1. STUDY */
var sess = null;
function startSession(onlyDue){
  var day = todayIndex();
  var pool = cardsFor(sel);
  var queue = onlyDue ? pool.filter(function(c){ return isDue(cardState(c.id), day); }) : pool;
  sess = {queue:shuffle(queue), i:0, flipped:false, done:0, again:0, total:queue.length, onlyDue:!!onlyDue};
  renderStudy();
}
function renderStudy(){
  var root = $("#studyRoot");
  if(!sess){
    var day = todayIndex();
    var dueN = cardsFor(sel).filter(function(c){ return isDue(cardState(c.id), day); }).length;
    var total = cardsFor(sel).length;
    root.innerHTML =
      '<div class="card setup">'+
        '<div class="h-sec"><h2>Flashcards — '+esc(unitLabel())+'</h2><span class="sub">'+total+' cards</span></div>'+
        '<p class="setup note" style="margin:0 0 18px">Rate each card honestly. Cards you find hard come back sooner; cards you know are pushed further out, so your time goes where it is needed.</p>'+
        '<div style="display:flex;gap:10px;flex-wrap:wrap">'+
          '<button class="btn primary" id="sDue">Study '+dueN+' due now</button>'+
          '<button class="btn" id="sAll">Run through all '+total+'</button>'+
        '</div>'+
      '</div>';
    $("#sDue").disabled = dueN === 0;
    $("#sDue").addEventListener("click", function(){ startSession(true); });
    $("#sAll").addEventListener("click", function(){ startSession(false); });
    return;
  }
  if(sess.i >= sess.queue.length){
    root.innerHTML =
      '<div class="card res" style="text-align:center">'+
        '<h2 style="font-size:20px">Session complete</h2>'+
        '<p style="color:var(--ink-2);margin-top:8px">'+sess.done+' cards reviewed'+(sess.again ? ' · '+sess.again+' marked for another pass' : '')+'.</p>'+
        '<div style="display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap">'+
          '<button class="btn primary" id="sAgain">Study again</button>'+
          '<button class="btn" id="sExam">Take a practice exam</button>'+
        '</div>'+
      '</div>';
    $("#sAgain").addEventListener("click", function(){ sess = null; renderStudy(); });
    $("#sExam").addEventListener("click", function(){ mode = "exam"; DB.prefs.mode = mode; save(); renderAll(); });
    updateDue();
    return;
  }
  var c = sess.queue[sess.i], st = cardState(c.id);
  var done = sess.i, total = sess.queue.length;
  root.innerHTML =
    '<div class="studyhead">'+
      '<div class="chips"><span><b>'+(done+1)+'</b> of '+total+'</span><span>Box <b>'+st.b+'</b> of 5</span>'+
        (st.lapse ? '<span>missed <b>'+st.lapse+'</b>×</span>' : '')+'</div>'+
      '<button class="btn sm ghost" id="sEnd">End session</button>'+
    '</div>'+
    '<div class="fcard" id="fc">'+
      '<div class="top"><span class="unitname">'+esc(c.unitName)+'</span><span class="tag">'+(st.seen ? 'review' : 'new')+'</span></div>'+
      '<div class="body">'+
        '<div class="front">'+c.f+'</div>'+
        (sess.flipped ? '<div class="back"><div class="ans">'+c.b+'</div>'+(c.why ? '<div class="why">'+c.why+'</div>' : '')+'</div>' : '')+
      '</div>'+
      (sess.flipped ? '' : '<p class="tapzone">Click the card or press <kbd>Space</kbd> to reveal</p>')+
    '</div>'+
    (sess.flipped ?
      '<div class="rate">'+
        '<button data-q="0" type="button">Again<span>&lt; 1 day</span></button>'+
        '<button data-q="1" type="button">Hard<span>'+INTERVAL[Math.max(1,st.b)]+'d</span></button>'+
        '<button data-q="2" type="button">Good<span>'+INTERVAL[Math.min(5,st.b+1)]+'d</span></button>'+
        '<button data-q="3" type="button">Easy<span>'+INTERVAL[Math.min(5,st.b+2)]+'d</span></button>'+
      '</div>' : '')+
    '<div class="bar"><i style="width:'+pct(done,total)+'%"></i></div>'+
    '<p class="hintbar">'+(sess.flipped ? 'Rate with <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd>' : 'Reveal with <kbd>Space</kbd>')+'</p>';
  $("#fc").addEventListener("click", function(){ if(!sess.flipped){ sess.flipped = true; renderStudy(); } });
  $("#sEnd").addEventListener("click", function(){ sess = null; renderStudy(); updateDue(); });
  $$(".rate button").forEach(function(b){
    b.addEventListener("click", function(){ rate(parseInt(b.getAttribute("data-q"),10)); });
  });
}
function rate(q){
  var c = sess.queue[sess.i], day = todayIndex();
  DB.cards[c.id] = schedule(cardState(c.id), q, day);
  sess.done++;
  if(q === 0){ sess.again++; sess.queue.push(c); }
  sess.i++; sess.flipped = false;
  save(); renderStudy(); updateDue();
}

/* ================================================================ 2. EXAM */
var exam = null;
var examCfg = {n:10, order:0, scope:"unit", missed:false};
function renderExamSetup(){
  var poolAll = examPool({unit:sel, scope:examCfg.scope, order:examCfg.order});
  var missedIds = Object.keys(DB.qs).filter(function(k){ return DB.qs[k].seen && DB.qs[k].right < DB.qs[k].seen; });
  $("#examRoot").innerHTML =
    '<div class="card setup">'+
      '<div class="h-sec"><h2>Practice exam</h2><span class="sub">'+esc(unitLabel())+'</span></div>'+
      '<div class="grp"><span class="glab">Number of questions</span><div class="seg" id="segN">'+
        [10,20,40].map(function(n){ return '<button type="button" data-n="'+n+'" aria-pressed="'+(examCfg.n===n)+'">'+n+'</button>'; }).join("")+
      '</div></div>'+
      '<div class="grp"><span class="glab">Question type</span><div class="seg" id="segO">'+
        '<button type="button" data-o="0" aria-pressed="'+(examCfg.order===0)+'">Mixed</button>'+
        '<button type="button" data-o="2" aria-pressed="'+(examCfg.order===2)+'">Application only</button>'+
        '<button type="button" data-o="1" aria-pressed="'+(examCfg.order===1)+'">Recall only</button>'+
        '<button type="button" data-o="3" aria-pressed="'+(examCfg.order===3)+'">Identification only</button>'+
      '</div><p class="note">Application questions give you a situation and make you use the material — the second-order questions your lecture exams lean on. Identification questions are the structure half: name the bone, the region, the muscle, the tissue.</p></div>'+
      '<div class="grp"><span class="glab">Draw from</span><div class="seg" id="segS">'+
        '<button type="button" data-s="unit" aria-pressed="'+(examCfg.scope==="unit")+'">This unit</button>'+
        '<button type="button" data-s="all" aria-pressed="'+(examCfg.scope==="all")+'">All units</button>'+
        '<button type="button" data-s="missed" aria-pressed="'+(examCfg.scope==="missed")+'">Questions I have missed'+(missedIds.length?' ('+missedIds.length+')':'')+'</button>'+
      '</div><p class="note">Mixing units is harder and remembers better — it forces you to work out which idea applies before you can answer.</p></div>'+
      '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:22px">'+
        '<button class="btn primary" id="examGo">Start exam</button>'+
        '<span class="note" id="poolNote" style="margin:0">'+poolAll.length+' questions available</span>'+
      '</div>'+
    '</div>';
  function wire(id, attr, fn){
    $(id).addEventListener("click", function(e){
      var b = e.target.closest ? e.target.closest("button["+attr+"]") : null;
      if(!b) return;
      $$("button", $(id)).forEach(function(x){ x.setAttribute("aria-pressed", String(x===b)); });
      fn(b.getAttribute(attr)); renderExamSetup();
    });
  }
  wire("#segN","data-n",function(v){ examCfg.n = parseInt(v,10); });
  wire("#segO","data-o",function(v){ examCfg.order = parseInt(v,10); });
  wire("#segS","data-s",function(v){ examCfg.scope = v; });
  $("#examGo").addEventListener("click", function(){ startExam(missedIds); });
}
function startExam(missedIds){
  var o = {unit:sel, scope:examCfg.scope === "all" ? "all" : "unit", order:examCfg.order, n:examCfg.n};
  if(examCfg.scope === "missed"){ o.scope = "all"; o.only = missedIds; }
  var qs = buildExam(o);
  if(!qs.length){ renderExamSetup(); $("#poolNote").textContent = "No questions match those settings — try widening them."; return; }
  exam = {qs:qs, i:0, answered:false, score:0, missed:[], sure:null, t0:Date.now(), log:[]};
  renderExam();
}
function renderExam(){
  var root = $("#examRoot");
  if(!exam){ renderExamSetup(); return; }
  if(exam.i >= exam.qs.length){ renderResults(); return; }
  var q = exam.qs[exam.i];
  root.innerHTML =
    '<div class="qhead">'+
      '<span class="qcount">Question '+(exam.i+1)+' of '+exam.qs.length+'</span>'+
      '<span class="timer" id="timer">0:00</span>'+
    '</div>'+
    '<div class="dots" id="dots"></div>'+
    '<div class="card qbox">'+
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">'+
        '<span class="tag '+(q.o===2?'apply':'recall')+'">'+(q.gen ? 'Identification' : (q.o===2?'Application':'Recall'))+'</span>'+
        '<span class="tag">'+esc(q.unitName)+'</span>'+
      '</div>'+
      '<p class="stem">'+(q.v ? '<span class="vig">'+q.v+'</span>' : '')+q.s+'</p>'+
      '<div class="opts" id="opts"></div>'+
      '<div class="conf" id="conf"><span>Before you see the answer:</span>'+
        '<button type="button" data-c="1" aria-pressed="false">I am sure</button>'+
        '<button type="button" data-c="0" aria-pressed="false">Not sure</button>'+
      '</div>'+
      '<div id="fb"></div>'+
      '<div class="qfoot"><span></span><button class="btn primary" id="qNext" hidden>Next</button></div>'+
    '</div>';
  renderDots();
  var opts = $("#opts");
  q.opts.forEach(function(o, i){
    var b = document.createElement("button");
    b.type = "button"; b.className = "opt";
    b.innerHTML = '<span class="k">'+String.fromCharCode(65+i)+'</span><span>'+o.t+'</span>';
    b.addEventListener("click", function(){ answer(i); });
    opts.appendChild(b);
  });
  $("#conf").addEventListener("click", function(e){
    var b = e.target.closest ? e.target.closest("button[data-c]") : null;
    if(!b || exam.answered) return;
    exam.sure = b.getAttribute("data-c") === "1";
    $$("#conf button").forEach(function(x){ x.setAttribute("aria-pressed", String(x===b)); });
  });
  $("#qNext").addEventListener("click", function(){ exam.i++; exam.answered = false; exam.sure = null; renderExam(); });
  tick();
}
function renderDots(){
  var d = $("#dots"); if(!d) return;
  d.innerHTML = "";
  exam.qs.forEach(function(q, i){
    var s = document.createElement("i");
    if(q.got === true) s.className = "ok"; else if(q.got === false) s.className = "no"; else if(i === exam.i) s.className = "on";
    d.appendChild(s);
  });
}
var timerId = null;
function tick(){
  if(timerId) clearInterval(timerId);
  timerId = setInterval(function(){
    var el = $("#timer"); if(!el || !exam){ clearInterval(timerId); return; }
    var s = Math.floor((Date.now() - exam.t0)/1000);
    el.textContent = Math.floor(s/60) + ":" + (s%60 < 10 ? "0" : "") + (s%60);
  }, 1000);
}
function answer(idx){
  if(exam.answered) return;
  exam.answered = true;
  var q = exam.qs[exam.i], chosen = q.opts[idx], right = chosen.ok;
  q.got = right;
  var rec = DB.qs[q.id] || {seen:0, right:0, sure:0, sureRight:0};
  rec.seen++; if(right) rec.right++;
  if(exam.sure !== null){ rec.sure++; if(right) rec.sureRight++; }
  DB.qs[q.id] = rec; save();
  exam.log.push({id:q.id, unit:q.unitName, o:q.o, right:right, sure:exam.sure});
  if(right) exam.score++; else exam.missed.push(q);
  $$("#opts .opt").forEach(function(b, i){
    b.disabled = true;
    var o = q.opts[i];
    if(o.ok) b.classList.add("correct");
    if(i === idx && !right) b.classList.add("wrong");
    if(o.w && (o.ok || i === idx)) b.innerHTML += '<span class="why">'+o.w+'</span>';
  });
  $("#fb").innerHTML = '<div class="fb '+(right?"good":"bad")+'"><span class="lead">'+
    (right ? "Correct" : "Not this one") + '</span>'+q.e+'</div>';
  renderDots();
  var nb = $("#qNext"); nb.hidden = false;
  nb.textContent = (exam.i === exam.qs.length-1) ? "See results" : "Next";
  nb.focus();
}
function renderResults(){
  if(timerId) clearInterval(timerId);
  var n = exam.qs.length, p = pct(exam.score, n);
  var secs = Math.floor((Date.now() - exam.t0)/1000);
  var byUnit = {}, byOrder = {1:{n:0,r:0}, 2:{n:0,r:0}}, sureN = 0, sureR = 0;
  exam.log.forEach(function(l){
    byUnit[l.unit] = byUnit[l.unit] || {n:0, r:0};
    byUnit[l.unit].n++; if(l.right) byUnit[l.unit].r++;
    byOrder[l.o].n++; if(l.right) byOrder[l.o].r++;
    if(l.sure === true){ sureN++; if(l.right) sureR++; }
  });
  var vd = verdictFor(p);
  var C = 2*Math.PI*58;
  var html =
    '<div class="card res">'+
      '<div class="scorewrap">'+
        '<div class="ring"><svg width="132" height="132"><circle cx="66" cy="66" r="58" fill="none" stroke="var(--surface-3)" stroke-width="11"/>'+
          '<circle cx="66" cy="66" r="58" fill="none" stroke="var(--accent)" stroke-width="11" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+(C*(1-p/100))+'"/></svg>'+
          '<div class="val">'+p+'%<small>'+exam.score+' of '+n+'</small></div></div>'+
        '<div class="verdict"><h3>'+vd.t+'</h3><p>'+vd.a+'</p>'+
          '<p style="margin-top:8px;font-size:12.5px;color:var(--muted)">Time: '+Math.floor(secs/60)+' min '+(secs%60)+' s</p></div>'+
      '</div>'+
      '<div class="breakdown">'+
        (byOrder[2].n ? brow("Application questions", byOrder[2].r, byOrder[2].n) : "")+
        (byOrder[1].n ? brow("Recall questions", byOrder[1].r, byOrder[1].n) : "")+
        Object.keys(byUnit).map(function(k){ return brow(k, byUnit[k].r, byUnit[k].n); }).join("")+
      '</div>'+
      (sureN ? '<div class="callout"><b>Calibration.</b> On the '+sureN+' question'+(sureN===1?'':'s')+' where you said you were sure, you were right '+pct(sureR,sureN)+'% of the time. '+
        (pct(sureR,sureN) >= 90 ? 'Your confidence is trustworthy — trust it on exam day.' : 'Being confidently wrong is the most expensive kind of gap, because you will not study it. Look hard at those misses.')+'</div>' : "")+
      (exam.missed.length ? '<div class="misses"><h3 style="font-size:14px;margin-bottom:4px">What you missed</h3>'+
        exam.missed.map(function(q){
          var right = q.opts.filter(function(o){ return o.ok; })[0];
          return '<div class="miss"><div class="q">'+q.s+'</div><div class="a"><b>'+right.t+'</b> — '+q.e+'</div></div>';
        }).join("")+'</div>' : "")+
      '<div style="display:flex;gap:10px;justify-content:center;margin-top:26px;flex-wrap:wrap">'+
        '<button class="btn primary" id="rAgain">New exam</button>'+
        (exam.missed.length ? '<button class="btn" id="rMissed">Retake just the misses</button>' : "")+
        '<button class="btn ghost" id="rStudy">Back to flashcards</button>'+
      '</div>'+
    '</div>';
  $("#examRoot").innerHTML = html;
  $("#rAgain").addEventListener("click", function(){ exam = null; renderExamSetup(); });
  if($("#rMissed")) $("#rMissed").addEventListener("click", function(){
    var ids = exam.missed.map(function(q){ return q.id; });
    var qs = buildExam({unit:sel, scope:"all", order:0, n:ids.length, only:ids});
    exam = {qs:qs, i:0, answered:false, score:0, missed:[], sure:null, t0:Date.now(), log:[]};
    renderExam();
  });
  $("#rStudy").addEventListener("click", function(){ mode = "study"; DB.prefs.mode = mode; save(); renderAll(); });
}
function brow(name, r, n){
  var p = pct(r,n), cls = p < 60 ? " low" : (p < 80 ? " mid" : "");
  return '<div class="brow"><span class="nm">'+esc(name)+'</span><span class="sc">'+r+'/'+n+' · '+p+'%</span>'+
         '<span class="mini"><i class="'+cls.trim()+'" style="width:'+p+'%"></i></span></div>';
}

/* ================================================================ 3. MATCH */
var match = null, matchChoice = DB.prefs.matchSet || null;
function newMatch(){
  var sets = matchSetsFor(sel);
  if(matchChoice !== "defs" && !sets.filter(function(s){ return s.id === matchChoice; }).length){
    matchChoice = sets.length ? sets[0].id : "defs";
  }
  var s = matchChoice === "defs" ? null : setById(matchChoice);
  var items = s ? matchFromSet(s.id, 8) : matchSet(sel, 8);
  match = {items:items, sel:null, done:0, miss:0, left:s ? s.left : "Term", right:s ? s.right : "Definition"};
  DB.prefs.matchSet = matchChoice; save();
  renderMatch();
}
function renderMatch(){
  var root = $("#matchRoot");
  if(!match) newMatch();
  var m = match, sets = matchSetsFor(sel);
  var picker = '<select id="mSet" aria-label="What to match">'+
    sets.map(function(s){ return '<option value="'+s.id+'"'+(s.id===matchChoice?' selected':'')+'>'+esc(s.name)+'</option>'; }).join("")+
    '<option value="defs"'+(matchChoice==="defs"?' selected':'')+'>Terms and definitions from the cards</option></select>';
  if(!m.items.length){
    root.innerHTML = '<div class="studyhead">'+picker+'</div><div class="empty">Nothing to match here. Pick another set or unit.</div>';
    $("#mSet").addEventListener("change", function(){ matchChoice = this.value; newMatch(); });
    return;
  }
  root.innerHTML =
    '<div class="studyhead">'+picker+
      '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">'+
        '<div class="chips"><span>Matched <b>'+m.done+' of '+m.items.length+'</b></span><span>Misses <b>'+m.miss+'</b></span></div>'+
        '<button class="btn sm" id="mNew">New round</button>'+
      '</div>'+
    '</div>'+
    (m.done === m.items.length ? '<div class="banner">Round complete — '+(m.miss===0?'a perfect run.':m.miss+(m.miss===1?' miss.':' misses.'))+'</div>' : '')+
    '<div class="mgrid">'+
      '<div class="mcol"><h3>'+esc(m.left)+'</h3><div class="tiles" id="mL"></div></div>'+
      '<div class="mcol"><h3>'+esc(m.right)+'</h3><div class="tiles" id="mR"></div></div>'+
    '</div>';
  $("#mSet").addEventListener("change", function(){ matchChoice = this.value; newMatch(); });
  $("#mNew").addEventListener("click", newMatch);
  var L = $("#mL"), R = $("#mR");
  shuffle(m.items).forEach(function(it){ tile(L, it, "L", it.term, "tile term"); });
  shuffle(m.items).forEach(function(it){ tile(R, it, "R", it.def, "tile"); });
  function tile(parent, it, side, text, cls){
    var b = document.createElement("button");
    b.type = "button"; b.className = cls + (m.solved && m.solved[it.id] ? " done" : "");
    b.innerHTML = text;
    b.addEventListener("click", function(){ clickTile(side, it, b); });
    parent.appendChild(b);
  }
}
function clickTile(side, it, node){
  var m = match;
  if(node.classList.contains("done")) return;
  if(!m.sel){ m.sel = {side:side, it:it, node:node}; node.classList.add("sel"); return; }
  if(m.sel.side === side){ m.sel.node.classList.remove("sel"); m.sel = {side:side, it:it, node:node}; node.classList.add("sel"); return; }
  var a = m.sel; m.sel = null; a.node.classList.remove("sel");
  if(a.it.id === it.id){
    a.node.classList.add("done"); node.classList.add("done");
    m.solved = m.solved || {}; m.solved[it.id] = 1; m.done++;
    var head = $("#matchRoot .chips");
    if(head) head.innerHTML = '<span>Matched <b>'+m.done+' of '+m.items.length+'</b></span><span>Misses <b>'+m.miss+'</b></span>';
    if(m.done === m.items.length) renderMatch();
  } else {
    m.miss++;
    [a.node, node].forEach(function(x){ x.classList.add("bad"); setTimeout(function(){ x.classList.remove("bad"); }, 380); });
    var h = $("#matchRoot .chips");
    if(h) h.innerHTML = '<span>Matched <b>'+m.done+' of '+m.items.length+'</b></span><span>Misses <b>'+m.miss+'</b></span>';
  }
}

/* ================================================================ 4. DIAGRAMS */
var dg = {view:"draw", id:null, mode:"reveal", shown:{}, quiz:null, qi:0, score:0, pq:null, pqi:0, pscore:0};
function viewToggle(){
  return '<div class="seg" id="dgView">'+
    '<button type="button" data-v="draw" aria-pressed="'+(dg.view==="draw")+'">Drawings</button>'+
    '<button type="button" data-v="plates" aria-pressed="'+(dg.view==="plates")+'">Plates</button>'+
  '</div>';
}
function wireView(){
  $("#dgView").addEventListener("click", function(e){
    var b = e.target.closest ? e.target.closest("button[data-v]") : null;
    if(!b) return;
    dg.view = b.getAttribute("data-v"); dg.pq = null; dg.kq = null; dg.quiz = null; dg.shown = {}; renderDiagrams();
  });
}
function renderDiagrams(){
  var root = $("#dgRoot");
  var list = diagramsFor(sel), plates = platesFor(sel);
  if(dg.view === "draw" && !list.length && plates.length) dg.view = "plates";
  if(dg.view === "plates"){ renderPlates(plates); return; }
  if(!list.length){
    root.innerHTML = '<div class="studyhead">'+viewToggle()+'</div>'+
      '<div class="empty">No drawing for this unit yet. Switch to <b>All units</b> to see the '+DIAGRAMS.length+' available.</div>';
    wireView();
    return;
  }
  if(!dg.id || !list.filter(function(d){ return d.id===dg.id; }).length){ dg.id = list[0].id; dg.shown = {}; dg.quiz = null; }
  var d = DIAGRAMS.filter(function(x){ return x.id===dg.id; })[0];
  root.innerHTML =
    '<div class="studyhead">'+
      '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">'+viewToggle()+
      '<select id="dgSel" aria-label="Choose a diagram">'+list.map(function(x){ return '<option value="'+x.id+'"'+(x.id===dg.id?' selected':'')+'>'+esc(x.name)+'</option>'; }).join("")+'</select></div>'+
      '<div class="seg" id="dgMode">'+
        '<button type="button" data-m="reveal" aria-pressed="'+(dg.mode==="reveal")+'">Reveal</button>'+
        '<button type="button" data-m="quiz" aria-pressed="'+(dg.mode==="quiz")+'">Quiz me</button>'+
      '</div>'+
    '</div>'+
    '<p class="hintbar" style="margin:0 0 14px">'+esc(d.blurb)+'</p>'+
    '<div class="dgstage"><div class="dgart" id="dgArt" style="max-width:'+d.maxw+'px">'+
      '<svg class="art" viewBox="0 0 '+d.w+' '+d.h+'" role="img" aria-label="'+esc(d.name)+'">'+d.art+'</svg>'+
    '</div></div>'+
    '<div id="dgBelow"></div>';
  wireView();
  $("#dgSel").addEventListener("change", function(){ dg.id = this.value; dg.shown = {}; dg.quiz = null; renderDiagrams(); });
  $("#dgMode").addEventListener("click", function(e){
    var b = e.target.closest ? e.target.closest("button[data-m]") : null;
    if(!b) return;
    dg.mode = b.getAttribute("data-m"); dg.shown = {}; dg.quiz = null; renderDiagrams();
  });
  if(dg.mode === "reveal") revealMode(d); else quizMode(d);
}
function renderPlates(plates){
  var root = $("#dgRoot");
  if(!plates.length){
    root.innerHTML = '<div class="studyhead">'+viewToggle()+'</div>'+
      '<div class="empty">No plate for this unit. Switch to <b>All units</b> to see all '+PLATES.length+'.</div>';
    wireView(); return;
  }
  if(dg.pq){ renderPlateQuiz(); return; }
  if(dg.kq){ renderKeyQuiz(); return; }
  root.innerHTML =
    '<div class="studyhead">'+viewToggle()+
      '<button class="btn sm primary" id="plQuiz">Quiz: name the plate</button>'+
    '</div>'+
    '<p class="hintbar" style="margin:0 0 16px">Real anatomical figures, in the public domain. Read the caption, then find each item in the list before you move on.</p>'+
    '<div class="plates">'+plates.map(function(p){
      return '<article class="plate card'+(p.wide ? ' wide' : '')+'">'+
        '<div class="plimg"><img src="'+p.file+'" alt="'+esc(p.name)+'" loading="lazy"></div>'+
        '<div class="pltext"><h3>'+esc(p.name)+'</h3><p class="cap">'+p.caption+'</p>'+
        (p.find ? '<div class="find">'+p.find.map(function(f){ return '<span class="chip">'+esc(f)+'</span>'; }).join("")+'</div>' : '')+
        (p.key ? '<div style="margin-top:14px"><button class="btn sm primary" data-key="'+p.id+'">Quiz me on the numbers ('+p.key.length+')</button></div>' : '')+
        '<p class="credit">'+esc(p.credit)+'</p></div>'+
      '</article>';
    }).join("")+'</div>';
  wireView();
  $("#plQuiz").addEventListener("click", function(){
    dg.pq = plateQuiz(plates.length >= 4 ? plates : PLATES); dg.pqi = 0; dg.pscore = 0; renderPlates(plates);
  });
  $$("button[data-key]").forEach(function(b){
    b.addEventListener("click", function(){
      var p = PLATES.filter(function(x){ return x.id === b.getAttribute("data-key"); })[0];
      dg.kq = {plate:p, qs:plateKeyQuiz(p), i:0, score:0}; renderDiagrams();
    });
  });
}
function renderKeyQuiz(){
  var root = $("#dgRoot"), k = dg.kq, p = k.plate;
  if(k.i >= k.qs.length){
    var C = 2*Math.PI*58;
    root.innerHTML = '<div class="studyhead">'+viewToggle()+'</div>'+
      '<div class="card res" style="text-align:center">'+
        '<div class="ring" style="margin:0 auto"><svg width="132" height="132"><circle cx="66" cy="66" r="58" fill="none" stroke="var(--surface-3)" stroke-width="11"/>'+
        '<circle cx="66" cy="66" r="58" fill="none" stroke="var(--accent)" stroke-width="11" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+(C*(1-k.score/k.qs.length))+'"/></svg>'+
        '<div class="val">'+pct(k.score,k.qs.length)+'%<small>'+k.score+' of '+k.qs.length+'</small></div></div>'+
        '<h3 style="margin-top:16px;font-size:21px">'+verdictFor(pct(k.score,k.qs.length)).t+'</h3>'+
        '<p style="margin-top:8px;color:var(--ink-2)">'+esc(p.name)+'</p>'+
        '<div style="margin-top:18px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn primary" id="kAgain">Go again</button><button class="btn" id="kBack">Back to the plates</button></div>'+
      '</div>';
    wireView();
    $("#kAgain").addEventListener("click", function(){ dg.kq = {plate:p, qs:plateKeyQuiz(p), i:0, score:0}; renderDiagrams(); });
    $("#kBack").addEventListener("click", function(){ dg.kq = null; renderDiagrams(); });
    return;
  }
  var q = k.qs[k.i];
  root.innerHTML = '<div class="studyhead">'+viewToggle()+'<span class="qcount">'+esc(p.name)+' · '+(k.i+1)+' of '+k.qs.length+'</span></div>'+
    '<div class="card qbox">'+
      '<div class="plimg quiz key"><img src="'+p.file+'" alt="Numbered figure"></div>'+
      '<p class="stem" style="margin-top:18px">What is structure number <b style="font-size:1.25em;color:var(--accent)">'+q.n+'</b>?</p>'+
      '<div class="opts" id="kOpts"></div><div id="kFb"></div>'+
      '<div class="qfoot"><button class="btn ghost sm" id="kStop">Stop</button><button class="btn primary" id="kNext" hidden>Next</button></div>'+
    '</div>';
  wireView();
  var wrap = $("#kOpts");
  q.opts.forEach(function(o, i){
    var b = document.createElement("button");
    b.type = "button"; b.className = "opt";
    b.innerHTML = '<span class="k">'+String.fromCharCode(65+i)+'</span><span>'+esc(o.t)+'</span>';
    b.addEventListener("click", function(){
      if(b.disabled) return;
      $$("#kOpts .opt").forEach(function(x, j){ x.disabled = true; if(q.opts[j].ok) x.classList.add("correct"); });
      if(!o.ok) b.classList.add("wrong"); else k.score++;
      $("#kFb").innerHTML = '<div class="fb '+(o.ok?"good":"bad")+'"><span class="lead">'+(o.ok?"Correct":"Not this one")+'</span>Number '+q.n+' is the <b>'+esc(q.label)+'</b>'+(q.note ? ' — '+esc(q.note) : '')+'.</div>';
      var nb = $("#kNext"); nb.hidden = false; nb.focus();
    });
    wrap.appendChild(b);
  });
  $("#kNext").addEventListener("click", function(){ k.i++; renderDiagrams(); });
  $("#kStop").addEventListener("click", function(){ dg.kq = null; renderDiagrams(); });
}
function renderPlateQuiz(){
  var root = $("#dgRoot");
  if(dg.pqi >= dg.pq.length){
    var C = 2*Math.PI*58;
    root.innerHTML = '<div class="studyhead">'+viewToggle()+'</div>'+
      '<div class="card res" style="text-align:center">'+
        '<div class="ring" style="margin:0 auto"><svg width="132" height="132"><circle cx="66" cy="66" r="58" fill="none" stroke="var(--surface-3)" stroke-width="11"/>'+
        '<circle cx="66" cy="66" r="58" fill="none" stroke="var(--accent)" stroke-width="11" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+(C*(1-dg.pscore/dg.pq.length))+'"/></svg>'+
        '<div class="val">'+pct(dg.pscore,dg.pq.length)+'%<small>'+dg.pscore+' of '+dg.pq.length+'</small></div></div>'+
        '<h3 style="margin-top:16px;font-size:21px">'+verdictFor(pct(dg.pscore,dg.pq.length)).t+'</h3>'+
        '<div style="margin-top:18px;display:flex;gap:10px;justify-content:center"><button class="btn primary" id="plAgain">Go again</button><button class="btn" id="plBack">Back to the plates</button></div>'+
      '</div>';
    wireView();
    $("#plAgain").addEventListener("click", function(){ var l = dg.pq.length; dg.pq = plateQuiz(platesFor(sel).length >= 4 ? platesFor(sel) : PLATES); dg.pqi = 0; dg.pscore = 0; renderDiagrams(); });
    $("#plBack").addEventListener("click", function(){ dg.pq = null; renderDiagrams(); });
    return;
  }
  var q = dg.pq[dg.pqi];
  root.innerHTML = '<div class="studyhead">'+viewToggle()+'<span class="qcount">Plate '+(dg.pqi+1)+' of '+dg.pq.length+'</span></div>'+
    '<div class="card qbox">'+
      '<div class="plimg quiz"><img src="'+q.file+'" alt="Unlabeled plate"></div>'+
      '<p class="stem" style="margin-top:18px">What does this plate show?</p>'+
      '<div class="opts" id="plOpts"></div><div id="plFb"></div>'+
      '<div class="qfoot"><span></span><button class="btn primary" id="plNext" hidden>Next</button></div>'+
    '</div>';
  wireView();
  var wrap = $("#plOpts");
  q.opts.forEach(function(o, i){
    var b = document.createElement("button");
    b.type = "button"; b.className = "opt";
    b.innerHTML = '<span class="k">'+String.fromCharCode(65+i)+'</span><span>'+esc(o.t)+'</span>';
    b.addEventListener("click", function(){
      if(b.disabled) return;
      $$("#plOpts .opt").forEach(function(x, j){ x.disabled = true; if(q.opts[j].ok) x.classList.add("correct"); });
      if(!o.ok) b.classList.add("wrong"); else dg.pscore++;
      $("#plFb").innerHTML = '<div class="fb '+(o.ok?"good":"bad")+'"><span class="lead">'+(o.ok?"Correct":"Not this one")+'</span>'+q.caption+'</div>';
      var nb = $("#plNext"); nb.hidden = false; nb.focus();
    });
    wrap.appendChild(b);
  });
  $("#plNext").addEventListener("click", function(){ dg.pqi++; renderDiagrams(); });
}
function placePins(d, onClick, cls){
  var art = $("#dgArt");
  d.pins.forEach(function(p){
    var el = document.createElement("div");
    el.className = "hot" + (cls ? " "+cls(p) : "");
    el.style.left = (p.x / d.w * 100) + "%";
    el.style.top  = (p.y / d.h * 100) + "%";
    el.innerHTML = '<span class="pin">'+p.n+'</span><span class="lab">'+esc(p.label)+'</span>';
    el.addEventListener("click", function(){ onClick(p, el); });
    art.appendChild(el);
  });
}
function revealMode(d){
  placePins(d, function(p, el){
    dg.shown[p.n] = !dg.shown[p.n];
    el.classList.toggle("shown", !!dg.shown[p.n]);
  }, function(p){ return dg.shown[p.n] ? "shown" : ""; });
  $("#dgBelow").innerHTML =
    '<div style="display:flex;gap:10px;margin:16px 0;flex-wrap:wrap">'+
      '<button class="btn sm" id="dgAll">Show all labels</button>'+
      '<button class="btn sm" id="dgNone">Hide all</button>'+
    '</div>'+
    '<div class="dglist">'+d.pins.map(function(p){
      return '<div class="dgitem"><span class="n">'+p.n+'</span><span><span class="nm">'+esc(p.label)+'</span> — <span class="ds">'+esc(p.note)+'</span></span></div>';
    }).join("")+'</div>';
  $("#dgAll").addEventListener("click", function(){ d.pins.forEach(function(p){ dg.shown[p.n]=1; }); renderDiagrams(); });
  $("#dgNone").addEventListener("click", function(){ dg.shown = {}; renderDiagrams(); });
}
function quizMode(d){
  if(!dg.quiz){ dg.quiz = diagramQuiz(d); dg.qi = 0; dg.score = 0; }
  if(dg.qi >= dg.quiz.length){
    $("#dgBelow").innerHTML =
      '<div class="card res" style="text-align:center;margin-top:16px">'+
        '<div class="ring" style="margin:0 auto"><svg width="132" height="132"><circle cx="66" cy="66" r="58" fill="none" stroke="var(--surface-3)" stroke-width="11"/>'+
        '<circle cx="66" cy="66" r="58" fill="none" stroke="var(--accent)" stroke-width="11" stroke-linecap="round" stroke-dasharray="'+(2*Math.PI*58)+'" stroke-dashoffset="'+(2*Math.PI*58*(1-dg.score/dg.quiz.length))+'"/></svg>'+
        '<div class="val">'+pct(dg.score,dg.quiz.length)+'%<small>'+dg.score+' of '+dg.quiz.length+'</small></div></div>'+
        '<h3 style="margin-top:16px;font-size:21px">'+verdictFor(pct(dg.score,dg.quiz.length)).t+'</h3>'+
        '<div style="margin-top:18px"><button class="btn primary" id="dgRetry">Go again</button></div>'+
      '</div>';
    $("#dgRetry").addEventListener("click", function(){ dg.quiz = null; renderDiagrams(); });
    return;
  }
  var q = dg.quiz[dg.qi];
  placePins(d, function(){}, function(p){ return p.n === q.n ? "hit" : ""; });
  $("#dgBelow").innerHTML =
    '<div class="card qbox" style="margin-top:16px">'+
      '<span class="qcount">Structure '+(dg.qi+1)+' of '+dg.quiz.length+'</span>'+
      '<p class="stem">Which structure is marked <b>'+q.n+'</b>?</p>'+
      '<div class="opts" id="dgOpts"></div>'+
      '<div id="dgFb"></div>'+
      '<div class="qfoot"><span></span><button class="btn primary" id="dgNext" hidden>Next</button></div>'+
    '</div>';
  var wrap = $("#dgOpts");
  q.opts.forEach(function(o, i){
    var b = document.createElement("button");
    b.type = "button"; b.className = "opt";
    b.innerHTML = '<span class="k">'+String.fromCharCode(65+i)+'</span><span>'+esc(o.t)+'</span>';
    b.addEventListener("click", function(){
      if(b.disabled) return;
      $$("#dgOpts .opt").forEach(function(x, j){
        x.disabled = true;
        if(q.opts[j].ok) x.classList.add("correct");
      });
      if(!o.ok) b.classList.add("wrong"); else dg.score++;
      $("#dgFb").innerHTML = '<div class="fb '+(o.ok?"good":"bad")+'"><span class="lead">'+(o.ok?"Correct":"Not this one")+'</span>'+esc(q.label)+' — '+esc(q.note)+'</div>';
      var nb = $("#dgNext"); nb.hidden = false; nb.focus();
    });
    wrap.appendChild(b);
  });
  $("#dgNext").addEventListener("click", function(){ dg.qi++; renderDiagrams(); });
}

/* ================================================================ 5. PROGRESS */
function renderProgress(){
  var day = todayIndex();
  var cards = ALL_CARDS, seen = 0, mastered = 0, due = 0, lapses = [];
  cards.forEach(function(c){
    var st = DB.cards[c.id];
    if(st && st.seen) seen++;
    if(isMastered(st)) mastered++;
    if(isDue(st || newState(), day)) due++;
    if(st && st.lapse >= 2) lapses.push({c:c, n:st.lapse});
  });
  var qSeen = 0, qRight = 0, sureN = 0, sureR = 0, missedQ = [];
  ALL_QS.forEach(function(q){
    var r = DB.qs[q.id]; if(!r || !r.seen) return;
    qSeen += r.seen; qRight += r.right; sureN += r.sure || 0; sureR += r.sureRight || 0;
    if(r.right < r.seen) missedQ.push({q:q, n:r.seen - r.right});
  });
  lapses.sort(function(a,b){ return b.n - a.n; });
  missedQ.sort(function(a,b){ return b.n - a.n; });
  var html =
    '<div class="stats">'+
      '<div class="stat accent"><div class="n">'+due+'</div><div class="l">cards due now</div></div>'+
      '<div class="stat"><div class="n">'+mastered+'<span style="font-size:15px;color:var(--muted)">/'+cards.length+'</span></div><div class="l">cards mastered</div></div>'+
      '<div class="stat"><div class="n">'+seen+'</div><div class="l">cards started</div></div>'+
      '<div class="stat"><div class="n">'+(qSeen ? pct(qRight,qSeen)+"%" : "—")+'</div><div class="l">exam accuracy ('+qSeen+' answered)</div></div>'+
    '</div>'+
    '<div class="card" style="padding:18px 20px">'+
      '<div class="h-sec"><h2>Mastery by unit</h2><span class="sub">a card counts as mastered from box 4</span></div>'+
      '<div class="plist">'+UNITS.map(function(u){
        var cs = u.cards, m = 0;
        cs.forEach(function(c){ if(isMastered(DB.cards[c.id])) m++; });
        var p = pct(m, cs.length);
        return '<div class="prow"><span class="nm">'+esc(u.name)+'<small>'+cs.length+' cards · '+u.qs.length+' questions</small></span>'+
               '<span class="track"><i style="width:'+p+'%"></i></span><span class="pc">'+p+'%</span></div>';
      }).join("")+'</div>'+
    '</div>'+
    (sureN ? '<div class="callout"><b>Calibration.</b> When you marked yourself sure, you were right '+pct(sureR,sureN)+'% of the time across '+sureN+' questions. '+
      (pct(sureR,sureN) >= 90 ? 'That is well calibrated.' : 'The gap between feeling sure and being right is where exam points go missing.')+'</div>' : '')+
    (lapses.length ? '<div class="card" style="padding:18px 20px;margin-top:16px">'+
      '<div class="h-sec"><h2>Cards that keep catching you</h2></div>'+
      '<div class="plist">'+lapses.slice(0,6).map(function(x){
        return '<div class="prow" style="grid-template-columns:1fr auto"><span class="nm">'+x.c.f+'<small>'+esc(x.c.unitName)+'</small></span><span class="pc">missed '+x.n+'×</span></div>';
      }).join("")+'</div></div>' : '')+
    (missedQ.length ? '<div class="card" style="padding:18px 20px;margin-top:16px">'+
      '<div class="h-sec"><h2>Questions you have missed</h2><span class="sub">'+missedQ.length+' total</span></div>'+
      '<div class="plist">'+missedQ.slice(0,6).map(function(x){
        return '<div class="prow" style="grid-template-columns:1fr auto"><span class="nm">'+x.q.s+'<small>'+esc(x.q.unitName)+' · '+(x.q.o===2?'application':'recall')+'</small></span><span class="pc">×'+x.n+'</span></div>';
      }).join("")+'</div>'+
      '<div style="margin-top:14px"><button class="btn sm" id="pMissed">Build an exam from these</button></div></div>' : '')+
    '<div style="margin-top:20px;text-align:center"><button class="btn ghost sm" id="pReset">Erase all progress on this device</button></div>';
  $("#progRoot").innerHTML = html;
  if($("#pMissed")) $("#pMissed").addEventListener("click", function(){
    examCfg.scope = "missed"; mode = "exam"; DB.prefs.mode = mode; save(); renderAll();
  });
  $("#pReset").addEventListener("click", function(){
    if(!window.confirm("Erase every card schedule and exam record stored in this browser? This cannot be undone.")) return;
    DB.cards = {}; DB.qs = {}; save(); sess = null; exam = null; renderAll();
  });
}

/* ================================================================ keyboard */
document.addEventListener("keydown", function(e){
  var t = e.target, tag = (t && t.tagName) || "";
  if(/INPUT|TEXTAREA|SELECT/.test(tag)) return;
  if(mode === "study" && sess){
    if(e.key === " " || e.key === "Spacebar"){
      e.preventDefault();
      if(!sess.flipped){ sess.flipped = true; renderStudy(); }
      return;
    }
    if(sess.flipped && /^[1-4]$/.test(e.key)){ e.preventDefault(); rate(parseInt(e.key,10)-1); }
  } else if(mode === "exam" && exam){
    if(/^[a-dA-D]$/.test(e.key)){
      var i = e.key.toLowerCase().charCodeAt(0) - 97;
      var b = $$("#opts .opt")[i];
      if(b && !b.disabled){ e.preventDefault(); b.click(); }
    } else if(e.key === "Enter"){
      var nb = $("#qNext");
      if(nb && !nb.hidden){ e.preventDefault(); nb.click(); }
    }
  }
});

/* ================================================================ boot */
function renderAll(){
  showMode(); updateMeta(); updateDue();
  if(mode === "study"){ sess = null; renderStudy(); }
  else if(mode === "exam"){ exam = null; renderExamSetup(); }
  else if(mode === "match"){ match = null; newMatch(); }
  else if(mode === "diagrams"){ dg.quiz = null; dg.shown = {}; renderDiagrams(); }
  else renderProgress();
}
renderAll();

})();
