export interface DishSize {
  id: string
  name: string
}

export interface DishTopping {
  id: string
  name: string
  price: number
}

export interface Dish {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  category: string
  isAvailable: boolean
  sizes: DishSize[]
  toppings: DishTopping[]
  allowCustomerNotes: boolean
}

export interface MenuCategory {
  id: string
  name: string
}

export const mockCategories: MenuCategory[] = [
  { id: 'all', name: 'All Dishes' },
  { id: 'main', name: 'Main Dishes' },
  { id: 'starters', name: 'Starters' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'desserts', name: 'Desserts' },
]

export const mockDishes: Dish[] = [
  {
    id: 'd1',
    name: 'Com Tam Suon',
    price: 85000,
    description: 'Authentic Broken Rice with Grilled Pork',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300',
    category: 'main',
    isAvailable: true,
    sizes: [{ id: 's1', name: 'Small' }, { id: 's2', name: 'Medium' }],
    toppings: [
      { id: 't1', name: 'Extra Pork', price: 5000 },
      { id: 't2', name: 'Gỏi đơi thịt', price: 25000 },
    ],
    allowCustomerNotes: true,
  },
  {
    id: 'd2',
    name: 'Pho Dac Biet',
    price: 95000,
    description: 'Special Beef Combination Noodle Soup',
    imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=300',
    category: 'main',
    isAvailable: true,
    sizes: [{ id: 's3', name: 'Regular' }, { id: 's4', name: 'Large' }],
    toppings: [
      { id: 't3', name: 'Rare Beef', price: 8000 },
      { id: 't4', name: 'Meatballs', price: 6000 },
    ],
    allowCustomerNotes: false,
  },
  {
    id: 'd3',
    name: 'Signature Kinetic Bowl',
    price: 75000,
    description: 'Our signature bowl with fresh seasonal ingredients',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300',
    category: 'starters',
    isAvailable: false,
    sizes: [],
    toppings: [],
    allowCustomerNotes: false,
  },
  {
    id: 'd4',
    name: 'Bun Bo Hue',
    price: 80000,
    description: 'Spicy Hue-style Beef Noodle Soup',
    imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=300',
    category: 'main',
    isAvailable: true,
    sizes: [{ id: 's5', name: 'Regular' }, { id: 's6', name: 'Large' }],
    toppings: [{ id: 't5', name: 'Extra Chili', price: 2000 }],
    allowCustomerNotes: true,
  },
]