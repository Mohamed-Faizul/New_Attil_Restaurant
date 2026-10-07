/* ============================================================================
 * ATTIL — CENTRAL DATA FILE
 * ============================================================================
 * Everything you may want to edit lives here:
 *   logo / images / address / phone / hours / map / socials / menu /
 *   gallery / big words / finale items.
 *
 * Image paths point into /public/images (downloaded from the restaurant's
 * own website). Drop a new file into public/images and update the path
 * below — no component changes needed.
 *
 * NOTE: placeholders are marked with `// EDIT:` — replace when you have the
 * final links/hours. All copy (taglines, descriptions) is original.
 * ==========================================================================*/

const BASE = '/images';

/* ------------------------------------------------------------------ */
/*  Core identity                                                     */
/* ------------------------------------------------------------------ */
export const restaurant = {
  name: 'Attil Multi Cuisine Restaurant',
  shortName: 'Attil',
  tagline: 'Banana-leaf fresh. Gold-grilled.',
  logo: `${BASE}/brand/logo.png`,
  icon: `${BASE}/brand/icon.png`,
  mascotChef: `${BASE}/cutouts/chef.png`,

  /* ---------------- address & contact (factual) ------------------- */
  address: {
    lines: [
      '36, Theni Madurai Main Road, Junction,',
      'Near Jakkampatti, Andipatti,',
      'Tamil Nadu — 625512',
    ],
    landmark: 'Theni–Madurai highway, near Jakkampatti',
  },
  phone: '7094479447',
  phoneIntl: '+917094479447',
  hours: [
    { days: 'Monday – Thursday', time: '11:00 AM – 11:00 PM' }, // EDIT: confirm timings
    { days: 'Friday – Sunday', time: '11:00 AM – 11:30 PM' }, // EDIT: confirm timings
  ],

  /* ---------------- map ------------------------------------------- */
  mapEmbed:
    'https://maps.google.com/maps?q=Attil%20Multicuisine%20Restaurant%2C%2036%2C%20Theni%20Madurai%20main%20road%2C%20Junction%2C%20near%20Jakkampatti%2C%20Andippatti%2C%20Tamil%20Nadu%20625512&t=m&z=14&output=embed&iwloc=near',
  mapLink:
    'https://www.google.com/maps/search/?api=1&query=Attil%20Multicuisine%20Restaurant%2036%20Theni%20Madurai%20Main%20Road%20Andipatti%20625512',

  /* ---------------- socials --------------------------------------- */
  socials: [
    {
      name: 'Instagram',
      icon: 'instagram',
      href: 'https://www.instagram.com/attil_multicuisine/?hl=en',
    },
    { name: 'Facebook', icon: 'facebook', href: '#', }, // EDIT: add page URL
    { name: 'YouTube', icon: 'youtube', href: '#' }, // EDIT: add channel URL
    { name: 'Twitter', icon: 'twitter', href: '#' }, // EDIT: add profile URL
    {
      name: 'WhatsApp',
      icon: 'whatsapp',
      href: 'https://wa.me/917094479447',
    },
  ],

  /* ---------------- hero stats ------------------------------------ */
  stats: [
    { value: '4.3★', label: 'Google rating' },
    { value: '263+', label: 'Happy reviews' },
    { value: '7', label: 'Cuisines under one roof' },
    { value: '100%', label: 'Family friendly' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Navbar anchors                                                    */
/* ------------------------------------------------------------------ */
export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Journey', href: '#journey' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Find us', href: '#visit' },
];

/* ------------------------------------------------------------------ */
/*  About section                                                     */
/* ------------------------------------------------------------------ */
export const about = {
  eyebrow: 'Our story',
  heading: 'One kitchen. A whole world of flavour.',
  paragraphs: [
    'Attil began with a simple idea — that a family should be able to argue happily over whether tonight feels like dosas, dim sums or garlic bread… and win every time.',
    'So we built one big kitchen where specialist chefs cook the food they grew up with, and one long banana-leaf-green dining hall where everyone, from toddlers to grandparents, gets the corner seat they like.',
  ],
  highlights: [
    {
      icon: 'leaf',
      title: 'Banana-leaf fresh',
      text: 'Market-day produce, ground spices, nothing sitting around.',
    },
    {
      icon: 'flame',
      title: 'Fire-kissed grills',
      text: 'Clay ovens, sigri grills and woks that never really cool down.',
    },
    {
      icon: 'chef',
      title: 'Specialist chefs',
      text: 'Every cuisine gets a chef who actually grew up eating it.',
    },
    {
      icon: 'star',
      title: 'Family-first hall',
      text: 'Roomy tables, patient staff, and a party hall for the big days.',
    },
  ],
  /* Interior / ambience photos for the collage */
  images: [
    { src: `${BASE}/photos/dining-hall.webp`, alt: 'Attil dining hall with banana-leaf green and gold interiors', big: true },
    { src: `${BASE}/photos/fish-fry.jpg`, alt: 'Fish fry plated on a dark stone dish' },
    { src: `${BASE}/photos/soup-bowl.jpg`, alt: 'House soup served in a clay bowl' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Menu highlights — one panel per cuisine                           */
/*  accent: 'green' | 'gold' controls the panel tint                  */
/* ------------------------------------------------------------------ */
export const menu = [
  {
    slug: 'south-indian',
    name: 'South Indian',
    tagline: 'Mornings that smell like home',
    description: 'Steamed, ground and griddled — plates that arrive on a banana leaf and disappear just as fast.',
    signature: ['Thatte idli', 'Veechu parotta', 'Omelette chilli'],
    accent: 'green',
    media: { type: 'photo', src: `${BASE}/photos/kothu-parotta.jpg`, alt: 'Kothu parotta tossed on the tawa' },
    cutouts: [`${BASE}/cutouts/idli.png`, `${BASE}/cutouts/parotta.png`],
    dishes: [
      { id: 'south-thatte-idli', name: 'Thatte Idli', description: 'Soft, cloud-light rice cakes served warm with house chutneys.', price: 85, image: `${BASE}/cutouts/idli.png` },
      { id: 'south-veechu-parotta', name: 'Veechu Parotta', description: 'Hand-stretched layers, folded and toasted on the hot tawa.', price: 90, image: `${BASE}/cutouts/parotta.png` },
      { id: 'south-egg-kothu-parotta', name: 'Egg Kothu Parotta', description: 'Chopped parotta tossed with egg, onion and lively masala.', price: 160, image: `${BASE}/photos/kothu-parotta.jpg` },
      { id: 'south-omelette-chilli', name: 'Omelette Chilli', description: 'A fluffy masala omelette with a bright green-chilli kick.', price: 110, image: `${BASE}/cutouts/omelette.png` },
      { id: 'south-chicken-sukka', name: 'Chicken Sukka', description: 'Tender chicken coated in a dry-roasted South Indian spice blend.', price: 220, image: `${BASE}/cutouts/sukka.png` },
    ],
  },
  {
    slug: 'north-indian-tandoor',
    name: 'North Indian & Tandoor',
    tagline: 'From the depths of the clay oven',
    description: 'Smoky kebabs, blistered naans and slow gravies — the tandoor section of the menu does the talking.',
    signature: ['Butter naan', 'Tandoori chicken', 'Paneer tikka'],
    accent: 'gold',
    media: { type: 'photo', src: `${BASE}/photos/seekh-kebab.jpg`, alt: 'Seekh kebabs stacked on a wooden platter' },
    cutouts: [`${BASE}/cutouts/naan.png`, `${BASE}/cutouts/tandoori.png`],
    dishes: [
      { id: 'north-butter-naan', name: 'Butter Naan', description: 'Soft leavened bread blistered in the tandoor and brushed with butter.', price: 55, image: `${BASE}/cutouts/naan.png` },
      { id: 'north-tandoori-chicken', name: 'Tandoori Chicken', description: 'Yogurt-marinated chicken roasted smoky and crisp at the edges.', price: 280, image: `${BASE}/cutouts/tandoori.png` },
      { id: 'north-paneer-tikka', name: 'Paneer Tikka', description: 'Charred paneer and peppers with a bright, warming spice rub.', price: 240, image: `${BASE}/cutouts/paneer-tikka.png` },
      { id: 'north-seekh-kebab', name: 'Seekh Kebab', description: 'Minced kebabs grilled over flame with herbs and ground spices.', price: 260, image: `${BASE}/photos/seekh-kebab.jpg` },
      { id: 'north-palak-paneer', name: 'Palak Paneer', description: 'Paneer folded through a gently spiced spinach gravy.', price: 230, image: `${BASE}/cutouts/palak-paneer.png` },
    ],
  },
  {
    slug: 'chinese',
    name: 'Chinese',
    tagline: 'Wok-tossed at full volume',
    description: 'High-flame noodles, saucy manchurian and fried chicken that crackles — Indo-Chinese, the way street stalls meant it.',
    signature: ['Hakka noodles', 'Veg manchurian', 'Schezwan fried chicken'],
    accent: 'green',
    media: { type: 'photo', src: `${BASE}/photos/octopus-chicken.jpg`, alt: 'Crispy tossed chicken with lemon and mint' },
    cutouts: [`${BASE}/cutouts/noodles.png`, `${BASE}/cutouts/manchurian.png`],
    dishes: [
      { id: 'chinese-hakka-noodles', name: 'Hakka Noodles', description: 'Wok-tossed noodles with crisp vegetables and savoury seasoning.', price: 180, image: `${BASE}/cutouts/noodles.png` },
      { id: 'chinese-veg-manchurian', name: 'Veg Manchurian', description: 'Golden vegetable bites coated in a glossy, tangy house sauce.', price: 190, image: `${BASE}/cutouts/manchurian.png` },
      { id: 'chinese-schezwan-chicken', name: 'Schezwan Chicken', description: 'Crisp chicken tossed with garlic, chilli and bold Schezwan sauce.', price: 240, image: `${BASE}/photos/octopus-chicken.jpg` },
      { id: 'chinese-chicken-noodles', name: 'Chicken Noodles', description: 'Smoky wok-fried noodles with tender chicken and fresh vegetables.', price: 220, image: `${BASE}/cutouts/noodles.png` },
      { id: 'chinese-crispy-chicken', name: 'Crispy Chicken', description: 'Crunchy chicken bites with a savoury chilli-garlic finish.', price: 230, image: `${BASE}/cutouts/crispy-chicken.png` },
    ],
  },
  {
    slug: 'continental',
    name: 'Continental',
    tagline: 'Knives, forks, second helpings',
    description: 'Herbed pastas, fresh salads and gentle sauces for the nights when the family votes European.',
    signature: ['Herbed pasta', 'Garden salad', 'Mussels in sauce'],
    accent: 'gold',
    media: { type: 'photo', src: `${BASE}/photos/chef-plate.jpg`, alt: 'Chef’s grilled plate with dips' },
    cutouts: [`${BASE}/cutouts/pasta.png`, `${BASE}/cutouts/salad.png`],
    dishes: [
      { id: 'continental-herbed-pasta', name: 'Herbed Pasta', description: 'Pasta tossed with fragrant herbs and a smooth, mellow sauce.', price: 240, image: `${BASE}/cutouts/pasta.png` },
      { id: 'continental-garden-salad', name: 'Garden Salad', description: 'Fresh greens and crunchy vegetables with a bright house dressing.', price: 180, image: `${BASE}/cutouts/salad.png` },
      { id: 'continental-grilled-chicken', name: 'Grilled Chicken', description: 'Juicy grilled chicken served with gentle herbs and a dipping sauce.', price: 290, image: `${BASE}/photos/chef-plate.jpg` },
      { id: 'continental-mussels', name: 'Mussels in Sauce', description: 'Tender mussels served in a savoury, aromatic sauce.', price: 320, image: `${BASE}/cutouts/mussels.png` },
      { id: 'continental-soup', name: 'House Soup', description: 'A warming bowl finished with fresh herbs and a soft spice note.', price: 120, image: `${BASE}/photos/soup-bowl.jpg` },
    ],
  },
  {
    slug: 'arabian-grill',
    name: 'Arabian Grill',
    tagline: 'Charcoal, smoke, repeat',
    description: 'Al faham and skillet grills rubbed with our own masalas, finished over charcoal until the edges whisper.',
    signature: ['Al faham chicken', 'Skillet grilled chicken', 'Pepper grill'],
    accent: 'green',
    media: { type: 'photo', src: `${BASE}/photos/al-faham.webp`, alt: 'Arabian al faham grilled chicken' },
    cutouts: [`${BASE}/cutouts/grilled-1.png`, `${BASE}/cutouts/grilled-2.png`],
    dishes: [
      { id: 'arabian-al-faham', name: 'Al Faham Chicken', description: 'Charcoal-grilled chicken marinated with aromatic Arabian spices.', price: 320, image: `${BASE}/photos/al-faham.webp` },
      { id: 'arabian-grilled-chicken', name: 'Grilled Chicken', description: 'A smoky, flame-kissed grill finished with house masala.', price: 300, image: `${BASE}/cutouts/grilled-1.png` },
      { id: 'arabian-pepper-grill', name: 'Pepper Grill', description: 'Juicy grilled chicken with cracked pepper and a lively spice crust.', price: 310, image: `${BASE}/cutouts/grilled-2.png` },
      { id: 'arabian-chicken-tikka', name: 'Chicken Tikka', description: 'Charred, tender tikka pieces with a tangy yoghurt marinade.', price: 280, image: `${BASE}/photos/attil-tikka.jpg` },
      { id: 'arabian-chicken-sukka', name: 'Chicken Sukka', description: 'Slow-finished chicken with toasted spices and a savoury dry masala.', price: 260, image: `${BASE}/cutouts/sukka.png` },
    ],
  },
  {
    slug: 'signature',
    name: 'Signature Specialties',
    tagline: 'The dishes that named us',
    description: 'Chef’s own creations — including the Attil biryani that regulars order before they even sit down.',
    signature: ['Attil biryani', 'Teriyaki glazed chicken', 'Keema pan'],
    accent: 'gold',
    media: { type: 'photo', src: `${BASE}/photos/attil-special.jpg`, alt: 'Attil special gravy served on a banana leaf' },
    cutouts: [`${BASE}/cutouts/biryani.png`, `${BASE}/cutouts/teriyaki.png`],
    dishes: [
      { id: 'signature-attil-biryani', name: 'Attil Biryani', description: 'Fragrant basmati layered with slow-cooked masala and our signature finish.', price: 260, image: `${BASE}/photos/egg-biryani.jpg` },
      { id: 'signature-teriyaki-chicken', name: 'Teriyaki Chicken', description: 'Grilled chicken glazed with a sweet-savoury teriyaki sauce.', price: 280, image: `${BASE}/cutouts/teriyaki.png` },
      { id: 'signature-keema-pan', name: 'Keema Pan', description: 'Spiced minced meat served sizzling in its own little pan.', price: 290, image: `${BASE}/photos/keema-pan.jpg` },
      { id: 'signature-attil-special', name: 'Attil Special', description: 'A house creation with deep masala flavour and a rich finish.', price: 320, image: `${BASE}/photos/attil-special.jpg` },
      { id: 'signature-crispy-chicken', name: 'Crispy Chicken', description: 'Crisp, golden chicken seasoned with the chef’s special blend.', price: 240, image: `${BASE}/cutouts/crispy-chicken.png` },
    ],
  },
  {
    slug: 'pantry',
    name: 'Pantry & Beverages',
    tagline: 'Cool glasses, warm bowls',
    description: 'Mojitos, smoothies and little bowls that keep the table busy between the big arrivals.',
    signature: ['Virgin mojito', 'Mukhani smoothie', 'Spanish soup'],
    accent: 'green',
    media: { type: 'cutout', src: `${BASE}/cutouts/mojito.png`, alt: 'Tall mojito glass with mint' },
    cutouts: [`${BASE}/cutouts/mojito.png`, `${BASE}/cutouts/smoothie.png`],
    dishes: [
      { id: 'pantry-virgin-mojito', name: 'Virgin Mojito', description: 'Cool lime, fresh mint and a lively sparkle over crushed ice.', price: 130, image: `${BASE}/cutouts/mojito.png` },
      { id: 'pantry-mukhani-smoothie', name: 'Mukhani Smoothie', description: 'A creamy, chilled fruit blend made for a slow sip.', price: 160, image: `${BASE}/cutouts/smoothie.png` },
      { id: 'pantry-spanish-soup', name: 'Spanish Soup', description: 'A warming, gently spiced soup with a smooth finish.', price: 140, image: `${BASE}/cutouts/spanish-soup.png` },
      { id: 'pantry-fresh-salad', name: 'Fresh Salad', description: 'A crisp, colourful bowl with a light and tangy dressing.', price: 170, image: `${BASE}/cutouts/salad.png` },
      { id: 'pantry-soup-bowl', name: 'Soup of the Day', description: 'A comforting kitchen-made bowl, served hot and fresh.', price: 120, image: `${BASE}/photos/soup-bowl.jpg` },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Airplane journey                                                  */
/* ------------------------------------------------------------------ */
export const journey = {
  eyebrow: 'The flavour flight',
  heading: 'Seven cuisines. One delicious descent.',
  blurb:
    'Buckle up. Scroll down and follow the little plane as it swoops from our kitchen straight to your table — scroll back up and it flies home for another round.',
  plane: `${BASE}/cutouts/plane.png`,
  stops: [
    {
      title: 'Andipatti Junction',
      text: 'Take-off. The craving is officially cleared for departure.',
    },
    {
      title: 'Near Jakkampatti',
      text: 'Cabin fills with the smell of charcoal and ground masala.',
    },
    {
      title: 'Attil, Theni Main Road',
      text: 'Landing. A table for you is already being set.',
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  BIG words section                                                 */
/* ------------------------------------------------------------------ */
export const bigWords = {
  eyebrow: 'In four words',
  words: [
    { text: 'FRESH', color: 'leaf', image: `${BASE}/cutouts/salad.png`, alt: 'Fresh garden salad bowl' },
    { text: 'SMOKY', color: 'gold', image: `${BASE}/cutouts/grilled-2.png`, alt: 'Smoky grilled chicken skillet' },
    { text: 'CRISPY', color: 'leaf', image: `${BASE}/cutouts/crispy-chicken.png`, alt: 'Crispy fried chicken plate' },
    { text: 'JUICY', color: 'gold', image: `${BASE}/cutouts/beef.png`, alt: 'Juicy beef gravy bowl' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Gallery                                                           */
/* ------------------------------------------------------------------ */
export const gallery = {
  heading: 'Straight from our tables',
  items: [
    { src: `${BASE}/photos/egg-biryani.jpg`, alt: 'Egg biryani with sides', tall: true },
    { src: `${BASE}/photos/dining-hall.webp`, alt: 'The Attil dining hall' },
    { src: `${BASE}/photos/attil-tikka.jpg`, alt: 'Attil special tikka on a skillet' },
    { src: `${BASE}/photos/seekh-kebab.jpg`, alt: 'Seekh kebab platter' },
    { src: `${BASE}/photos/keema-pan.jpg`, alt: 'Keema served in a mini kadai' },
    { src: `${BASE}/photos/fish-fry.jpg`, alt: 'Fish fry with herbs' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Fruit-cutter finale — items tossed from the bottom of the screen  */
/* ------------------------------------------------------------------ */
export const finale = {
  words: ['SO', 'YUMMY,', 'MUCH', 'FLAVOUR!'],
  /* pool of transparent cutouts that get thrown around */
  pool: [
    `${BASE}/cutouts/idli.png`,
    `${BASE}/cutouts/biryani.png`,
    `${BASE}/cutouts/parotta.png`,
    `${BASE}/cutouts/naan.png`,
    `${BASE}/cutouts/paneer-tikka.png`,
    `${BASE}/cutouts/tandoori.png`,
    `${BASE}/cutouts/noodles.png`,
    `${BASE}/cutouts/mojito.png`,
    `${BASE}/cutouts/smoothie.png`,
    `${BASE}/cutouts/salad.png`,
    `${BASE}/cutouts/crispy-chicken.png`,
    `${BASE}/cutouts/omelette.png`,
    `${BASE}/cutouts/mussels.png`,
    `${BASE}/cutouts/chapati.png`,
  ],
};
