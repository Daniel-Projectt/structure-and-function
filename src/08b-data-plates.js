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

/* ---- whole-body figures: regions, skeleton, muscles ---- */
var LOH = "Mariana Ruiz Villarreal (LadyofHats), via Wikimedia Commons. Public domain.";

PLATES.push({id:"pl-skel-num", unit:"bone", file:"img/skeleton-front-numbered.png", name:"The skeleton, numbered", credit:LOH,
  caption:"Red numbers point to single bones; blue numbers point to groups. Cover the list and name each number before you check. Then use the quiz — it asks the numbers in random order.",
  key:[
   {n:1,  label:"Vertebral (spinal) column", note:"the whole stack, cervical through coccyx"},
   {n:2,  label:"Cervical vertebrae", note:"seven, in the neck"},
   {n:3,  label:"Thoracic vertebrae", note:"twelve, each carrying a pair of ribs"},
   {n:4,  label:"Lumbar vertebrae", note:"five, the largest"},
   {n:5,  label:"Sacrum", note:"five fused vertebrae wedged between the hip bones"},
   {n:6,  label:"Coccyx", note:"the tailbone"},
   {n:7,  label:"Skull", note:"cranium plus mandible"},
   {n:8,  label:"Cranium", note:"the braincase"},
   {n:9,  label:"Mandible", note:"the only movable bone of the skull"},
   {n:10, label:"Clavicle", note:"the collarbone; braces the shoulder"},
   {n:11, label:"Manubrium", note:"the upper part of the sternum"},
   {n:12, label:"Sternum (body)", note:"the breastbone"},
   {n:13, label:"Scapula", note:"the shoulder blade, seen here past the ribs"},
   {n:14, label:"Humerus", note:"the arm bone"},
   {n:15, label:"Ribs", note:"twelve pairs"},
   {n:16, label:"Pelvic girdle", note:"the two hip bones"},
   {n:17, label:"Radius", note:"lateral forearm bone — on the thumb side"},
   {n:18, label:"Ulna", note:"medial forearm bone — forms the point of the elbow"},
   {n:19, label:"Carpals", note:"eight wrist bones"},
   {n:20, label:"Metacarpals", note:"the palm"},
   {n:21, label:"Phalanges (hand)", note:"finger bones"},
   {n:22, label:"Femur", note:"the thigh bone, longest in the body"},
   {n:23, label:"Patella", note:"the kneecap"},
   {n:24, label:"Tibia", note:"the shin; medial and weight-bearing"},
   {n:25, label:"Fibula", note:"lateral and slender; not weight-bearing"},
   {n:26, label:"Tarsals", note:"seven ankle bones"},
   {n:27, label:"Metatarsals", note:"the sole"},
   {n:28, label:"Phalanges (foot)", note:"toe bones"}]});

PLATES.push({id:"pl-skel-front", unit:"bone", file:"img/skeleton-front-labeled.png", name:"The skeleton, anterior view, labeled", credit:LOH,
  caption:"The answer key to the numbered figure. Notice the manubrium sitting on top of the sternum, the scapula peeking out lateral to the ribs, and that the radius lies on the thumb side with the palms facing forward.",
  find:["Manubrium","Sternum","Scapula","Radius","Ulna","Sacrum","Coccyx","Pelvic girdle"]});

PLATES.push({id:"pl-skel-back", unit:"bone", file:"img/skeleton-back-labeled.png", name:"The skeleton, posterior view, labeled", credit:LOH,
  caption:"From behind the scapulae sit fully in view, the atlas (C1) is visible under the skull, and the calcaneus — the heel bone, largest of the tarsals — is labeled. The vertebral column shows its spinous processes running down the midline.",
  find:["Atlas (C1)","Scapula","Spinous processes","Sacrum","Calcaneus","Olecranon region of the ulna"]});

PLATES.push({id:"pl-muscles", unit:"mus", file:"img/muscles-anterior.png", name:"Major muscles, anterior view", wide:true,
  credit:"Mikael Häggström, assembled from Gray's Anatomy plates, via Wikimedia Commons. Public domain.",
  caption:"The superficial muscles you can name by looking at someone. The left side of the figure shows the surface layer (pectoralis major, deltoid); the right side has it peeled back to show the rotator cuff, brachialis and the ribs. Match each label to its action with the Major muscles set.",
  find:["Deltoid","Pectoralis major","Rectus abdominis","External oblique","Biceps brachii","Brachialis","Iliopsoas","Quadriceps femoris","Adductor muscles","Tibialis anterior"]});

})();
