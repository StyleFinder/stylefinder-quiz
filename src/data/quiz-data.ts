// StyleFinder Quiz Data Structure
import { QuizQuestion, MultipleChoiceQuestion, StyleDescription } from '@/lib/types';

// Section 1: True/False Questions by Group
export const SECTION1_QUESTIONS: Record<string, QuizQuestion[]> = {
  groupA: [
    { id: 'A1', text: 'I like to express myself through what I wear', group: 'A' },
    { id: 'A2', text: "I don't let fashion dictate my personal style", group: 'A' },
    { id: 'A3', text: 'My friends admire my daring style', group: 'A' },
    { id: 'A4', text: 'I am not shy about wearing something different', group: 'A' },
    { id: 'A5', text: 'I am bold in my fashion choices and like to make a statement', group: 'A' },
    { id: 'A6', text: 'I like the attention my style brings', group: 'A' },
    { id: 'A7', text: 'I am known for my avant-garde wardrobe', group: 'A' },
  ],
  groupB: [
    { id: 'B1', text: 'I love mixing prints, bold colors and textures', group: 'B' },
    { id: 'B2', text: 'I am a patron of the arts', group: 'B' },
    { id: 'B3', text: 'I love designer labels that offer unique details', group: 'B' },
    { id: 'B4', text: 'I rarely wear black, but prefer fun colors', group: 'B' },
    { id: 'B5', text: 'My clothing and accessories are playful and fun', group: 'B' },
    { id: 'B6', text: 'I love to add an element of surprise to what I wear', group: 'B' },
    { id: 'B7', text: 'I enjoy adding unique accessories that are conversation starters', group: 'B' },
  ],
  groupC: [
    { id: 'C1', text: 'I love clothes that evoke a sense of tradition', group: 'C' },
    { id: 'C2', text: 'I like crisp, tailored styles of clothing', group: 'C' },
    { id: 'C3', text: "I don't follow the trends", group: 'C' },
    { id: 'C4', text: 'My look is best described as understated and timeless', group: 'C' },
    { id: 'C5', text: 'I favor pearls over diamonds', group: 'C' },
    { id: 'C6', text: 'I often dress in monochromatic outfits', group: 'C' },
    { id: 'C7', text: 'I am not a risk-taker when it comes to my style', group: 'C' },
  ],
  groupD: [
    { id: 'D1', text: 'I love clothes that evoke a sense of history and nostalgia', group: 'D' },
    { id: 'D2', text: 'I love wearing flowy layers', group: 'D' },
    { id: 'D3', text: "My friends think I'm a hippie at heart", group: 'D' },
    { id: 'D4', text: 'I love handcrafted details', group: 'D' },
    { id: 'D5', text: 'I love layers of fabric, ribbons and trims', group: 'D' },
    { id: 'D6', text: 'Accessories are an essential element to my style', group: 'D' },
    { id: 'D7', text: 'I favor deep, rich or muted colors', group: 'D' },
  ],
  groupE: [
    { id: 'E1', text: 'Comfort is key to me when getting dressed', group: 'E' },
    { id: 'E2', text: 'I lead an active lifestyle and like clothes that multitask', group: 'E' },
    { id: 'E3', text: 'I love a fresh pair of sneakers more than chic pumps', group: 'E' },
    { id: 'E4', text: 'Health and fitness are a priority and I make them part of my day', group: 'E' },
    { id: 'E5', text: 'My friends describe me as easygoing yet competitive', group: 'E' },
    { id: 'E6', text: 'I am driven and focused', group: 'E' },
    { id: 'E7', text: 'I wear yoga pants every chance I get', group: 'E' },
  ],
  groupF: [
    { id: 'F1', text: 'I am petite in stature with fine features', group: 'F' },
    { id: 'F2', text: 'I am often called cute', group: 'F' },
    { id: 'F3', text: 'My clothing is best described as refined and unfussy', group: 'F' },
    { id: 'F4', text: 'I prefer clothing that has structure yet creates a soft look', group: 'F' },
    { id: 'F5', text: 'I have to be careful that clothing doesn\'t overpower me', group: 'F' },
    { id: 'F6', text: 'I prefer pale, muted colors', group: 'F' },
    { id: 'F7', text: 'My look is soft and pretty', group: 'F' },
  ],
  groupG: [
    { id: 'G1', text: 'I am always on the forefront of fashion', group: 'G' },
    { id: 'G2', text: 'I wear the latest styles and trends', group: 'G' },
    { id: 'G3', text: 'I love clothes and am called a fashionista by friends', group: 'G' },
    { id: 'G4', text: 'My style is important to me', group: 'G' },
    { id: 'G5', text: 'I seek out certain labels because of their cache', group: 'G' },
    { id: 'G6', text: 'I have a great sense of style', group: 'G' },
    { id: 'G7', text: 'My status is important to me', group: 'G' },
  ],
  groupH: [
    { id: 'H1', text: 'I love simple, unfussy clothing', group: 'H' },
    { id: 'H2', text: 'I prefer natural fibers in my clothes', group: 'H' },
    { id: 'H3', text: 'I surround myself with things found in nature', group: 'H' },
    { id: 'H4', text: 'I love spending time outdoors', group: 'H' },
    { id: 'H5', text: 'I am a free-spirit', group: 'H' },
    { id: 'H6', text: 'I like things to be uncluttered and relaxed', group: 'H' },
    { id: 'H7', text: 'Comfort is key to me when getting dressed', group: 'H' },
  ],
};

