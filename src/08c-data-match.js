(function(){
"use strict";
var G = (typeof window !== "undefined") ? window : global;
var SETS = [];
G.__MATCHSETS = SETS;

/* Structure sets: the "what is this / where is it" half of the course.
   Each set feeds the Match tab. Sets marked drill:true also become
   flashcards and recall questions, so the names get spaced repetition too. */

SETS.push({id:"ms-regions", unit:"org", name:"Body regions — anatomical term to plain name", left:"Term", right:"Plain name", drill:true,
  why:"Clinicians and textbooks use the Latin regional terms; you must be able to go both ways without thinking.",
  pairs:[
   ["Cephalic","Head"],["Cervical","Neck"],["Thoracic","Chest"],["Axillary","Armpit"],["Brachial","Arm (shoulder to elbow)"],
   ["Antecubital","Front of the elbow"],["Olecranal","Back of the elbow"],["Antebrachial","Forearm"],["Carpal","Wrist"],
   ["Manual","Hand"],["Pollex","Thumb"],["Digital","Fingers or toes"],["Abdominal","Abdomen"],["Umbilical","Navel"],
   ["Pelvic","Pelvis"],["Inguinal","Groin"],["Pubic","Genital region"],["Coxal","Hip"],["Gluteal","Buttock"],
   ["Femoral","Thigh"],["Patellar","Front of the knee"],["Popliteal","Back of the knee"],["Crural","Leg (knee to ankle), shin"],
   ["Sural","Calf"],["Tarsal","Ankle"],["Pedal","Foot"],["Plantar","Sole of the foot"],["Calcaneal","Heel"],["Hallux","Big toe"],
   ["Frontal","Forehead"],["Orbital","Eye"],["Otic","Ear"],["Nasal","Nose"],["Buccal","Cheek"],["Oral","Mouth"],["Mental","Chin"],
   ["Occipital","Back of the head"],["Acromial","Point of the shoulder"],["Scapular","Shoulder blade"],["Vertebral","Spine"],
   ["Lumbar","Lower back"],["Sacral","Between the hips"],["Sternal","Breastbone"],["Mammary","Breast"],["Dorsal","Back"]]});

SETS.push({id:"ms-direction", unit:"org", name:"Directional terms", left:"Term", right:"Meaning", drill:false,
  pairs:[
   ["Superior","Toward the head"],["Inferior","Toward the feet"],["Anterior (ventral)","Toward the front"],["Posterior (dorsal)","Toward the back"],
   ["Medial","Toward the midline"],["Lateral","Away from the midline"],["Proximal","Closer to the limb's attachment"],["Distal","Farther from the limb's attachment"],
   ["Superficial","Closer to the surface"],["Deep","Farther beneath the surface"],["Ipsilateral","On the same side"],["Contralateral","On the opposite side"],
   ["Intermediate","Between two structures"],["Cranial","Toward the skull"],["Caudal","Toward the tail end"]]});

SETS.push({id:"ms-cavities", unit:"org", name:"Organs — where they live", left:"Organ", right:"Cavity or region", drill:false,
  pairs:[
   ["Brain","Cranial cavity"],["Spinal cord","Vertebral canal"],["Lungs","Pleural cavities"],["Heart","Pericardial cavity, in the mediastinum"],
   ["Esophagus and trachea","Mediastinum"],["Stomach","Abdominal cavity, left upper quadrant"],["Liver and gallbladder","Abdominal cavity, right upper quadrant"],
   ["Appendix","Abdominal cavity, right lower quadrant"],["Sigmoid colon","Abdominal cavity, left lower quadrant"],["Urinary bladder","Pelvic cavity"],
   ["Rectum","Pelvic cavity"],["Uterus and ovaries","Pelvic cavity"],["Kidneys","Behind the peritoneum (retroperitoneal)"],["Spleen","Left upper quadrant"]]});

SETS.push({id:"ms-molecules", unit:"chem", name:"Molecules — what class, what job", left:"Molecule", right:"Class and role", drill:false,
  pairs:[
   ["Glucose","Monosaccharide; fast fuel"],["Glycogen","Polysaccharide; short-term glucose store"],["Triglyceride","Lipid; long-term energy store"],
   ["Phospholipid","Lipid; builds membranes"],["Cholesterol","Steroid lipid; membranes and hormone precursor"],["Enzyme","Protein; catalyst"],
   ["Hemoglobin","Protein; oxygen transport"],["Collagen","Protein; structural fiber"],["DNA","Nucleic acid; stores instructions"],
   ["RNA","Nucleic acid; carries and reads instructions"],["ATP","Nucleotide; energy currency"],["Bicarbonate","Ion; main blood buffer"],
   ["Sodium chloride","Electrolyte; dissociates into ions"],["Water","Polar solvent; high heat capacity"]]});

SETS.push({id:"ms-organelles", unit:"cell", name:"Organelles — structure to job", left:"Structure", right:"Job", drill:false,
  pairs:[
   ["Nucleus","Holds the DNA"],["Nucleolus","Assembles ribosomes"],["Ribosome","Builds proteins"],["Rough ER","Processes proteins for export"],
   ["Smooth ER","Makes lipids, detoxifies, stores calcium"],["Golgi complex","Modifies, sorts and packages"],["Lysosome","Digests worn parts and invaders"],
   ["Peroxisome","Neutralizes free radicals"],["Mitochondrion","Makes ATP aerobically"],["Centrioles","Organize the spindle"],
   ["Cilia","Sweep material across the surface"],["Microvilli","Increase absorptive surface"],["Flagellum","Propels the cell"],
   ["Plasma membrane","Controls what enters and leaves"],["Cytoskeleton","Shape, movement, internal transport"]]});

SETS.push({id:"ms-transport", unit:"cell", name:"Transport — mechanism to example", left:"Mechanism", right:"Example", drill:false,
  pairs:[
   ["Simple diffusion","Oxygen crossing the alveolar wall"],["Facilitated diffusion","Glucose entering a cell through a carrier"],["Osmosis","Water entering a cell in a hypotonic solution"],
   ["Primary active transport","The sodium-potassium pump"],["Secondary active transport","Glucose absorption in the intestine, riding sodium"],
   ["Phagocytosis","A white blood cell engulfing a bacterium"],["Pinocytosis","A cell sipping extracellular fluid"],
   ["Receptor-mediated endocytosis","Cholesterol uptake via LDL receptors"],["Exocytosis","A neuron releasing neurotransmitter"]]});

SETS.push({id:"ms-genetics", unit:"gene", name:"Genetics — term to meaning", left:"Term", right:"Meaning", drill:false,
  pairs:[
   ["Codon","Three mRNA bases naming one amino acid"],["Anticodon","The matching triplet on tRNA"],["Transcription","DNA read into mRNA, in the nucleus"],
   ["Translation","mRNA read into protein, at a ribosome"],["Replication","DNA copied before division"],["Point mutation","One base swapped"],
   ["Frameshift mutation","A base inserted or deleted"],["S phase","DNA is replicated"],["Metaphase","Chromosomes line up at the equator"],
   ["Anaphase","Sister chromatids pulled apart"],["Cytokinesis","The cytoplasm divides"],["Apoptosis","Programmed, tidy cell death"],
   ["Necrosis","Death by injury, with inflammation"],["Meiosis","Produces four haploid gametes"]]});

SETS.push({id:"ms-tissues", unit:"tis", name:"Tissues — where you find them", left:"Tissue", right:"Location", drill:true,
  why:"Histology questions almost always ask location or function — knowing where a tissue lives is knowing why it looks the way it does.",
  pairs:[
   ["Simple squamous epithelium","Alveoli, capillaries, serous membranes"],["Simple cuboidal epithelium","Kidney tubules, gland ducts"],
   ["Simple columnar epithelium","Lining of stomach and intestines"],["Pseudostratified ciliated columnar","Trachea and bronchi"],
   ["Stratified squamous, keratinized","Epidermis"],["Stratified squamous, non-keratinized","Mouth, esophagus, vagina"],
   ["Transitional epithelium","Urinary bladder, ureters"],["Areolar connective tissue","Beneath epithelia, around organs"],
   ["Adipose tissue","Hypodermis, around kidneys"],["Dense regular connective tissue","Tendons and ligaments"],
   ["Dense irregular connective tissue","Dermis, organ capsules"],["Hyaline cartilage","Joint surfaces, ribs, nose, trachea"],
   ["Elastic cartilage","External ear, epiglottis"],["Fibrocartilage","Intervertebral discs, menisci"],["Bone","The skeleton"],
   ["Blood","Inside vessels"],["Skeletal muscle","Attached to bones"],["Cardiac muscle","Heart wall"],["Smooth muscle","Walls of hollow organs and vessels"],
   ["Nervous tissue","Brain, spinal cord, nerves"]]});

SETS.push({id:"ms-skin", unit:"skin", name:"Skin — structure to role", left:"Structure", right:"Role", drill:false,
  pairs:[
   ["Keratinocyte","Makes keratin; the barrier cell"],["Melanocyte","Makes pigment that shields from UV"],["Dendritic cell","Immune surveillance in the epidermis"],
   ["Tactile (Merkel) cell","Light-touch sensation"],["Stratum basale","The dividing layer"],["Stratum corneum","Dead, keratinized barrier"],
   ["Dermal papillae","Fingerprints; bring capillaries near the epidermis"],["Reticular dermis","Strength from collagen in every direction"],
   ["Hypodermis","Fat: insulation, cushioning, anchoring"],["Eccrine sweat gland","Watery sweat for cooling"],["Apocrine sweat gland","Scent sweat in axilla and groin"],
   ["Sebaceous gland","Oily sebum into the hair follicle"],["Arrector pili","Raises the hair; goose bumps"],["Hair follicle","Epidermis dipping into the dermis"],
   ["Nail matrix","Where the nail grows"]]});

SETS.push({id:"ms-bones", unit:"bone", name:"Bones — name to location", left:"Bone", right:"Where it is", drill:true,
  why:"The major bones are pure recognition. Get them automatic so exam time goes to the harder material.",
  pairs:[
   ["Frontal bone","Forehead and roof of the orbits"],["Parietal bones","Top and upper sides of the skull"],["Temporal bones","Sides of the skull around the ear"],
   ["Occipital bone","Back and base of the skull"],["Sphenoid bone","Butterfly-shaped, floor of the skull; holds the pituitary"],
   ["Ethmoid bone","Between the orbits; roof of the nasal cavity"],["Mandible","Lower jaw — the only movable skull bone"],["Maxillae","Upper jaw"],
   ["Zygomatic bones","Cheekbones"],["Nasal bones","Bridge of the nose"],["Hyoid bone","In the neck; touches no other bone"],
   ["Cervical vertebrae","Seven bones of the neck"],["Thoracic vertebrae","Twelve; each carries a pair of ribs"],["Lumbar vertebrae","Five, the largest; lower back"],
   ["Sacrum","Five fused vertebrae joining the hip bones"],["Coccyx","Tailbone"],["Sternum","Breastbone"],["Ribs","Twelve pairs; the last two float"],
   ["Clavicle","Collarbone"],["Scapula","Shoulder blade"],["Humerus","Arm, shoulder to elbow"],["Radius","Forearm, thumb side"],
   ["Ulna","Forearm, little-finger side; forms the elbow point"],["Carpals","Eight wrist bones"],["Metacarpals","Palm of the hand"],
   ["Phalanges","Finger and toe bones"],["Ilium","Flared upper part of the hip bone"],["Ischium","The part of the hip bone you sit on"],
   ["Pubis","Front of the hip bone"],["Femur","Thigh; longest bone"],["Patella","Kneecap"],["Tibia","Shin; medial, weight-bearing leg bone"],
   ["Fibula","Lateral, slender leg bone; not weight-bearing"],["Tarsals","Seven ankle bones"],["Talus","Ankle bone that meets the tibia"],
   ["Calcaneus","Heel bone"],["Metatarsals","Sole of the foot"]]});

SETS.push({id:"ms-markings", unit:"bone", name:"Bone markings", left:"Marking", right:"Meaning", drill:true,
  why:"The same dozen words are reused on every bone in the body. Learn them once and every bone becomes readable.",
  pairs:[
   ["Foramen","Round opening for vessels or nerves"],["Fossa","Shallow depression"],["Condyle","Rounded knob that forms a joint"],
   ["Epicondyle","Bump above a condyle where muscles attach"],["Trochanter","Very large projection; femur only"],["Tubercle","Small rounded projection"],
   ["Tuberosity","Large rough projection"],["Process","Any bony projection"],["Crest","Narrow ridge"],["Spine","Sharp, slender projection"],
   ["Head","Rounded end on a narrow neck; forms a joint"],["Meatus","Canal or passageway"],["Sinus","Air-filled cavity within a bone"],
   ["Facet","Small, smooth, flat joint surface"],["Fissure","Narrow slit for vessels or nerves"],["Sulcus","Groove for a vessel, nerve or tendon"]]});

SETS.push({id:"ms-joints", unit:"jnt", name:"Joints — type to example", left:"Joint type", right:"Example", drill:false,
  pairs:[
   ["Hinge","Elbow, knee, finger joints"],["Pivot","Atlas on axis; proximal radioulnar"],["Ball-and-socket","Shoulder, hip"],["Saddle","Thumb carpometacarpal"],
   ["Condylar","Knuckles, wrist"],["Plane (gliding)","Between the carpals"],["Suture","Between skull bones"],["Symphysis","Pubic symphysis, intervertebral discs"],
   ["Synchondrosis","Epiphyseal plate, first rib to sternum"],["Syndesmosis","Distal tibia to fibula"],["Gomphosis","Tooth in its socket"]]});

SETS.push({id:"ms-moves", unit:"jnt", name:"Movements", left:"Movement", right:"What it does", drill:false,
  pairs:[
   ["Flexion","Decreases the angle at a joint"],["Extension","Increases the angle at a joint"],["Abduction","Moves away from the midline"],["Adduction","Moves toward the midline"],
   ["Circumduction","Traces a cone; distal end draws a circle"],["Rotation","Turns around the long axis"],["Supination","Palm turns to face forward"],["Pronation","Palm turns to face backward"],
   ["Dorsiflexion","Toes lift toward the shin"],["Plantar flexion","Toes point down; standing on tiptoe"],["Inversion","Sole turns inward"],["Eversion","Sole turns outward"],
   ["Elevation","Lifts a part superiorly; shrugging"],["Depression","Lowers a part; opening the mouth"],["Protraction","Moves a part forward; jutting the jaw"],["Retraction","Pulls a part backward"],
   ["Opposition","Thumb touches the fingertips"]]});

SETS.push({id:"ms-muscles", unit:"mus", name:"Major muscles — name to action and place", left:"Muscle", right:"Action and location", drill:true,
  why:"Muscle names are built from location, shape, size and action — once you can decode a name, the muscle tells you what it does.",
  pairs:[
   ["Frontalis","Raises the eyebrows; forehead"],["Orbicularis oculi","Closes the eye"],["Orbicularis oris","Closes and puckers the lips"],
   ["Masseter","Closes the jaw; chewing"],["Temporalis","Closes the jaw; side of the head"],["Sternocleidomastoid","Flexes and rotates the head; neck strap"],
   ["Trapezius","Elevates, retracts and rotates the scapula; upper back"],["Deltoid","Abducts the arm; cap of the shoulder"],
   ["Pectoralis major","Adducts and flexes the arm; chest"],["Latissimus dorsi","Extends and adducts the arm; broad back muscle"],
   ["Serratus anterior","Protracts the scapula; boxer's muscle"],["Rotator cuff","Four muscles that stabilize the shoulder"],
   ["Biceps brachii","Flexes the elbow, supinates the forearm"],["Triceps brachii","Extends the elbow; back of the arm"],["Brachialis","Flexes the elbow; deep to biceps"],
   ["Rectus abdominis","Flexes the trunk; the six-pack"],["External oblique","Rotates and flexes the trunk; side of the abdomen"],
   ["Transversus abdominis","Compresses the abdomen; deepest layer"],["Diaphragm","The main muscle of breathing"],["Intercostals","Move the ribs in breathing"],
   ["Erector spinae","Extends the spine; keeps you upright"],["Iliopsoas","Flexes the thigh at the hip"],["Gluteus maximus","Extends the thigh; climbing and standing up"],
   ["Gluteus medius","Abducts the thigh; steadies the pelvis when walking"],["Adductor group","Adducts the thigh; inner thigh"],
   ["Sartorius","Longest muscle; crosses the thigh; sitting cross-legged"],["Quadriceps femoris","Extends the knee; front of the thigh"],
   ["Hamstrings","Flex the knee and extend the thigh; back of the thigh"],["Tibialis anterior","Dorsiflexes the foot; shin"],
   ["Gastrocnemius","Plantar flexes the foot; the calf"],["Soleus","Plantar flexes; deep to gastrocnemius"],["Achilles (calcaneal) tendon","Attaches the calf muscles to the heel"]]});

SETS.push({id:"ms-naming", unit:"mus", name:"Decoding muscle names", left:"Name part", right:"Meaning", drill:false,
  pairs:[
   ["Rectus","Straight fibers"],["Oblique","Diagonal fibers"],["Transversus","Fibers running across"],["Maximus","Largest"],["Minimus","Smallest"],
   ["Longus","Long"],["Brevis","Short"],["Biceps","Two heads"],["Triceps","Three heads"],["Quadriceps","Four heads"],["Deltoid","Triangular"],
   ["Trapezius","Trapezoid-shaped"],["Brachii","Of the arm"],["Femoris","Of the thigh"],["Abductor","Moves away from the midline"],["Adductor","Moves toward the midline"],
   ["Flexor","Bends a joint"],["Extensor","Straightens a joint"],["Levator","Lifts"],["Sternocleidomastoid","Named for its attachments: sternum, clavicle, mastoid process"]]});

SETS.push({id:"ms-brain", unit:"nrv", name:"Brain regions — what each does", left:"Region", right:"Job", drill:true,
  why:"Localizing a deficit to a brain region is one of the most common second-order questions in neuro.",
  pairs:[
   ["Frontal lobe","Planning, judgment, voluntary movement, speech production"],["Parietal lobe","Touch and body-position sensation"],
   ["Occipital lobe","Vision"],["Temporal lobe","Hearing, smell, memory formation"],["Primary motor cortex","Initiates voluntary movement; precentral gyrus"],
   ["Primary somatosensory cortex","Receives touch; postcentral gyrus"],["Broca's area","Producing speech"],["Wernicke's area","Understanding language"],
   ["Cerebellum","Coordination, balance, timing"],["Thalamus","Relay station for sensory input to the cortex"],["Hypothalamus","Homeostasis; controls the pituitary"],
   ["Hippocampus","Forming new memories"],["Amygdala","Fear and emotional memory"],["Midbrain","Visual and auditory reflexes"],
   ["Pons","Bridge between cerebellum and cerebrum; helps regulate breathing"],["Medulla oblongata","Heart rate, blood pressure, breathing"],
   ["Corpus callosum","Connects the two hemispheres"],["Basal nuclei","Start and stop movement; smooth it out"]]});

SETS.push({id:"ms-glia", unit:"nrv", name:"Neuroglia and neuron parts", left:"Cell or part", right:"Job", drill:false,
  pairs:[
   ["Astrocyte","Supports neurons; forms the blood-brain barrier"],["Microglia","Immune defense inside the CNS"],["Ependymal cell","Lines ventricles; circulates CSF"],
   ["Oligodendrocyte","Myelinates axons in the CNS"],["Schwann cell","Myelinates axons in the PNS"],["Satellite cell","Surrounds cell bodies in ganglia"],
   ["Dendrite","Receives signals"],["Axon hillock","Trigger zone; where threshold is tested"],["Axon","Conducts the impulse away"],
   ["Node of Ranvier","Gap in myelin where the impulse jumps"],["Axon terminal","Releases neurotransmitter"],["Synaptic cleft","Gap the transmitter must cross"]]});

SETS.push({id:"ms-eye-ear", unit:"sen", name:"Eye and ear — structure to function", left:"Structure", right:"Function", drill:true,
  why:"Sense-organ questions are nearly all structure-to-function. Two organs, about twenty parts.",
  pairs:[
   ["Cornea","Bends most of the incoming light"],["Sclera","Tough white protective coat"],["Choroid","Vascular layer; feeds the retina"],["Iris","Controls pupil size"],
   ["Pupil","The opening that admits light"],["Lens","Fine-tunes focus; changes shape"],["Ciliary body","Changes lens shape; makes aqueous humor"],
   ["Retina","Holds the photoreceptors"],["Fovea centralis","Sharpest vision; all cones"],["Optic disc","Blind spot; optic nerve exits"],
   ["Rods","Dim light, peripheral vision, no color"],["Cones","Color and detail in bright light"],["Vitreous body","Gel that holds the eyeball's shape"],
   ["Tympanic membrane","Eardrum; vibrates with sound"],["Malleus, incus, stapes","Ossicles; amplify vibration to the oval window"],
   ["Cochlea","Hearing; hair cells in the organ of Corti"],["Semicircular canals","Rotational balance"],["Utricle and saccule","Linear acceleration and head position"],
   ["Auditory (Eustachian) tube","Equalizes middle-ear pressure"],["Auricle (pinna)","Funnels sound into the canal"]]});

})();
