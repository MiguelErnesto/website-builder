export type SeedProduct = {
  slug: string
  price: number
  bg: string
  ink: string
  title: { es: string; en: string }
  description: { es: string; en: string }
  alt: { es: string; en: string }
}

export const SEED_ADMIN = {
  email: 'admin@email.com',
  password: 'admin1234',
} as const

export const SEED_SITE = {
  name: { es: 'Estudio', en: 'Studio' },
  heroTitle: {
    es: 'Lo que hacemos, con claridad.',
    en: 'What we do, shown clearly.',
  },
  heroLead: {
    es: 'Un espacio para mostrar productos, servicios, oficios o cursos. Cada pieza tiene su ficha.',
    en: 'A place to show products, services, crafts or courses. Each item has its own page.',
  },
  heroCta: { es: 'Ver la oferta', en: 'See the offer' },
  offeringsTitle: { es: 'Oferta', en: 'Offerings' },
} as const

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    slug: 'lampara-mesa-aura',
    price: 89,
    bg: '#FDE68A',
    ink: '#0EA5E9',
    title: { es: 'Lámpara de mesa Aura', en: 'Aura table lamp' },
    description: {
      es: 'Luz cálida sobre base de acero. Ideal para escritorio o mesita.',
      en: 'Warm light on a steel base. Made for a desk or bedside table.',
    },
    alt: { es: 'Lámpara de mesa Aura encendida', en: 'Aura table lamp switched on' },
  },
  {
    slug: 'silla-nido',
    price: 245,
    bg: '#FED7AA',
    ink: '#1C1917',
    title: { es: 'Silla Nido', en: 'Nido chair' },
    description: {
      es: 'Asiento firme, respaldo bajo y patas de roble. Apila hasta cuatro.',
      en: 'Firm seat, low back, oak legs. Stacks up to four.',
    },
    alt: { es: 'Silla Nido de roble', en: 'Nido oak chair' },
  },
  {
    slug: 'mesa-baja-block',
    price: 320,
    bg: '#E7E5E4',
    ink: '#0EA5E9',
    title: { es: 'Mesa baja Block', en: 'Block coffee table' },
    description: {
      es: 'Tablero grueso y cantos vivos. Un bloque que ordena el salón.',
      en: 'Thick top and sharp edges. One block that anchors the room.',
    },
    alt: { es: 'Mesa baja Block vista frontal', en: 'Block coffee table front view' },
  },
  {
    slug: 'jarron-arcilla',
    price: 48,
    bg: '#FECACA',
    ink: '#7F1D1D',
    title: { es: 'Jarrón Arcilla', en: 'Clay vase' },
    description: {
      es: 'Cerámica mate hecha a mano. Boca ancha para ramas secas.',
      en: 'Handmade matte ceramic. Wide mouth for dried branches.',
    },
    alt: { es: 'Jarrón de cerámica mate', en: 'Matte ceramic vase' },
  },
  {
    slug: 'alfombra-grid',
    price: 180,
    bg: '#A5F3FC',
    ink: '#1C1917',
    title: { es: 'Alfombra Grid', en: 'Grid rug' },
    description: {
      es: 'Pelo corto de lana con retícula. 160 × 230 cm.',
      en: 'Short-pile wool with a grid. 160 × 230 cm.',
    },
    alt: { es: 'Alfombra Grid con retícula', en: 'Grid rug with lattice pattern' },
  },
  {
    slug: 'reloj-muro',
    price: 65,
    bg: '#DDD6FE',
    ink: '#1C1917',
    title: { es: 'Reloj de muro', en: 'Wall clock' },
    description: {
      es: 'Caja negra, números grandes, silencioso. Se lee desde el sofá.',
      en: 'Black case, large numerals, silent. Readable from the sofa.',
    },
    alt: { es: 'Reloj de pared negro', en: 'Black wall clock' },
  },
  {
    slug: 'estanteria-cubo',
    price: 210,
    bg: '#BBF7D0',
    ink: '#14532D',
    title: { es: 'Estantería Cubo', en: 'Cube shelf' },
    description: {
      es: 'Nueve huecos abiertos. Montaje en 20 minutos, sin tornillos a la vista.',
      en: 'Nine open cubes. Twenty-minute assembly, no visible screws.',
    },
    alt: { es: 'Estantería Cubo de nueve huecos', en: 'Nine-cube shelf' },
  },
  {
    slug: 'cojin-offset',
    price: 32,
    bg: '#FDE68A',
    ink: '#1C1917',
    title: { es: 'Cojín Offset', en: 'Offset cushion' },
    description: {
      es: 'Funda de algodón con costura descentrada. 45 × 45 cm.',
      en: 'Cotton cover with an offset seam. 45 × 45 cm.',
    },
    alt: { es: 'Cojín Offset cuadrado', en: 'Square Offset cushion' },
  },
  {
    slug: 'tetera-linea',
    price: 54,
    bg: '#E0F2FE',
    ink: '#0C4A6E',
    title: { es: 'Tetera Línea', en: 'Linea teapot' },
    description: {
      es: 'Acero inox y pico fino. Un litro. Colador incluido.',
      en: 'Stainless steel with a fine spout. One litre. Infuser included.',
    },
    alt: { es: 'Tetera Línea de acero', en: 'Linea stainless teapot' },
  },
  {
    slug: 'cuaderno-figtree',
    price: 18,
    bg: '#FEF3C7',
    ink: '#1C1917',
    title: { es: 'Cuaderno Figtree', en: 'Figtree notebook' },
    description: {
      es: 'Tapa dura, 192 páginas pautadas, lomo cosido. A5.',
      en: 'Hard cover, 192 lined pages, stitched spine. A5.',
    },
    alt: { es: 'Cuaderno Figtree A5', en: 'Figtree A5 notebook' },
  },
  {
    slug: 'bolso-tote-stone',
    price: 72,
    bg: '#E7E5E4',
    ink: '#0EA5E9',
    title: { es: 'Bolso tote Stone', en: 'Stone tote' },
    description: {
      es: 'Lona gruesa, asas cortas, bolsillo interior. Diario y mercado.',
      en: 'Heavy canvas, short handles, inner pocket. Daily and market use.',
    },
    alt: { es: 'Bolso tote Stone de lona', en: 'Stone canvas tote' },
  },
  {
    slug: 'lampara-pie-column',
    price: 198,
    bg: '#FBCFE8',
    ink: '#1C1917',
    title: { es: 'Lámpara de pie Column', en: 'Column floor lamp' },
    description: {
      es: 'Fuste cilíndrico y pantalla opaca. Luz de lectura hacia abajo.',
      en: 'Cylindrical stem and opaque shade. Downward reading light.',
    },
    alt: { es: 'Lámpara de pie Column', en: 'Column floor lamp' },
  },
  {
    slug: 'espejo-frame',
    price: 125,
    bg: '#C7D2FE',
    ink: '#1E1B4B',
    title: { es: 'Espejo Frame', en: 'Frame mirror' },
    description: {
      es: 'Marco de 2 cm, cristal sin distorsión. 70 × 50 cm, cuelga vertical.',
      en: '2 cm frame, undistorted glass. 70 × 50 cm, hangs portrait.',
    },
    alt: { es: 'Espejo Frame rectangular', en: 'Rectangular Frame mirror' },
  },
  {
    slug: 'maceta-brutal',
    price: 36,
    bg: '#D6D3D1',
    ink: '#1C1917',
    title: { es: 'Maceta Brutal', en: 'Brutal planter' },
    description: {
      es: 'Hormigón ligero con drenaje. Diámetro 22 cm.',
      en: 'Lightweight concrete with drainage. 22 cm diameter.',
    },
    alt: { es: 'Maceta Brutal de hormigón', en: 'Brutal concrete planter' },
  },
  {
    slug: 'manta-lana',
    price: 95,
    bg: '#FEF9C3',
    ink: '#854D0E',
    title: { es: 'Manta de lana', en: 'Wool throw' },
    description: {
      es: 'Tejido grueso, dobladillo visto. 130 × 180 cm.',
      en: 'Heavy weave, visible hem. 130 × 180 cm.',
    },
    alt: { es: 'Manta de lana plegada', en: 'Folded wool throw' },
  },
  {
    slug: 'candelabro-duo',
    price: 42,
    bg: '#FECACA',
    ink: '#1C1917',
    title: { es: 'Candelabro Duo', en: 'Duo candlestick' },
    description: {
      es: 'Dos alturas, hierro pintado. Velas de 2,2 cm.',
      en: 'Two heights, painted iron. Fits 2.2 cm candles.',
    },
    alt: { es: 'Candelabro Duo de hierro', en: 'Duo iron candlestick' },
  },
  {
    slug: 'escritorio-plano',
    price: 410,
    bg: '#BAE6FD',
    ink: '#1C1917',
    title: { es: 'Escritorio Plano', en: 'Flat desk' },
    description: {
      es: 'Tablero 140 × 70 cm, un cajón. Cableado por la pata trasera.',
      en: '140 × 70 cm top, one drawer. Cable routed through the rear leg.',
    },
    alt: { es: 'Escritorio Plano con cajón', en: 'Flat desk with drawer' },
  },
  {
    slug: 'taburete-alto',
    price: 88,
    bg: '#FDBA74',
    ink: '#1C1917',
    title: { es: 'Taburete Alto', en: 'Tall stool' },
    description: {
      es: 'Asiento redondo, reposapiés anillo. Altura 75 cm.',
      en: 'Round seat, ring footrest. 75 cm high.',
    },
    alt: { es: 'Taburete Alto de cocina', en: 'Tall kitchen stool' },
  },
  {
    slug: 'bandeja-roble',
    price: 39,
    bg: '#FDE68A',
    ink: '#78350F',
    title: { es: 'Bandeja Roble', en: 'Oak tray' },
    description: {
      es: 'Roble macizo, asas recortadas. 40 × 28 cm.',
      en: 'Solid oak, cut-out handles. 40 × 28 cm.',
    },
    alt: { es: 'Bandeja de roble macizo', en: 'Solid oak tray' },
  },
  {
    slug: 'perchero-rail',
    price: 76,
    bg: '#E7E5E4',
    ink: '#0EA5E9',
    title: { es: 'Perchero Rail', en: 'Rail coat rack' },
    description: {
      es: 'Barra de 90 cm y cinco ganchos. Se fija a dos tacos.',
      en: '90 cm rail and five hooks. Fixes on two wall plugs.',
    },
    alt: { es: 'Perchero Rail de pared', en: 'Rail wall coat rack' },
  },
  {
    slug: 'lampara-pared-cut',
    price: 110,
    bg: '#A5F3FC',
    ink: '#1C1917',
    title: { es: 'Lámpara de pared Cut', en: 'Cut wall lamp' },
    description: {
      es: 'Pantalla recortada que proyecta un triángulo de luz.',
      en: 'Cut shade that casts a triangle of light.',
    },
    alt: { es: 'Lámpara de pared Cut', en: 'Cut wall lamp' },
  },
  {
    slug: 'vasos-prism',
    price: 44,
    bg: '#DDD6FE',
    ink: '#1C1917',
    title: { es: 'Juego de vasos Prism', en: 'Prism glass set' },
    description: {
      es: 'Cuatro vasos facetados de 300 ml. Vidrio soplado.',
      en: 'Four faceted 300 ml glasses. Blown glass.',
    },
    alt: { es: 'Cuatro vasos Prism', en: 'Four Prism glasses' },
  },
  {
    slug: 'reloj-mesa-tick',
    price: 58,
    bg: '#BBF7D0',
    ink: '#1C1917',
    title: { es: 'Reloj de mesa Tick', en: 'Tick desk clock' },
    description: {
      es: 'Cara cuadrada, alarma suave, pila AA. 12 × 12 cm.',
      en: 'Square face, soft alarm, AA battery. 12 × 12 cm.',
    },
    alt: { es: 'Reloj de mesa Tick', en: 'Tick desk clock' },
  },
  {
    slug: 'organizador-desk',
    price: 28,
    bg: '#FED7AA',
    ink: '#1C1917',
    title: { es: 'Organizador Desk', en: 'Desk organizer' },
    description: {
      es: 'Tres compartimentos y un hueco para bolígrafos. Chapa plegada.',
      en: 'Three bays and a pen slot. Folded sheet metal.',
    },
    alt: { es: 'Organizador de escritorio', en: 'Desk organizer' },
  },
  {
    slug: 'banco-hall',
    price: 265,
    bg: '#E0F2FE',
    ink: '#1C1917',
    title: { es: 'Banco Hall', en: 'Hall bench' },
    description: {
      es: 'Asiento de 110 cm y zapatero debajo. Entrada o pie de cama.',
      en: '110 cm seat with shoe storage below. Hall or end of bed.',
    },
    alt: { es: 'Banco Hall con zapatero', en: 'Hall bench with shoe storage' },
  },
]
