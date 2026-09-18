(function(){
"use strict";
var G = (typeof window !== "undefined") ? window : global;
var PLATES = [];
G.__PLATES = PLATES;

/* Public-domain plates, mostly from Gray's Anatomy (1918). Each was checked
   by eye before being added. Old terms on the plates are translated in the
   caption. `find` lists what to locate on the plate. */
var GRAY = "Gray's Anatomy, 20th ed. (1918). Public domain.";

PLATES.push({id:"pl-skin", unit:"skin", file:"img/gray944-skin.png", name:"Skin in section, with a hair follicle", credit:GRAY,
  caption:"Old names on the plate: <i>stratum germinativum</i> is the stratum basale and <i>stratum mucosum</i> is the stratum spinosum. Follow the hair down to its bulb and papilla, and notice the sebaceous gland opening into the follicle with the arrector pili muscle angled beside it.",
  find:["Stratum corneum","Stratum basale","Sebaceous gland","Arrector pili","Hair bulb and papilla","Dermis"]});

PLATES.push({id:"pl-bone", unit:"bone", file:"img/gray73-compact-bone.png", name:"Compact bone, transverse section", credit:GRAY,
  caption:"Three osteons cut across. The dark openings are central (Haversian) canals, the rings around them are concentric lamellae, and the spidery dark marks between the rings are lacunae with their canaliculi reaching toward the canal.",
  find:["Central canal","Concentric lamellae","Lacunae","Canaliculi"]});

PLATES.push({id:"pl-knee", unit:"jnt", file:"img/gray350-knee.png", name:"Knee joint, sagittal section", credit:GRAY,
  caption:"A synovial joint seen from the side. Find the two menisci wedged between femur and tibia, the patella in front with the patellar ligament below it, the infrapatellar fat pad, and two bursae — one above the patella under the quadriceps, one below the patellar ligament.",
  find:["Femur","Tibia","Patella","Medial meniscus","Patellar ligament","Bursa under quadriceps","Infrapatellar fat pad"]});

PLATES.push({id:"pl-muscle", unit:"mus", file:"img/gray375-muscle-fiber.png", name:"Striated muscle fiber", credit:GRAY,
  caption:"A: part of one fiber magnified about 800 times. The alternating light and dark bands are the I and A bands of sarcomeres lined up in register. B: myofibrils teased apart — each carries the same stripes, which shows the striations belong to the myofibrils, not to the fiber as a whole.",
  find:["A band (dark)","I band (light)","Individual myofibrils"]});

PLATES.push({id:"pl-neuron", unit:"nrv", file:"img/gray626-neuron.png", name:"A motor nerve cell", credit:GRAY,
  caption:"A multipolar neuron from the ventral horn of the spinal cord: many dendrites, a single axon (labeled), and a large nucleus with a dark nucleolus. The granular material in the cell body is rough ER — this cell synthesizes protein constantly.",
  find:["Dendrites","Axon","Nucleus and nucleolus","Cell body"]});

PLATES.push({id:"pl-fiber", unit:"nrv", file:"img/gray631-nerve-fiber.png", name:"Myelinated nerve fibers", credit:GRAY,
  caption:"Old names: <i>axis-cylinder</i> is the axon, <i>medullary sheath</i> is the myelin, and <i>neurolemma</i> is the outer membrane of the Schwann cell. The node of Ranvier is the pinch where the sheath is interrupted — the only place the membrane can depolarize.",
  find:["Axon (axis-cylinder)","Myelin (medullary sheath)","Node of Ranvier","Schwann cell nucleus"]});

PLATES.push({id:"pl-cord", unit:"nrv", file:"img/spinal-cord-section.png", name:"Spinal cord and meninges, transverse section", credit:"After Gray's Anatomy, in Encyclopædia Britannica, 11th ed. (1911). Public domain.",
  caption:"The H-shaped gray matter sits inside the white matter. Around it, from inside out: pia mater, the subarachnoid space (cerebrospinal fluid), arachnoid, the subdural space, and the tough dura mater. Spinal nerve roots leave laterally.",
  find:["Gray matter","White matter","Pia mater","Subarachnoid space","Dura mater","Spinal nerve"]});

PLATES.push({id:"pl-eye", unit:"sen", file:"img/gray869-eye.png", name:"Horizontal section of the eyeball", credit:GRAY,
  caption:"Light travels cornea → anterior chamber → pupil → lens → vitreous body → retina. The three coats are labeled at the right edge: sclera outside, choroid, retina inside. The fovea centralis sits directly opposite the lens; the optic nerve leaves slightly to one side of it.",
  find:["Cornea","Iris","Lens","Ciliary body","Vitreous body","Retina","Choroid","Sclera","Fovea centralis","Optic nerve"]});

PLATES.push({id:"pl-ear", unit:"sen", file:"img/gray923-cochlea.png", name:"The cochlea and vestibule", credit:GRAY,
  caption:"The bony labyrinth opened from above. The coiled cochlea is at the left with its two fluid channels marked in red (scala vestibuli and scala tympani), meeting at the apex at the helicotrema. The vestibule and the openings of the semicircular canals are to the right.",
  find:["Cochlea","Scala vestibuli","Scala tympani","Helicotrema","Vestibule","Semicircular canal"]});

})();