// Section 2: Multiple Choice Questions
export const SECTION2_QUESTIONS: MultipleChoiceQuestion[] = [
  {
    id: 'Q1',
    text: 'My Favorite Decade for Fashion is:',
    options: {
      a: "1980's",
      b: "1960's", 
      c: "1950's",
      d: '1920s-30s',
      e: "1990's",
      f: '1950s',
      g: '2010s - 2020s',
      h: "1970's"
    }
  },
  {
    id: 'Q2',
    text: 'My favorite jacket is:',
    options: {
      a: 'Black and Sculptural',
      b: 'Cropped Moto Jacket in a fun color or print',
      c: 'Tailored Trench Coat',
      d: 'Long Velvet Duster',
      e: 'Hoodie, Bomber Jacket',
      f: 'Soft Wrap or Draped Cardigan',
      g: 'Structured Blazer with clean lines',
      h: 'Utility jacket or anorak'
    }
  },
  {
    id: 'Q3',
    text: 'My favorite color is:',
    options: {
      a: 'black, metallic gold',
      b: 'vibrant coral, turquoise',
      c: 'navy, camel',
      d: 'purple/lavender',
      e: 'fire-engine red, bright blue',
      f: 'blush pink/soft lavender',
      g: 'sleek silver, pure white',
      h: 'olive green, earth tones'
    }
  },
  {
    id: 'Q4',
    text: 'My favorite item of clothing is my:',
    options: {
      a: 'asymmetrical black jacket',
      b: 'textured sweater',
      c: 'tailored trousers',
      d: 'loose, flowy skirt',
      e: 'yoga pants',
      f: 'a silk blouse',
      g: 'dark wash denim',
      h: 'linen pants'
    }
  },
  {
    id: 'Q5',
    text: 'On the weekends I wear:',
    options: {
      a: 'Leather leggings, statement top, ankle boots',
      b: 'anything that mixes patterns and prints',
      c: 'Jeans, crisp button down, loafers',
      d: 'Midi dress, duster and boots',
      e: 'yoga pants, a tank and sneakers',
      f: 'Lace cami, soft sweater, jeans, ballet flats',
      g: 'Chic joggers and sweatshirt, designer sneakers and bag, baseball cap',
      h: 'Linen pants, cotton tee and a cardigan'
    }
  },
  {
    id: 'Q6',
    text: 'The color palette I mostly wear:',
    options: {
      a: 'Black with bold accents',
      b: 'Reds, oranges, pinks, multicolors',
      c: 'navy, khaki, black, white, brown',
      d: 'plum, mauve, brown',
      e: 'Optic brights, neon, gray',
      f: 'pink, muted shades, pastels',
      g: 'Bold, vibrant colors',
      h: 'Muted earth tones'
    }
  },
  {
    id: 'Q7',
    text: 'My favorite place to shop is:',
    options: {
      a: 'Cutting edge boutique',
      b: 'thrift store',
      c: 'Upscale department store',
      d: 'Flea market and secondhand store',
      e: 'sporting goods store, outdoors store',
      f: 'department store',
      g: 'Trendy boutique',
      h: 'funky boutique'
    }
  },
  {
    id: 'Q8',
    text: 'What best describes the décor of your home?',
    options: {
      a: 'Minimalist, architectural and sculptural',
      b: 'Funky, cheerful, colorful',
      c: 'Traditional',
      d: 'Vintage accents, luxe textures, rich colors',
      e: 'Comfortable',
      f: 'florals, wallpaper prints',
      g: 'Designer pieces, chic and modern',
      h: 'Wood accents, handcrafted touches'
    }
  },
  {
    id: 'Q9',
    text: 'When You Get Dressed What\'s Most Important to You?',
    options: {
      a: 'Do I make a statement and stand out?',
      b: 'Is my look fun?',
      c: 'Is my look timeless?',
      d: 'Is my look soft and feminine?',
      e: 'Does my look allow for ease of movement?',
      f: 'Is my outfit pretty?',
      g: 'Is my outfit on trend?',
      h: 'Is my look comfortable, yet chic?'
    }
  },
  {
    id: 'Q10',
    text: 'Your perfect wardrobe would consist of:',
    options: {
      a: 'Bold outfits that make a statement',
      b: 'Colorful layers, fun jackets, details that make people smile',
      c: 'Monochromatic outfits and neutral basics',
      d: 'Floaty, gauzy skirts and lacy tops',
      e: 'Yoga pants, knit tops, shorts',
      f: 'floral blouses and soft skirts',
      g: 'The latest designer handbag, tons of denim and chic tops',
      h: 'Comfy washable linen, handcrafted details'
    }
  },
  {
    id: 'Q11',
    text: 'You can only buy one pair of shoes this season. They are:',
    options: {
      a: 'Black sculptural platforms',
      b: 'Something playful and colorful',
      c: 'Timeless and neutral',
      d: 'a new pair of Western boots',
      e: 'Anything from Adidas',
      f: 'Sweet, pretty sandals',
      g: 'Sassy designer heels',
      h: "Rothy's flats"
    }
  },
  {
    id: 'Q12',
    text: 'My favorite piece of jewelry is:',
    options: {
      a: 'A bold ring that looks like a weapon',
      b: 'A conversation starting handbag',
      c: 'My pearls',
      d: 'Armfuls of bracelets',
      e: 'My waterproof watch',
      f: 'My locket necklace',
      g: 'Layers of designer gold',
      h: 'A handcrafted necklace'
    }
  },
  {
    id: 'Q13',
    text: 'My favorite style icon is:',
    options: {
      a: 'Lady Gaga, Madonna',
      b: 'Zoe Deschanel, Betsey Johnson',
      c: 'Jackie O., Princess Diana',
      d: 'Stevie Nicks',
      e: 'Gwen Stefani, Serena Williams',
      f: 'Audrey Hepburn',
      g: 'Victoria Beckham',
      h: 'Julia Roberts, Jane Birkin'
    }
  },
  {
    id: 'Q14',
    text: 'My dream car is a:',
    options: {
      a: 'Range Rover, Ferrari',
      b: 'Mini Cooper',
      c: 'Mercedes Benz',
      d: 'vintage Rolls Royce',
      e: 'Porsche',
      f: 'Fiat 500',
      g: 'Tesla',
      h: 'Subaru'
    }
  },
  {
    id: 'Q15',
    text: 'My Favorite Designer Labels are:',
    options: {
      a: 'Versace, Alexander McQueen, Issey Miyake',
      b: 'Lily Pulitzer, Betsey Johnson, Vince Camuto',
      c: 'Burberry, Coach, Ralph Lauren',
      d: 'Diane von Furstenburg, Free People, Anthropologie',
      e: 'Adidas, Stella McCartney, Athleta',
      f: 'Nanette Lepore, Liberty of London',
      g: 'Trina Turk, Michael Kors, Tory Burch',
      h: 'Patagonia, Eileen Fisher, J. Jill'
    }
  },
  {
    id: 'Q16',
    text: 'My Perfect Designer Handbag would be:',
    options: {
      a: 'Louis Vuitton, Kurt Geiger',
      b: 'Kate Spade, Judith Leiber',
      c: 'Coach, Chanel',
      d: 'Anything with fringe',
      e: 'Prada Nylon Backpack',
      f: 'Chloé',
      g: 'Gucci',
      h: 'Hobo, something handcrafted'
    }
  },
  {
    id: 'Q17',
    text: 'Friends would describe my style as:',
    options: {
      a: 'bold, theatrical, unapologetically head-turning',
      b: 'quirky, playful, vintage-inspired charm',
      c: 'refined, timeless, eternally elegant',
      d: 'sensual, elegant, luxurious with a touch of softness',
      e: 'powerful, athletic, stylish with performance energy',
      f: 'graceful, feminine, light and timelessly pretty',
      g: 'minimalist, modern, sleek, future-forward',
      h: 'effortless, earthy, naturally chic'
    }
  }
];

