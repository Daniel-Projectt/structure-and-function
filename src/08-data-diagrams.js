(function(){
"use strict";
var G = (typeof window !== "undefined") ? window : global;
var DIAGRAMS = [];
G.__DIAGRAMS = DIAGRAMS;

/* Art is drawn in viewBox units; pins are given in the same units and the
   renderer converts them to percentages, so labels always land in the right
   place no matter how the diagram is scaled. */

/* ------------------------------------------------- skin in cross section */
DIAGRAMS.push({
id:"dg-skin", unit:"skin", name:"Skin in cross section", maxw:640, w:640, h:430,
blurb:"Trace a cell's journey from the stratum basale to the surface, and note how deep the appendages reach.",
art:
'<rect x="40" y="26" width="560" height="34" rx="4" fill="var(--surface-3)" stroke="var(--line-2)"/>'+
'<rect x="40" y="60" width="560" height="26" fill="var(--surface-2)" stroke="var(--line-2)"/>'+
'<rect x="40" y="86" width="560" height="38" fill="var(--surface-3)" stroke="var(--line-2)"/>'+
'<path d="M40 124 q28 20 56 0 q28 -20 56 0 q28 20 56 0 q28 -20 56 0 q28 20 56 0 q28 -20 56 0 q28 20 56 0 q28 -20 56 0 q28 20 56 0 q28 -20 56 0 L600 124 L600 150 L40 150 Z" fill="var(--accent-soft)" stroke="var(--line-2)"/>'+
'<path d="M40 150 q28 20 56 0 q28 -20 56 0 q28 20 56 0 q28 -20 56 0 q28 20 56 0 q28 -20 56 0 q28 20 56 0 q28 -20 56 0 q28 20 56 0 q28 -20 56 0 L600 150 L600 226 L40 226 Z" fill="var(--surface-2)" stroke="var(--line-2)"/>'+
'<rect x="40" y="226" width="560" height="104" fill="var(--surface-3)" stroke="var(--line-2)"/>'+
'<rect x="40" y="330" width="560" height="74" rx="4" fill="var(--surface-2)" stroke="var(--line-2)"/>'+
'<g fill="none" stroke="var(--line-2)" stroke-width="1">'+
 '<circle cx="90" cy="358" r="17"/><circle cx="128" cy="380" r="15"/><circle cx="166" cy="356" r="16"/>'+
 '<circle cx="470" cy="360" r="16"/><circle cx="508" cy="382" r="14"/><circle cx="546" cy="358" r="17"/>'+
'</g>'+
'<g stroke="var(--line-2)" stroke-width="1.4" fill="none">'+
 '<path d="M250 250 q6 -60 4 -120 q-2 -60 -10 -104" stroke-width="2.6" stroke="var(--muted)"/>'+
 '<path d="M236 250 q-6 -80 4 -140" /><path d="M264 248 q6 -80 -4 -140"/>'+
 '<ellipse cx="250" cy="258" rx="17" ry="14" fill="var(--accent-soft)"/>'+
'</g>'+
'<g stroke="var(--line-2)" stroke-width="1.2" fill="var(--surface)">'+
 '<circle cx="292" cy="178" r="13"/><circle cx="304" cy="192" r="10"/><circle cx="286" cy="196" r="9"/>'+
 '<path d="M282 186 L266 188" stroke-width="1.6"/>'+
'</g>'+
'<g stroke="var(--line-2)" stroke-width="1.3" fill="none">'+
 '<path d="M420 250 q-4 -60 -2 -100 q1 -20 -6 -26" stroke-dasharray="0"/>'+
 '<path d="M412 124 q-3 -8 2 -14"/>'+
 '<circle cx="424" cy="262" r="8" fill="var(--surface)"/><circle cx="438" cy="252" r="8" fill="var(--surface)"/>'+
 '<circle cx="434" cy="268" r="8" fill="var(--surface)"/><circle cx="412" cy="268" r="7" fill="var(--surface)"/>'+
'</g>'+
'<g stroke="var(--line-2)" stroke-width="1.6" fill="none"><path d="M214 232 q-10 12 -2 24" /></g>'+
'<g stroke="var(--bad)" stroke-width="1.6" fill="none" opacity=".55">'+
 '<path d="M60 300 q80 -26 160 0 q80 26 160 0 q80 -26 160 0"/></g>',
pins:[
 {n:1, x:120, y:42,  label:"Stratum corneum", note:"Dead keratinized cells, continuously shed."},
 {n:2, x:120, y:72,  label:"Stratum granulosum", note:"Cells filling with keratin and dying."},
 {n:3, x:120, y:104, label:"Stratum spinosum", note:"Several layers thick; contains dendritic immune cells."},
 {n:4, x:120, y:137, label:"Stratum basale", note:"The only dividing layer; holds melanocytes."},
 {n:5, x:520, y:188, label:"Papillary dermis", note:"Areolar tissue with capillaries and touch receptors."},
 {n:6, x:520, y:278, label:"Reticular dermis", note:"Dense irregular connective tissue — strength from every direction."},
 {n:7, x:300, y:368, label:"Hypodermis", note:"Adipose; anchors, insulates, cushions. Not part of the skin."},
 {n:8, x:250, y:258, label:"Hair follicle", note:"Epidermis dipping deep into the dermis."},
 {n:9, x:296, y:186, label:"Sebaceous gland", note:"Holocrine; secretes sebum into the follicle."},
 {n:10,x:428, y:262, label:"Eccrine sweat gland", note:"Coiled in the dermis; its duct opens onto the surface."},
 {n:11,x:212, y:244, label:"Arrector pili muscle", note:"Smooth muscle that raises the hair — goose bumps."},
 {n:12,x:70,  y:300, label:"Dermal blood vessels", note:"Dilate to lose heat, constrict to conserve it."}
]});

/* ------------------------------------------------- long bone */
DIAGRAMS.push({
id:"dg-bone", unit:"bone", name:"Long bone, cut open", maxw:360, w:300, h:620,
blurb:"Everything about growth, marrow and repair is easier once you can place these parts.",
art:
'<path d="M96 40 q-42 -22 -62 10 q-18 30 6 52 q16 14 12 34 l0 18 l96 0 l0 -18 q-4 -20 12 -34 q24 -22 6 -52 q-20 -32 -62 -10 Z" fill="var(--surface-3)" stroke="var(--line-2)" stroke-width="1.6" transform="translate(54,0)"/>'+
'<path d="M96 580 q-42 22 -62 -10 q-18 -30 6 -52 q16 -14 12 -34 l0 -18 l96 0 l0 18 q-4 20 12 34 q24 22 6 52 q-20 32 -62 10 Z" fill="var(--surface-3)" stroke="var(--line-2)" stroke-width="1.6" transform="translate(54,0)"/>'+
'<rect x="104" y="154" width="92" height="312" fill="var(--surface-3)" stroke="var(--line-2)" stroke-width="1.6"/>'+
'<rect x="120" y="154" width="60" height="312" fill="var(--surface)" stroke="var(--line-2)" stroke-width="1.2"/>'+
'<g stroke="var(--line-2)" stroke-width=".9" fill="none" opacity=".85">'+
 '<path d="M92 64 l24 16 M116 60 l22 20 M140 62 l22 18 M92 88 l26 14 M120 84 l24 16 M148 86 l22 14 M96 110 l24 14 M126 108 l22 16 M152 110 l20 12"/>'+
 '<path d="M92 556 l24 -16 M116 560 l22 -20 M140 558 l22 -18 M92 532 l26 -14 M120 536 l24 -16 M148 534 l22 -14 M96 510 l24 -14 M126 512 l22 -16 M152 510 l20 -12"/>'+
'</g>'+
'<path d="M92 44 q58 -26 116 0" fill="none" stroke="var(--accent)" stroke-width="5" stroke-linecap="round" opacity=".75"/>'+
'<path d="M92 576 q58 26 116 0" fill="none" stroke="var(--accent)" stroke-width="5" stroke-linecap="round" opacity=".75"/>'+
'<path d="M104 146 L196 146" stroke="var(--apply)" stroke-width="3" stroke-dasharray="7 5"/>'+
'<path d="M104 474 L196 474" stroke="var(--apply)" stroke-width="3" stroke-dasharray="7 5"/>'+
'<rect x="100" y="154" width="5" height="312" fill="var(--accent-soft)" stroke="none"/>'+
'<rect x="195" y="154" width="5" height="312" fill="var(--accent-soft)" stroke="none"/>',
pins:[
 {n:1, x:150, y:70,  label:"Proximal epiphysis", note:"The expanded end; mostly spongy bone with red marrow."},
 {n:2, x:150, y:310, label:"Diaphysis", note:"The shaft — a tube of compact bone around the marrow cavity."},
 {n:3, x:150, y:540, label:"Distal epiphysis", note:"The other expanded end."},
 {n:4, x:150, y:44,  label:"Articular cartilage", note:"Hyaline cartilage where the bone meets another bone."},
 {n:5, x:150, y:146, label:"Epiphyseal line", note:"The scar of the growth plate, once it has ossified."},
 {n:6, x:150, y:310, label:"Medullary cavity", note:"Holds yellow marrow in the adult."},
 {n:7, x:198, y:250, label:"Periosteum", note:"Outer sheath carrying vessels and bone-forming cells."},
 {n:8, x:118, y:400, label:"Compact bone", note:"Dense outer wall built of osteons."},
 {n:9, x:150, y:100, label:"Spongy bone", note:"Trabeculae aligned along lines of stress."},
 {n:10,x:150, y:474, label:"Metaphysis", note:"Where diaphysis meets epiphysis — the old growth zone."}
]});

/* ------------------------------------------------- sarcomere */
DIAGRAMS.push({
id:"dg-sarc", unit:"mus", name:"The sarcomere", maxw:660, w:660, h:300,
blurb:"Predicting which bands change during contraction is a standing exam question. Learn the map first.",
art:
'<rect x="150" y="60" width="6" height="150" fill="var(--accent)" rx="2"/>'+
'<rect x="504" y="60" width="6" height="150" fill="var(--accent)" rx="2"/>'+
'<rect x="328" y="70" width="4" height="130" fill="var(--apply)" rx="2"/>'+
'<g stroke="var(--muted)" stroke-width="4" stroke-linecap="round">'+
 '<path d="M156 84 L300 84"/><path d="M156 108 L300 108"/><path d="M156 132 L300 132"/><path d="M156 156 L300 156"/><path d="M156 180 L300 180"/>'+
 '<path d="M360 84 L504 84"/><path d="M360 108 L504 108"/><path d="M360 132 L504 132"/><path d="M360 156 L504 156"/><path d="M360 180 L504 180"/>'+
'</g>'+
'<g stroke="var(--ink-2)" stroke-width="7" stroke-linecap="round">'+
 '<path d="M240 96 L420 96"/><path d="M240 132 L420 132"/><path d="M240 168 L420 168"/>'+
'</g>'+
'<g stroke="var(--ink-2)" stroke-width="2" stroke-linecap="round" opacity=".9">'+
 '<path d="M256 96 l-10 -9 M276 96 l-10 -9 M296 96 l-10 -9 M404 96 l10 -9 M384 96 l10 -9 M364 96 l10 -9"/>'+
 '<path d="M256 132 l-10 -9 M276 132 l-10 -9 M296 132 l-10 -9 M404 132 l10 -9 M384 132 l10 -9 M364 132 l10 -9"/>'+
 '<path d="M256 168 l-10 -9 M276 168 l-10 -9 M296 168 l-10 -9 M404 168 l10 -9 M384 168 l10 -9 M364 168 l10 -9"/>'+
'</g>'+
'<g stroke="var(--line-2)" stroke-width="1.2" fill="none" stroke-dasharray="4 4">'+
 '<path d="M240 52 L240 216"/><path d="M420 52 L420 216"/><path d="M300 52 L300 216"/><path d="M360 52 L360 216"/>'+
'</g>'+
'<g stroke="var(--accent)" stroke-width="1.6" fill="none">'+
 '<path d="M153 242 L507 242"/><path d="M153 236 L153 248"/><path d="M507 236 L507 248"/>'+
 '<path d="M240 264 L420 264"/><path d="M240 258 L240 270"/><path d="M420 258 L420 270"/>'+
 '<path d="M300 286 L360 286"/><path d="M300 280 L300 292"/><path d="M360 280 L360 292"/>'+
 '<path d="M156 30 L240 30"/><path d="M156 24 L156 36"/><path d="M240 24 L240 36"/>'+
'</g>',
pins:[
 {n:1, x:153, y:135, label:"Z disc", note:"The boundary of the sarcomere; thin filaments anchor here."},
 {n:2, x:198, y:30,  label:"I band", note:"Thin filaments only. Narrows during contraction."},
 {n:3, x:330, y:242, label:"Sarcomere", note:"Z disc to Z disc — the contractile unit."},
 {n:4, x:330, y:264, label:"A band", note:"Full length of the thick filaments. Never changes length."},
 {n:5, x:330, y:286, label:"H zone", note:"Thick filaments only. Narrows and can disappear."},
 {n:6, x:330, y:70,  label:"M line", note:"Holds the thick filaments in register at the center."},
 {n:7, x:270, y:180, label:"Thin filament (actin)", note:"Carries tropomyosin and troponin."},
 {n:8, x:390, y:132, label:"Thick filament (myosin)", note:"Its heads form the cross-bridges."}
]});

/* ------------------------------------------------- neuron */
DIAGRAMS.push({
id:"dg-neuron", unit:"nrv", name:"A myelinated neuron", maxw:700, w:700, h:300,
blurb:"Follow the signal left to right: received, summed, triggered, conducted, handed off.",
art:
'<g stroke="var(--line-2)" stroke-width="2.4" fill="none">'+
 '<path d="M108 150 L58 106 M58 106 L30 92 M58 106 L46 76"/>'+
 '<path d="M108 150 L56 150 M56 150 L26 140 M56 150 L28 162"/>'+
 '<path d="M108 150 L58 196 M58 196 L30 212 M58 196 L46 226"/>'+
 '<path d="M112 128 L74 88 M112 172 L74 214"/>'+
'</g>'+
'<ellipse cx="140" cy="150" rx="40" ry="36" fill="var(--surface-3)" stroke="var(--line-2)" stroke-width="1.8"/>'+
'<circle cx="140" cy="150" r="15" fill="var(--accent-soft)" stroke="var(--line-2)" stroke-width="1.4"/>'+
'<circle cx="140" cy="150" r="5" fill="var(--accent)" opacity=".7"/>'+
'<path d="M178 150 q14 -12 30 0" fill="none" stroke="var(--line-2)" stroke-width="2"/>'+
'<path d="M180 150 L560 150" stroke="var(--muted)" stroke-width="3.4" stroke-linecap="round"/>'+
'<g fill="var(--surface-3)" stroke="var(--line-2)" stroke-width="1.5">'+
 '<rect x="212" y="130" width="76" height="40" rx="19"/>'+
 '<rect x="304" y="130" width="76" height="40" rx="19"/>'+
 '<rect x="396" y="130" width="76" height="40" rx="19"/>'+
 '<rect x="488" y="130" width="60" height="40" rx="19"/>'+
'</g>'+
'<g stroke="var(--line-2)" stroke-width="2.2" fill="none">'+
 '<path d="M560 150 L600 120 M600 120 L630 110 M600 120 L624 134"/>'+
 '<path d="M560 150 L600 180 M600 180 L630 192 M600 180 L624 168"/>'+
 '<path d="M560 150 L606 150 M606 150 L634 150"/>'+
'</g>'+
'<g fill="var(--accent)" opacity=".85">'+
 '<circle cx="634" cy="108" r="5"/><circle cx="628" cy="136" r="5"/><circle cx="638" cy="150" r="5"/>'+
 '<circle cx="634" cy="194" r="5"/><circle cx="628" cy="166" r="5"/>'+
'</g>'+
'<path d="M296 150 L298 150" stroke="var(--apply)" stroke-width="8" stroke-linecap="round"/>'+
'<path d="M388 150 L390 150" stroke="var(--apply)" stroke-width="8" stroke-linecap="round"/>',
pins:[
 {n:1, x:52,  y:110, label:"Dendrites", note:"Receive input and generate graded potentials."},
 {n:2, x:140, y:150, label:"Cell body (soma)", note:"Holds the nucleus; integrates incoming signals."},
 {n:3, x:194, y:150, label:"Axon hillock", note:"The trigger zone — where threshold is tested."},
 {n:4, x:340, y:150, label:"Axon", note:"Conducts the action potential away from the soma."},
 {n:5, x:250, y:130, label:"Myelin sheath", note:"Insulation formed by Schwann cells or oligodendrocytes."},
 {n:6, x:297, y:150, label:"Node of Ranvier", note:"Bare gap where the membrane depolarizes — the jump points."},
 {n:7, x:600, y:150, label:"Axon terminals", note:"Release neurotransmitter into the synaptic cleft."},
 {n:8, x:634, y:150, label:"Synaptic vesicles", note:"Fuse and release transmitter when calcium enters."}
]});

/* ------------------------------------------------- action potential */
DIAGRAMS.push({
id:"dg-ap", unit:"nrv", name:"The action potential", maxw:640, w:640, h:400,
blurb:"Name each phase and the ion movement causing it. This graph reappears constantly.",
art:
'<g stroke="var(--line)" stroke-width="1">'+
 '<path d="M80 60 L600 60"/><path d="M80 130 L600 130"/><path d="M80 200 L600 200"/><path d="M80 270 L600 270"/><path d="M80 340 L600 340"/>'+
'</g>'+
'<path d="M80 40 L80 360" stroke="var(--line-2)" stroke-width="1.6"/>'+
'<path d="M80 340 L600 340" stroke="var(--line-2)" stroke-width="1.6"/>'+
'<g fill="var(--muted)" font-size="13" font-family="system-ui,sans-serif">'+
 '<text x="42" y="64">+30</text><text x="50" y="204">−40</text><text x="50" y="274">−55</text><text x="50" y="344">−70</text>'+
 '<text x="300" y="386">time</text>'+
 '<text x="16" y="200" transform="rotate(-90 26 200)">mV</text>'+
'</g>'+
'<path d="M80 340 L180 336" fill="none" stroke="var(--accent)" stroke-width="3.2"/>'+
'<path d="M180 336 Q214 330 232 270" fill="none" stroke="var(--accent)" stroke-width="3.2"/>'+
'<path d="M232 270 Q258 170 288 62" fill="none" stroke="var(--accent)" stroke-width="3.2"/>'+
'<path d="M288 62 Q300 48 312 62" fill="none" stroke="var(--accent)" stroke-width="3.2"/>'+
'<path d="M312 62 Q344 180 386 320" fill="none" stroke="var(--accent)" stroke-width="3.2"/>'+
'<path d="M386 320 Q400 372 434 366" fill="none" stroke="var(--accent)" stroke-width="3.2"/>'+
'<path d="M434 366 Q470 360 600 340" fill="none" stroke="var(--accent)" stroke-width="3.2"/>'+
'<path d="M80 270 L600 270" stroke="var(--apply)" stroke-width="1.6" stroke-dasharray="6 5"/>'+
'<path d="M80 340 L600 340" stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 4" opacity=".7"/>',
pins:[
 {n:1, x:130, y:336, label:"Resting membrane potential", note:"About −70 mV, held by the Na⁺/K⁺ pump and K⁺ leak."},
 {n:2, x:232, y:270, label:"Threshold", note:"About −55 mV — voltage-gated Na⁺ channels open."},
 {n:3, x:268, y:150, label:"Depolarization", note:"Na⁺ rushes in; the inside becomes positive."},
 {n:4, x:300, y:56,  label:"Peak", note:"About +30 mV; Na⁺ channels inactivate."},
 {n:5, x:352, y:230, label:"Repolarization", note:"K⁺ leaves the cell, restoring negativity."},
 {n:6, x:408, y:360, label:"Hyperpolarization", note:"K⁺ channels close slowly, so the cell overshoots downward."},
 {n:7, x:520, y:344, label:"Return to rest", note:"The pump restores the original gradients."}
]});

/* ------------------------------------------------- the cell */
DIAGRAMS.push({
id:"dg-cell", unit:"cell", name:"The animal cell", maxw:640, w:640, h:470,
blurb:"Reading organelle abundance tells you what a cell does for a living.",
art:
'<path d="M60 236 q0 -150 140 -178 q150 -30 250 10 q140 46 128 178 q-12 132 -152 168 q-150 38 -252 -6 q-114 -48 -114 -172 Z" fill="var(--surface-2)" stroke="var(--line-2)" stroke-width="2.4"/>'+
'<circle cx="250" cy="200" r="76" fill="var(--surface-3)" stroke="var(--line-2)" stroke-width="2"/>'+
'<circle cx="262" cy="188" r="26" fill="var(--accent-soft)" stroke="var(--line-2)" stroke-width="1.4"/>'+
'<g stroke="var(--line-2)" stroke-width="1.6" fill="none">'+
 '<path d="M332 168 q40 -6 54 14 q-40 12 -54 -14 Z" fill="var(--surface-3)"/>'+
 '<path d="M330 200 q46 -4 62 16 q-46 12 -62 -16 Z" fill="var(--surface-3)"/>'+
 '<path d="M328 232 q44 -4 58 16 q-44 12 -58 -16 Z" fill="var(--surface-3)"/>'+
'</g>'+
'<g fill="var(--accent)" opacity=".75">'+
 '<circle cx="344" cy="166" r="3"/><circle cx="360" cy="170" r="3"/><circle cx="376" cy="178" r="3"/>'+
 '<circle cx="342" cy="198" r="3"/><circle cx="360" cy="202" r="3"/><circle cx="380" cy="210" r="3"/>'+
 '<circle cx="340" cy="230" r="3"/><circle cx="358" cy="234" r="3"/><circle cx="374" cy="242" r="3"/>'+
 '<circle cx="176" cy="150" r="3"/><circle cx="196" cy="140" r="3"/><circle cx="160" cy="176" r="3"/>'+
'</g>'+
'<g stroke="var(--line-2)" stroke-width="1.6" fill="none">'+
 '<path d="M150 268 q34 -22 66 -2 q-34 24 -66 2 Z" fill="var(--surface-3)"/>'+
 '<path d="M146 292 q36 -22 70 -2 q-36 24 -70 2 Z" fill="var(--surface-3)"/>'+
'</g>'+
'<g fill="var(--surface-3)" stroke="var(--line-2)" stroke-width="1.6">'+
 '<path d="M420 292 q52 -16 80 4 q-52 20 -80 -4 Z"/>'+
 '<path d="M418 312 q56 -16 86 4 q-56 20 -86 -4 Z"/>'+
 '<path d="M416 332 q50 -14 78 4 q-50 18 -78 -4 Z"/>'+
'</g>'+
'<g fill="var(--accent-soft)" stroke="var(--line-2)" stroke-width="1.6">'+
 '<ellipse cx="180" cy="356" rx="46" ry="24" transform="rotate(-14 180 356)"/>'+
 '<ellipse cx="452" cy="146" rx="44" ry="23" transform="rotate(18 452 146)"/>'+
'</g>'+
'<g stroke="var(--line-2)" stroke-width="1.2" fill="none">'+
 '<path d="M146 352 q14 -12 26 0 q14 12 26 0 q14 -12 26 0"/>'+
 '<path d="M418 142 q14 -12 26 0 q14 12 26 0 q14 -12 26 0"/>'+
'</g>'+
'<circle cx="318" cy="366" r="20" fill="var(--surface-3)" stroke="var(--line-2)" stroke-width="1.6"/>'+
'<circle cx="368" cy="392" r="14" fill="var(--surface-3)" stroke="var(--line-2)" stroke-width="1.6"/>'+
'<g stroke="var(--muted)" stroke-width="3" opacity=".6">'+
 '<path d="M506 226 L506 254"/><path d="M498 226 L498 254"/><path d="M490 232 L518 232" stroke-width="2"/>'+
'</g>',
pins:[
 {n:1, x:250, y:200, label:"Nucleus", note:"Holds the DNA; bounded by a pored double envelope."},
 {n:2, x:262, y:188, label:"Nucleolus", note:"Where ribosomes are assembled."},
 {n:3, x:360, y:200, label:"Rough ER", note:"Studded with ribosomes; processes exported proteins."},
 {n:4, x:180, y:280, label:"Smooth ER", note:"Lipid synthesis, detoxification, calcium storage."},
 {n:5, x:460, y:312, label:"Golgi complex", note:"Modifies, sorts and packages into vesicles."},
 {n:6, x:180, y:356, label:"Mitochondrion", note:"Aerobic ATP production; has its own DNA."},
 {n:7, x:318, y:366, label:"Lysosome", note:"Digestive enzymes for worn organelles and engulfed material."},
 {n:8, x:506, y:240, label:"Centrioles", note:"Organize the mitotic spindle."},
 {n:9, x:176, y:150, label:"Free ribosomes", note:"Make proteins used inside the cell."},
 {n:10,x:110, y:150, label:"Plasma membrane", note:"Fluid bilayer with proteins; controls what enters and leaves."}
]});

/* ------------------------------------------------- plasma membrane */
DIAGRAMS.push({
id:"dg-mem", unit:"cell", name:"The plasma membrane", maxw:660, w:660, h:320,
blurb:"Every transport question starts here: what can slip through the tails, and what needs a protein.",
art:
'<g fill="var(--accent-soft)" stroke="var(--line-2)" stroke-width="1.2">'+
 '<circle cx="60" cy="112" r="11"/><circle cx="92" cy="112" r="11"/><circle cx="124" cy="112" r="11"/><circle cx="156" cy="112" r="11"/>'+
 '<circle cx="284" cy="112" r="11"/><circle cx="316" cy="112" r="11"/><circle cx="348" cy="112" r="11"/>'+
 '<circle cx="452" cy="112" r="11"/><circle cx="484" cy="112" r="11"/><circle cx="516" cy="112" r="11"/><circle cx="596" cy="112" r="11"/>'+
'</g>'+
'<g stroke="var(--muted)" stroke-width="2" fill="none" stroke-linecap="round">'+
 '<path d="M56 124 q-4 22 2 40 M66 124 q4 22 -2 40"/><path d="M88 124 q-4 22 2 40 M98 124 q4 22 -2 40"/>'+
 '<path d="M120 124 q-4 22 2 40 M130 124 q4 22 -2 40"/><path d="M152 124 q-4 22 2 40 M162 124 q4 22 -2 40"/>'+
 '<path d="M280 124 q-4 22 2 40 M290 124 q4 22 -2 40"/><path d="M312 124 q-4 22 2 40 M322 124 q4 22 -2 40"/>'+
 '<path d="M344 124 q-4 22 2 40 M354 124 q4 22 -2 40"/>'+
 '<path d="M448 124 q-4 22 2 40 M458 124 q4 22 -2 40"/><path d="M480 124 q-4 22 2 40 M490 124 q4 22 -2 40"/>'+
 '<path d="M512 124 q-4 22 2 40 M522 124 q4 22 -2 40"/><path d="M592 124 q-4 22 2 40 M602 124 q4 22 -2 40"/>'+
'</g>'+
'<g stroke="var(--muted)" stroke-width="2" fill="none" stroke-linecap="round">'+
 '<path d="M56 216 q-4 -22 2 -40 M66 216 q4 -22 -2 -40"/><path d="M88 216 q-4 -22 2 -40 M98 216 q4 -22 -2 -40"/>'+
 '<path d="M120 216 q-4 -22 2 -40 M130 216 q4 -22 -2 -40"/><path d="M152 216 q-4 -22 2 -40 M162 216 q4 -22 -2 -40"/>'+
 '<path d="M280 216 q-4 -22 2 -40 M290 216 q4 -22 -2 -40"/><path d="M312 216 q-4 -22 2 -40 M322 216 q4 -22 -2 -40"/>'+
 '<path d="M344 216 q-4 -22 2 -40 M354 216 q4 -22 -2 -40"/>'+
 '<path d="M448 216 q-4 -22 2 -40 M458 216 q4 -22 -2 -40"/><path d="M480 216 q-4 -22 2 -40 M490 216 q4 -22 -2 -40"/>'+
 '<path d="M512 216 q-4 -22 2 -40 M522 216 q4 -22 -2 -40"/><path d="M592 216 q-4 -22 2 -40 M602 216 q4 -22 -2 -40"/>'+
'</g>'+
'<g fill="var(--accent-soft)" stroke="var(--line-2)" stroke-width="1.2">'+
 '<circle cx="60" cy="228" r="11"/><circle cx="92" cy="228" r="11"/><circle cx="124" cy="228" r="11"/><circle cx="156" cy="228" r="11"/>'+
 '<circle cx="284" cy="228" r="11"/><circle cx="316" cy="228" r="11"/><circle cx="348" cy="228" r="11"/>'+
 '<circle cx="452" cy="228" r="11"/><circle cx="484" cy="228" r="11"/><circle cx="516" cy="228" r="11"/><circle cx="596" cy="228" r="11"/>'+
'</g>'+
'<path d="M186 96 q42 -8 62 16 q18 24 2 52 q-14 26 4 52 q16 22 -4 44 q-28 26 -66 8 Z" fill="var(--surface-3)" stroke="var(--line-2)" stroke-width="1.8"/>'+
'<path d="M212 96 L212 268" stroke="var(--surface)" stroke-width="16" stroke-linecap="round"/>'+
'<path d="M212 96 L212 268" stroke="var(--line-2)" stroke-width="1" stroke-dasharray="4 5"/>'+
'<path d="M378 104 q46 -4 58 32 q10 34 -10 62 q-22 30 -52 22 q-30 -10 -28 -58 q2 -50 32 -58 Z" fill="var(--surface-3)" stroke="var(--line-2)" stroke-width="1.8"/>'+
'<g stroke="var(--line-2)" stroke-width="1.6" fill="none">'+
 '<path d="M400 104 q6 -22 -8 -32"/><path d="M392 72 q-16 -4 -20 -18"/><path d="M392 72 q14 -10 12 -26"/>'+
'</g>'+
'<rect x="544" y="130" width="14" height="80" rx="7" fill="var(--surface-3)" stroke="var(--line-2)" stroke-width="1.4"/>'+
'<path d="M96 258 q40 22 84 0" fill="none" stroke="var(--line-2)" stroke-width="2.6"/>'+
'<g fill="var(--accent)" opacity=".8"><circle cx="212" cy="76" r="6"/><circle cx="212" cy="290" r="6"/></g>'+
'<path d="M212 62 L212 88" stroke="var(--accent)" stroke-width="2" marker-end=""/>'+
'<path d="M212 276 L212 302" stroke="var(--accent)" stroke-width="2"/>',
pins:[
 {n:1, x:92,  y:112, label:"Phospholipid head", note:"Polar and attracted to water — faces the watery surfaces."},
 {n:2, x:92,  y:170, label:"Fatty acid tails", note:"Nonpolar; they turn inward, away from water."},
 {n:3, x:212, y:180, label:"Channel protein", note:"A water-filled pore — the route for ions and water."},
 {n:4, x:396, y:170, label:"Glycoprotein", note:"Carbohydrate chains form the glycocalyx — cell identity."},
 {n:5, x:551, y:170, label:"Cholesterol", note:"Buffers membrane fluidity in both directions."},
 {n:6, x:138, y:262, label:"Peripheral protein", note:"Attached to one surface rather than spanning the membrane."},
 {n:7, x:212, y:290, label:"Cytoplasm side", note:"The inside of the cell."},
 {n:8, x:212, y:64,  label:"Extracellular side", note:"Where the glycocalyx faces."}
]});

})();
