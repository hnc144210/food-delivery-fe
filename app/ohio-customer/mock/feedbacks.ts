export interface Review {
  id: string; customerName: string; isVerified: boolean
  rating: number; comment: string; images?: string[]
  likes: number; date: string; dishName: string; replied: boolean
}

export interface DishSummary {
  id: string; name: string; rating: number; totalReviews: number
}

export const mockReviews: Review[] = [
  {
    id: 'r1', customerName: 'Marcus Chen', isVerified: true, rating: 5,
    comment: 'The pork chop was incredibly tender and had that perfect smoky char. The brown rice was spot on. Easily the best lunch I\'ve had all week!',
    images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200'],
    likes: 11, date: '2 ngày trước', dishName: 'Signature Kinetic Bowl', replied: false,
  },
  {
    id: 'r2', customerName: 'Sarah Jenkins', isVerified: true, rating: 4,
    comment: 'Always consistent. My only small feedback is that the rice could use a bit more chili kick today, but overall still amazing quality.',
    likes: 6, date: '3 ngày trước', dishName: 'Truffle Mushroom Pizza', replied: true,
  },
  {
    id: 'r3', customerName: 'David Wilson', isVerified: true, rating: 5,
    comment: 'Large portions and great value. The packaging for delivery was secure and everything arrived hot.',
    likes: 0, date: '5 ngày trước', dishName: 'Wagyu Mini Sliders', replied: false,
  },
]

export const mockDishSummaries: DishSummary[] = [
  { id: 'd1', name: 'Signature Kinetic Bowl',  rating: 4.9, totalReviews: 1248 },
  { id: 'd2', name: 'Truffle Mushroom Pizza',  rating: 4.7, totalReviews: 248  },
  { id: 'd3', name: 'Wagyu Mini Sliders',      rating: 4.1, totalReviews: 312  },
  { id: 'd4', name: 'Harvest Kale Salad',      rating: 4.7, totalReviews: 248  },
]