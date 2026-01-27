
import { Product, Testimonial } from './types';

/**
 * PANEL DE CONTROL DE IMÁGENES EXCLUSIVAS
 */

// --- ICONOS DE SILUETAS (TESTIMONIOS) ---
export const ICON_FEMALE = 'https://i.postimg.cc/KzTZmb8w/ICONO_MUJER.png';
export const ICON_MALE = 'https://i.postimg.cc/ZRNTJm5g/ICONO_HOMBRE.png';

// --- CARRUSEL PRINCIPAL (HOME HERO) ---
export const IMG_HERO_SLIDE_1 = 'https://i.postimg.cc/m289NTF5/Whisk_730685564a8a287af1246ccd07793773dr.png';
export const IMG_HERO_SLIDE_2 = 'https://i.postimg.cc/15JFcyNd/Whisk_2f277a1cc353c24861c419f222abc5dddr.png';
export const IMG_HERO_SLIDE_3 = 'https://i.postimg.cc/BQMFcJ17/Whisk_455674375a552b0b3cc45af38280bf39dr.jpg';

// --- DEFINICIÓN DE SLIDES PARA EL HERO ---
export const HERO_SLIDES = [
  {
    image: '/video1.mp4',
    type: 'video',
    title: 'Esencia\nNatural',
    subtitle: 'Vuelo\nFeliz',
    desc: 'Juguetes artesanales diseñados para potenciar el instinto y la felicidad de tu agapornis, priorizando materiales de origen natural y la máxima seguridad en cada pieza.'
  },
  {
    image: '/video2.mp4',
    type: 'video',
    title: 'Jugar,\nExplorar',
    subtitle: 'Y Disfrutar\nCada Día',
    desc: 'Diseños pensados para activar el instinto natural de búsqueda y juego de tus aves.'
  },
  {
    image: '/video3.mp4',
    type: 'video',
    title: 'Seguridad\nY Confianza',
    subtitle: 'Amor\nPor Ellas',
    desc: 'Materiales libres de plásticos y tóxicos. La tranquilidad que tu bandada se merece.'
  }
];

// --- SECCIONES EXCLUSIVAS ---
export const IMG_ABOUT_MAIN = 'https://i.postimg.cc/yxrnjMFW/Whisk_ym2njlzy5y2ywiwytmwozgtlhzwm00czxumytyg.jpg';
export const IMG_ABOUT_STORY = 'https://i.postimg.cc/vHpZFmk2/Whisk-a017c3db14ea9c29ac8469c885a71ee6dr.jpg';
export const IMG_CONTACT_MAIN = 'https://i.postimg.cc/DZbGhN5m/Whisk_e76e908bd2c480eb69642d4a60cc9a4cdr.png';

