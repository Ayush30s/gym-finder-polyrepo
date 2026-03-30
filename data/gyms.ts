export type PriceTier = "Budget" | "Mid" | "Premium";
export type YearsCategory = "New" | "Established" | "Veteran";

export interface Gym {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  isFavorited: boolean;
  reviewCount: number;
  priceTier: PriceTier;
  pricePerMonth: number;
  yearsActive: number;
  tags: string[];
  isOpen: boolean;
  distance: string;
  highlight: string;
}

export const GYMS: Gym[] = [
  {
    id: "1",
    name: "Iron Forge Fitness",
    location: "42 West End Ave",
    city: "New York",
    rating: 4.8,
    reviewCount: 312,
    isFavorited: true,
    priceTier: "Premium",
    pricePerMonth: 120,
    yearsActive: 14,
    tags: ["Powerlifting", "CrossFit", "Sauna"],
    isOpen: true,
    distance: "0.4 km",
    highlight: "Olympic lifting platforms & coaches",
  },
  {
    id: "2",
    name: "Peak Performance Gym",
    location: "18 Sunset Blvd",
    city: "Los Angeles",
    rating: 4.6,
    reviewCount: 198,
    isFavorited: true,
    priceTier: "Mid",
    pricePerMonth: 75,
    yearsActive: 8,
    tags: ["Cardio", "HIIT", "Personal Training"],
    isOpen: true,
    distance: "1.2 km",
    highlight: "State-of-the-art cardio zone",
  },
  {
    id: "3",
    name: "FlexZone Community Gym",
    location: "5 Market St",
    city: "Chicago",
    rating: 4.2,
    reviewCount: 87,
    isFavorited: true,

    priceTier: "Budget",
    pricePerMonth: 25,
    yearsActive: 3,
    tags: ["General Fitness", "Group Classes"],
    isOpen: false,
    distance: "0.9 km",
    highlight: "Affordable monthly plans",
  },
  {
    id: "4",
    name: "EliteBody Studio",
    location: "200 Fifth Ave",
    city: "New York",
    rating: 4.9,
    isFavorited: true,

    reviewCount: 541,
    priceTier: "Premium",
    pricePerMonth: 180,
    yearsActive: 20,
    tags: ["Pilates", "Yoga", "Spa"],
    isOpen: true,
    distance: "2.1 km",
    highlight: "Luxury wellness experience",
  },
  {
    id: "5",
    name: "Beast Mode Boxing",
    location: "77 Canal St",
    city: "Miami",
    rating: 4.7,
    reviewCount: 263,
    isFavorited: true,

    priceTier: "Mid",
    pricePerMonth: 60,
    yearsActive: 6,
    tags: ["Boxing", "MMA", "Strength"],
    isOpen: true,
    distance: "1.7 km",
    highlight: "Pro boxing rings & sparring",
  },
  {
    id: "6",
    name: "Sunrise Yoga & Wellness",
    location: "3 Palm Drive",
    city: "San Diego",
    rating: 4.5,
    reviewCount: 144,
    priceTier: "Mid",
    isFavorited: true,

    pricePerMonth: 55,
    yearsActive: 5,
    tags: ["Yoga", "Meditation", "Stretching"],
    isOpen: true,
    distance: "0.6 km",
    highlight: "Hot yoga & mindfulness classes",
  },
  {
    id: "7",
    name: "GrindHouse Athletics",
    location: "101 Industrial Way",
    city: "Houston",
    rating: 4.3,
    isFavorited: true,

    reviewCount: 76,
    priceTier: "Budget",
    pricePerMonth: 20,
    yearsActive: 2,
    tags: ["Strength", "Functional Training"],
    isOpen: true,
    distance: "3.4 km",
    highlight: "No-frills hardcore training",
  },
  {
    id: "8",
    name: "Velocity Sports Club",
    location: "55 Harbor View",
    city: "Seattle",
    rating: 4.6,
    reviewCount: 309,
    priceTier: "Premium",
    isFavorited: true,

    pricePerMonth: 140,
    yearsActive: 12,
    tags: ["Swimming", "Tennis", "CrossFit"],
    isOpen: false,
    distance: "2.8 km",
    highlight: "Olympic pool & tennis courts",
  },
  {
    id: "9",
    name: "CoreCraft Fitness",
    location: "28 Oak Lane",
    city: "Austin",
    rating: 4.4,
    reviewCount: 112,
    isFavorited: true,

    priceTier: "Mid",
    pricePerMonth: 65,
    yearsActive: 4,
    tags: ["Core Training", "HIIT", "Nutrition"],
    isOpen: true,
    distance: "1.0 km",
    highlight: "Nutrition coaching included",
  },
  {
    id: "10",
    name: "LegacyFit Center",
    location: "9 Heritage Blvd",
    city: "Boston",
    rating: 4.8,
    isFavorited: true,
    reviewCount: 427,
    priceTier: "Premium",
    pricePerMonth: 160,
    yearsActive: 18,
    tags: ["Powerlifting", "Bodybuilding", "Recovery"],
    isOpen: true,
    distance: "0.7 km",
    highlight: "18 years of champion athletes",
  },
];

export function getYearsCategory(years: number): YearsCategory {
  if (years <= 3) return "New";
  if (years <= 10) return "Established";
  return "Veteran";
}
