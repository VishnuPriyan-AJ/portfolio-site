export type WorldLandmark = {
  id: string
  number: string
  title: string
  category: "personal" | "education" | "career"
  dateRange?: string
  description: string
  x: number
  y: number
  landmarkType: "hospital" | "home" | "school" | "campus" | "studio" | "enterprise" | "connected"
  relatedProjectIds?: string[]
}

export const worldLandmarks: WorldLandmark[] = [
  { id: "hospital", number: "01", title: "Hospital", category: "personal", description: "The beginning of the story: a small starting point before the map began to grow.", x: 8, y: 76, landmarkType: "hospital" },
  { id: "home", number: "02", title: "Home", category: "personal", description: "Childhood, home, curiosity, and the early habit of noticing how people and places fit together.", x: 18, y: 60, landmarkType: "home" },
  { id: "school", number: "03", title: "School", category: "education", description: "A first environment for independence, routines, questions, and finding a way through the world.", x: 29, y: 43, landmarkType: "school" },
  { id: "architecture-college", number: "04", title: "Architecture college", category: "education", description: "Architecture education shaped a way of thinking through space, materials, people, and systems.", x: 39, y: 62, landmarkType: "campus" },
  { id: "spacescape", number: "05", title: "Spacescape Architects", category: "career", dateRange: "August 2016 – July 2018", description: "An early professional chapter where ideas met real spaces, materials, constraints, and teams.", x: 50, y: 38, landmarkType: "studio" },
  { id: "warp", number: "06", title: "WARP Architects", category: "career", dateRange: "August 2018 – December 2019", description: "A separate architecture and design-workshop chapter, kept intentionally concise until more public detail is ready.", x: 61, y: 56, landmarkType: "studio" },
  { id: "design-college", number: "07", title: "Design college", category: "education", description: "A later design-education chapter during COVID, marking the shift from architecture toward industrial and product design.", x: 71, y: 31, landmarkType: "campus" },
  { id: "cognizant", number: "08", title: "Cognizant", category: "career", dateRange: "September 2022 – February 2024", description: "The transition into UX and enterprise product design, working with complex information and digital systems.", x: 82, y: 52, landmarkType: "enterprise" },
  { id: "motorq", number: "09", title: "Motorq", category: "career", dateRange: "March 2024 – Present", description: "The current product-design chapter: connected-vehicle intelligence, operational workflows, and interfaces that help work move forward.", x: 93, y: 24, landmarkType: "connected", relatedProjectIds: ["fuse-ai", "vehicle-recovery-console"] },
]
