export const menuItems = [
  {
    id: 1,
    name: 'Smash Burger Royale',
    description: 'Double beef patty, aged cheddar, house pickles, smoked tomato relish, brioche.',
    price: 349,
    category: 'Signatures',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    prepTime: '14 min',
    calories: 720,
    tags: ['Best seller', 'Contains dairy'],
    spice: 1,
    accent: '#b42318',
  },
  {
    id: 2,
    name: 'Charred Chicken Bowl',
    description: 'Herb grilled chicken, citrus rice, avocado, pico, black beans, lime crema.',
    price: 329,
    category: 'Bowls',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    prepTime: '12 min',
    calories: 610,
    tags: ['High protein', 'Gluten free'],
    spice: 2,
    accent: '#237a57',
  },
  {
    id: 3,
    name: 'Wood Fired Margherita',
    description: 'San Marzano tomato, mozzarella, basil, olive oil, crisp blistered crust.',
    price: 429,
    category: 'Pizza',
    image:
      'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=900&q=80',
    prepTime: '16 min',
    calories: 840,
    tags: ['Vegetarian', 'Shareable'],
    spice: 0,
    accent: '#d9822b',
  },
  {
    id: 4,
    name: 'Rigatoni Alla Vodka',
    description: 'Bronze-cut rigatoni, tomato cream, parmesan, basil oil, toasted breadcrumbs.',
    price: 389,
    category: 'Pasta',
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80',
    prepTime: '15 min',
    calories: 760,
    tags: ['Comfort pick'],
    spice: 1,
    accent: '#a7472b',
  },
  {
    id: 5,
    name: 'Crispy Fish Tacos',
    description: 'Tempura cod, cabbage slaw, jalapeno crema, pickled onion, corn tortillas.',
    price: 319,
    category: 'Signatures',
    image:
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=80',
    prepTime: '11 min',
    calories: 520,
    tags: ['Bright', 'Contains seafood'],
    spice: 2,
    accent: '#2f7f91',
  },
  {
    id: 6,
    name: 'Roasted Beet Salad',
    description: 'Baby greens, roasted beets, citrus, goat cheese, pistachio, sherry vinaigrette.',
    price: 279,
    category: 'Garden',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
    prepTime: '8 min',
    calories: 410,
    tags: ['Vegetarian', 'Fresh'],
    spice: 0,
    accent: '#7f3d7a',
  },
  {
    id: 7,
    name: 'Truffle Parm Fries',
    description: 'Hand-cut fries, parmesan, herbs, cracked pepper, roasted garlic aioli.',
    price: 189,
    category: 'Sides',
    image:
      'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=80',
    prepTime: '7 min',
    calories: 490,
    tags: ['Shareable'],
    spice: 0,
    accent: '#9b6a1d',
  },
  {
    id: 8,
    name: 'Chocolate Olive Oil Cake',
    description: 'Dark chocolate cake, whipped mascarpone, sea salt, berry compote.',
    price: 229,
    category: 'Dessert',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
    prepTime: '6 min',
    calories: 530,
    tags: ['House dessert'],
    spice: 0,
    accent: '#5b3a29',
  },
  {
    id: 9,
    name: 'Blood Orange Spritz',
    description: 'Blood orange, rosemary, sparkling water, citrus peel, served over ice.',
    price: 149,
    category: 'Drinks',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
    prepTime: '3 min',
    calories: 130,
    tags: ['Zero proof'],
    spice: 0,
    accent: '#c24634',
  },
];

export const menuCategories = ['All', ...new Set(menuItems.map((item) => item.category))];

export const featuredItems = menuItems.filter((item) =>
  ['Smash Burger Royale', 'Charred Chicken Bowl', 'Wood Fired Margherita'].includes(item.name),
);

export const findMenuItem = (itemId) => menuItems.find((item) => item.id === Number(itemId));

export default menuItems;