// Style Mapping and Categories
export const STYLE_MAPPING = {
  A: 'Dramatic',
  B: 'Whimsical',
  C: 'Classic', 
  D: 'Romantic',
  E: 'Sporty',
  F: 'Delicate',
  G: 'Contemporary',
  H: 'Natural'
} as const;

export const YANG_STYLES = ['A', 'C', 'E', 'G'] as const;
export const YIN_STYLES = ['B', 'D', 'F', 'H'] as const;

// Style Descriptions for Results Pages
export const STYLE_DESCRIPTIONS: Record<string, StyleDescription> = {
  dramatic: {
    id: 'A',
    name: 'Dramatic',
    description: 'Bold, theatrical, and unapologetically head-turning. You make a statement with your fashion choices and love clothes that express your dynamic personality.',
    characteristics: ['Statement pieces', 'Bold silhouettes', 'Sculptural elements', 'Avant-garde details'],
    colors: ['Black', 'Metallic gold', 'Bold accents'],
    keywords: ['Bold', 'Theatrical', 'Statement-making', 'Avant-garde']
  },
  whimsical: {
    id: 'B', 
    name: 'Whimsical',
    description: 'Quirky, playful, and vintage-inspired charm. You love mixing prints, textures, and unique pieces that spark conversation and bring joy.',
    characteristics: ['Mixed prints', 'Playful accessories', 'Unique details', 'Conversation starters'],
    colors: ['Vibrant coral', 'Turquoise', 'Fun multicolors'],
    keywords: ['Playful', 'Quirky', 'Artistic', 'Creative']
  },
  classic: {
    id: 'C',
    name: 'Classic',
    description: 'Refined, timeless, and eternally elegant. You prefer crisp, tailored pieces that evoke tradition and understated sophistication.',
    characteristics: ['Tailored silhouettes', 'Timeless pieces', 'Understated elegance', 'Traditional elements'],
    colors: ['Navy', 'Camel', 'Black', 'White', 'Brown'],
    keywords: ['Timeless', 'Elegant', 'Sophisticated', 'Traditional']
  },
  romantic: {
    id: 'D',
    name: 'Romantic', 
    description: 'Sensual, elegant, and luxurious with a touch of softness. You love flowing fabrics, rich textures, and pieces with historical charm.',
    characteristics: ['Flowing layers', 'Rich textures', 'Handcrafted details', 'Vintage elements'],
    colors: ['Purple', 'Lavender', 'Plum', 'Mauve', 'Deep rich tones'],
    keywords: ['Feminine', 'Flowing', 'Luxurious', 'Nostalgic']
  },
  sporty: {
    id: 'E',
    name: 'Sporty',
    description: 'Powerful, athletic, and stylish with performance energy. Comfort and functionality are key, with an active lifestyle driving your wardrobe choices.',
    characteristics: ['Comfortable fits', 'Performance fabrics', 'Athletic elements', 'Multifunctional pieces'],
    colors: ['Fire-engine red', 'Bright blue', 'Optic brights', 'Neon', 'Gray'],
    keywords: ['Active', 'Comfortable', 'Performance', 'Energetic']
  },
  delicate: {
    id: 'F',
    name: 'Delicate',
    description: 'Graceful, feminine, light and timelessly pretty. You prefer refined, soft looks with careful attention to proportions and gentle colors.',
    characteristics: ['Refined silhouettes', 'Soft textures', 'Pretty details', 'Structured yet gentle'],
    colors: ['Blush pink', 'Soft lavender', 'Pastels', 'Muted shades'],
    keywords: ['Pretty', 'Soft', 'Refined', 'Gentle']
  },
  contemporary: {
    id: 'G',
    name: 'Contemporary',
    description: 'Minimalist, modern, sleek, and future-forward. You stay on the forefront of fashion with clean lines and the latest designer pieces.',
    characteristics: ['Clean lines', 'Modern silhouettes', 'Designer pieces', 'Trend-forward'],
    colors: ['Sleek silver', 'Pure white', 'Bold vibrant colors'],
    keywords: ['Modern', 'Sleek', 'Fashionable', 'Trend-setting']
  },
  natural: {
    id: 'H',
    name: 'Natural', 
    description: 'Effortless, earthy, and naturally chic. You prefer simple, comfortable pieces in natural fibers with an uncluttered, relaxed aesthetic.',
    characteristics: ['Natural fibers', 'Simple silhouettes', 'Handcrafted touches', 'Uncluttered style'],
    colors: ['Olive green', 'Earth tones', 'Muted naturals'],
    keywords: ['Natural', 'Comfortable', 'Relaxed', 'Earthy']
  }
};