// --- CATÁLOGO DE PRODUCTOS ---
const IMG_PROD_AVENTURA = 'https://i.postimg.cc/SRf3Zg0b/Whats_App_Image_2026_01_11_at_15_20_51.jpg';
const IMG_PROD_RELAX = 'https://i.postimg.cc/NfQWyvTq/Whats_App_Image_2026_01_11_at_15_21_22.jpg';
const IMG_PROD_NATURA = 'https://i.postimg.cc/ZKpqJs3w/Whats-App-Image-2026-01-25-at-12-13-58.jpg';
const IMG_PACK_OLIVO = '/pack-bolsaolivo.png';
const IMG_COLUMPIO_PLATAFORMA = '/COLUMPIOA.png';
const IMG_COLUMPIO_CORTEZA = '/COLUMPIO-CORTEZA.png';
const IMG_COLUMPIO_BASICO = '/COLUMPIO-BASICO.jpeg';
const IMG_COLUMPIO_CORCHO = '/columpio-AVE.png';
const IMG_FORRAJEO_CAJA = 'https://i.postimg.cc/kgQf3ffC/FORRAJEO.png';
const IMG_FORRAJEO_BUSCADOR = 'https://i.postimg.cc/g2VNFNNd/Captura_de_pantalla_2026_01_11_191640.png';
const IMG_FORRAJEO_COMBO = '/combogrande-forrajeo.PNG';
const IMG_FORRAJEO_RAFIA = '/BOLSADERAFIA.png';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Pack Aventura',
    price: 14.90,
    description: 'Ideal para exploradores. Incluye columpio de madera natural y bolsita de forrajeo para máxima diversión.',
    image: IMG_PROD_AVENTURA,
    category: 'Packs',
    badge: 'Más vendido'
  },
  {
    id: 'p6',
    name: 'Pack Relax',
    price: 15.90,
    description: 'Materiales silenciosos y texturas suaves para aves más tranquilas o miedosas.',
    image: IMG_PROD_RELAX,
    category: 'Packs'
  },
  {
    id: 'p14',
    name: 'Columpio más cuerda',
    price: 11.75,
    description: 'La esencia de la diversión natural. Un lote artesanal con texturas para un entretenimiento seguro.',
    image: IMG_PROD_NATURA,
    category: 'Packs',
    badge: 'Nuevo'
  },
  {
    id: 'p16',
    name: 'Pack Olivo',
    price: 13.90,
    description: 'Selección especial de accesorios artesanales con rama de olivo natural. Ideal para estimulación y enriquecimiento.',
    image: IMG_PACK_OLIVO,
    category: 'Packs'
  },
  {
    id: 'p17',
    name: 'Columpio Corteza de Pino Piñonero',
    price: 14.80,
    description: 'Corteza de pino piñonero natural con fibra de coco y piña. Medidas: 29cm alto x 20cm ancho. Ideal para aves medianas y pequeñas. Desgaste de pico y limado de uñas natural.',
    image: IMG_COLUMPIO_CORTEZA,
    category: 'Columpios'
  },
  {
    id: 'p19',
    name: 'Columpio Básico Artesanal',
    price: 7.50,
    description: 'La esencia de la sencillez. Percha de madera natural y cuerda de sisal resistente. Un clásico imprescindible para el descanso diario.',
    image: IMG_COLUMPIO_BASICO,
    category: 'Columpios'
  },
  {
    id: 'p20',
    name: 'Tarta de Corcho',
    price: 17.50,
    description: 'Corcho auténtico en formato tarta con bolita de enriquecimiento. Textura irresistible para picar y jugar. Un pastel de diversión natural.',
    image: IMG_COLUMPIO_CORCHO,
    category: 'Columpios',
    badge: 'Premium',
    scale: 1.30
  },
  {
    id: 'p21',
    name: 'Columpio Plataforma "Rincón Zen"',
    price: 13.50,
    description: 'Plataforma de madera natural con base de cuerda de yute tejida y cuentas geométricas. Medidas: 19cm alto x 14cm ancho. Diseño robusto y seguro para aves pequeñas.',
    image: IMG_COLUMPIO_PLATAFORMA,
    category: 'Columpios',
    badge: 'Popular'
  },
  {
    id: 'p12',
    name: 'Bolsita de Forrajeo',
    price: 3.75,
    description: 'Heno natural de alta calidad (100gr). Perfecta para fomentar el instinto de búsqueda y mantener a tu ave entretenida y saludable.',
    image: IMG_FORRAJEO_CAJA,
    category: 'Forrajeo',
    badge: 'Recomendado'
  },
  {
    id: 'p13',
    name: 'Buscador de Semillas "Raíces"',
    price: 8.50,
    description: 'Materiales naturales que imitan el comportamiento de búsqueda en libertad.',
    image: IMG_FORRAJEO_BUSCADOR,
    category: 'Forrajeo'
  },
  {
    id: 'p18',
    name: 'Combo Forrajeo Natural',
    price: 16.75,
    description: 'Mezcla de cinco bolsas variadas para fondo de bandeja. Estimula el instinto natural de búsqueda y reduce el aburrimiento.',
    image: IMG_FORRAJEO_COMBO,
    category: 'Forrajeo',
    badge: 'Ahorro'
  },
  {
    id: 'p22',
    name: 'Bolsita de Rafia Natural',
    price: 3.75,
    description: '50g de bolsita de rafia natural seca para fondo de bandeja y actividades de forrajeo. Material 100% biodegradable y seguro.',
    image: IMG_FORRAJEO_RAFIA,
    category: 'Forrajeo',
    badge: 'Nuevo'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'LAURA G. & MANGO',
    birdName: 'Mango',
    avatar: ICON_FEMALE,
    text: '"A mi Mango le encanta el Pack Aventura. Se pasa horas jugando y se nota que los materiales son de calidad. ¡Repetiré seguro!"',
    rating: 5
  },
  {
    id: 't2',
    name: 'CARLOS R. & PIQUITO',
    birdName: 'Piquito',
    avatar: ICON_MALE,
    text: '"Por fin juguetes que no huelen a plástico. El envío fue súper rápido y el empaquetado precioso. Muy recomendable."',
    rating: 5
  },
  {
    id: 't3',
    name: 'SOFÍA L. & KIWI',
    birdName: 'Kiwi',
    avatar: ICON_FEMALE,
    text: '"El Columpio Esencia es el sitio favorito de Kiwi. Me encanta que usen madera de poda real, se nota la diferencia."',
    rating: 5
  },
  {
    id: 't4',
    name: 'JAVI M. & BLUE',
    birdName: 'Blue',
    avatar: ICON_MALE,
    text: '"Compré la Caja de Forrajeo y mi agapornis se vuelve loco buscando su comida. Un 10 en diseño y seguridad avian."',
    rating: 5
  },
  {
    id: 't5',
    name: 'ELENA V. & SOL',
    birdName: 'Sol',
    avatar: ICON_FEMALE,
    text: '"Hice un pedido personalizado y la atención fue increíble. Se nota que aman lo que hacen. El Pack Relax es una maravilla."',
    rating: 5
  },
  {
    id: 't6',
    name: 'MARIO S. & PEPA',
    birdName: 'Pepa',
    avatar: ICON_MALE,
    text: '"Me costaba encontrar juguetes resistentes para Pepa, pero los de Pico & Amor aguantan perfectamente su pico destructor."',
    rating: 5
  }
];

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Cuidados' | 'Salud' | 'Juegos';
  image: string;
  date: string;
  readTime: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'Beneficios del Forrajeo en Agapornis',
    excerpt: 'Descubre por qué esconder la comida es la mejor forma de estimular la inteligencia de tu ave y evitar el estrés.',
    content: `
      <p>El forrajeo no es solo un juego, es una necesidad biológica. En la naturaleza, los agapornis pasan hasta el 70% de su tiempo activo buscando alimento. Cuando les servimos la comida en un cuenco limpio y fácil, les robamos esa estimulación mental.</p>
      
      <h3>¿Por qué es tan importante?</h3>
      <ul>
        <li><strong>Reduce el picaje:</strong> Muchas aves se arrancan plumas por puro aburrimiento. El forrajeo las mantiene ocupadas.</li>
        <li><strong>Estimulación Intelectual:</strong> Resolver "puzles" para llegar a una semilla libera dopamina en su cerebro.</li>
        <li><strong>Ejercicio Físico:</strong> Trepar, colgarse y usar el pico para abrir cajas de cartón o madera fortalece sus músculos.</li>
      </ul>

      <blockquote>"Un ave que busca su comida es un ave feliz y equilibrada."</blockquote>

      <h3>Cómo empezar hoy mismo</h3>
      <p>No necesitas gastar mucho. Puedes empezar envolviendo algunas semillas en papel de seda limpio o escondiéndolas dentro de tapones de corcho natural (sin pegamento). Verás cómo su curiosidad natural se activa de inmediato.</p>
    `,
    category: 'Juegos',
    image: 'https://i.postimg.cc/cHHm3ZZs/Whisk_e3f256255886d85880949b8daaa168cadr.png',
    date: '12 ENE 2024',
    readTime: '4 min'
  },
  {
    id: 'b2',
    title: 'Maderas seguras vs Maderas tóxicas',
    excerpt: 'Guía definitiva sobre qué ramas puedes usar de tu jardín y cuáles suponen un riesgo mortal para tu mascota.',
    content: `
      <p>Uno de los errores más comunes y peligrosos es introducir cualquier rama del parque en la jaula de nuestro agapornis. El pico de estas aves es extremadamente poroso y absorbe resinas o pesticidas con facilidad.</p>
      
      <h3>Maderas 100% Seguras (Recomendadas)</h3>
      <p>En Pico & Amor utilizamos principalmente estas variedades por su dureza y seguridad:</p>
      <ul>
        <li><strong>Corcho natural:</strong> Ligero, seguro y muy atractivo para el picoteo. Ideal para forrajeo y enriquecimiento.</li>
        <li><strong>Maderas de árboles frutales (como naranjo, peral o manzano):</strong> Resistentes, naturales y muy estimulantes para el pico. Perfectas para morder y explorar.</li>
        <li><strong>Olivo:</strong> Madera extremadamente dura y resistente, ideal para agapornis con picos más fuertes o destructores.</li>
        <li><strong>Bambú:</strong> Material natural, ligero y versátil, muy útil para juegos, estructuras y forrajeo.</li>
        <li><strong>Pino correctamente seco y preparado:</strong> Utilizado en forma de troncos o corteza, siempre bien seco y sin resina activa.</li>
      </ul>

      <h3>¡Peligro! Evita estas maderas</h3>
      <p>Nunca uses estas variedades, ya que contienen toxinas naturales o resinas irritantes:</p>
      <ul>
        <li><strong>Coníferas (Pino, Abeto):</strong> Su resina es pegajosa y tóxica si se ingiere.</li>
        <li><strong>Adelfa:</strong> Altamente venenosa incluso en pequeñas cantidades.</li>
        <li><strong>Roble:</strong> Contiene taninos que pueden causar problemas renales.</li>
      </ul>
    `,
    category: 'Salud',
    image: 'https://i.postimg.cc/2yX85QGn/Whisk_b2f70ac7cf17222881241d77102b60dadr.jpg',
    date: '08 ENE 2024',
    readTime: '6 min'
  },
  {
    id: 'b3',
    title: 'Preparando la llegada de un nuevo miembro',
    excerpt: 'Todo lo que necesitas saber para que los primeros días de tu agapornis en casa sean tranquilos y felices.',
    content: `
      <p>La llegada de un agapornis a un nuevo hogar es un evento estresante para el ave. Todo es nuevo: los sonidos, las caras y, por supuesto, su jaula. La clave para una buena adaptación es la paciencia.</p>
      
      <h3>El primer día: Silencio y observación</h3>
      <p>Resiste la temptación de cogerlo o sacarlo de la jaula de inmediato. Deja que observe su entorno desde la seguridad de sus barrotes. Coloca la jaula en un lugar alto donde se sienta seguro, pero donde pueda ver la actividad de la casa.</p>

      <h3>Equipamiento básico</h3>
      <p>Asegúrate de tener listo:</p>
      <ul>
        <li>Una jaula espaciosa (mínimo 60cm de ancho para una pareja).</li>
        <li>Perchas de diferentes diámetros (madera natural, nunca plástico).</li>
        <li>Dos puntos de agua limpia y fresca.</li>
        <li>Al menos un juguete destructible para canalizar su energía inicial.</li>
      </ul>

      <p>Recuerda que crear un vínculo lleva tiempo. Empieza hablándole suavemente y ofreciéndole premios a través de los barrotes antes de intentar cualquier contacto físico directo.</p>
    `,
    category: 'Cuidados',
    image: 'https://i.postimg.cc/pXYq3s0p/Whisk_6fbdc3e46ffed709c5f4fc94a9ca9f4cdr.jpg',
    date: '05 ENE 2024',
    readTime: '5 min'
  }
];
