export type WorldLandmark = {
  id: string
  number: string
  title: string
  category: "personal" | "education" | "career"
  dateRange?: string
  yearsSpent: number
  description: string
  x: number
  y: number
  landmarkType: "hospital" | "home-school" | "campus" | "studio" | "enterprise" | "connected"
  relatedProjectIds?: string[]
}

// Map Layout: Home & School is the HEART of the world at (x: 50, y: 50).
// All other islands surround Home chronologically in an organic, non-circular cluster.
export const worldLandmarks: WorldLandmark[] = [
  {
    id: "hospital",
    number: "01",
    title: "Hospital",
    category: "personal",
    yearsSpent: 0.02, // 1 week
    description: "The beginning of the story: born healthy with no complications, a brief 1-week starting point before the journey began.",
    x: 32, // South-West of Home
    y: 72,
    landmarkType: "hospital",
  },
  {
    id: "home-school",
    number: "02",
    title: "Home & School",
    category: "personal",
    dateRange: "0 – 18 Years",
    yearsSpent: 18, // 18 formative years!
    description: "Home is where the heart is. Childhood, growing up, family routines, and schooling—18 formative years at the core of the map.",
    x: 50, // DEAD CENTER
    y: 50,
    landmarkType: "home-school",
  },
  {
    id: "architecture-college",
    number: "03",
    title: "Architecture College",
    category: "education",
    dateRange: "5 Years",
    yearsSpent: 5, // 5 years B.Arch
    description: "5 years of rigorous architecture education that shaped a lasting framework for thinking through physical space, materials, structures, people, and systems.",
    x: 18, // West-Northwest
    y: 44,
    landmarkType: "campus",
  },
  {
    id: "spacescape",
    number: "04",
    title: "Spacescape Architects",
    category: "career",
    dateRange: "August 2016 – July 2018 (2 Years)",
    yearsSpent: 2, // 2 years
    description: "2 years in real-world architectural practice where ideas met physical construction, spatial constraints, detailing, and cross-functional teams.",
    x: 32, // North-Northwest
    y: 22,
    landmarkType: "studio",
  },
  {
    id: "warp",
    number: "05",
    title: "WARP Architects",
    category: "career",
    dateRange: "August 2018 – December 2019 (1.5 Years)",
    yearsSpent: 1.5, // 1.5 years
    description: "1.5 years exploring design workshops, bespoke details, and experimental spatial architecture.",
    x: 54, // North-Northeast
    y: 18,
    landmarkType: "studio",
  },
  {
    id: "design-college",
    number: "06",
    title: "Design College",
    category: "education",
    dateRange: "2 Years (COVID Era)",
    yearsSpent: 2, // 2 years Master's
    description: "2 years of design education marking the key transition from the physical realm of architecture into industrial and product design.",
    x: 74, // Northeast
    y: 30,
    landmarkType: "campus",
  },
  {
    id: "cognizant",
    number: "07",
    title: "Cognizant",
    category: "career",
    dateRange: "September 2022 – February 2024 (1.5 Years)",
    yearsSpent: 1.5, // 1.5 years
    description: "1.5 years designing complex enterprise applications, UX systems, and digital product workflows at scale.",
    x: 82, // East-Southeast
    y: 52,
    landmarkType: "enterprise",
  },
  {
    id: "motorq",
    number: "08",
    title: "Motorq",
    category: "career",
    dateRange: "March 2024 – Present (3 Years)",
    yearsSpent: 3, // 3 years
    description: "Connected-vehicle intelligence, fleet operational workflows, and data-dense interfaces that keep enterprise operations moving forward.",
    x: 68, // South-Southeast
    y: 74,
    landmarkType: "connected",
    relatedProjectIds: ["fuse-ai", "vehicle-recovery-console"],
  },
]
