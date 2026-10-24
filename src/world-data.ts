export type WorldLandmark = {
  id: string
  number: string
  title: string
  category: "personal" | "education" | "career" | "frontier"
  dateRange?: string
  description: string
  x: number
  y: number
  landmarkType: "home" | "studio" | "architecture" | "enterprise" | "connected" | "frontier"
  relatedProjectIds?: string[]
}

export const worldLandmarks: WorldLandmark[] = [
  { id: "origins", number: "01", title: "Origins", category: "personal", description: "Childhood, home, curiosity, and the early habit of noticing how people and places fit together.", x: 10, y: 70, landmarkType: "home" },
  { id: "education", number: "02", title: "Education", category: "education", description: "Architecture and industrial design education shaped a way of thinking through space, materials, people, and systems.", x: 25, y: 50, landmarkType: "studio" },
  { id: "spacescape", number: "03", title: "Spacescape Architects", category: "career", dateRange: "August 2016 – July 2018", description: "An early professional chapter where ideas met real spaces, materials, constraints, and teams.", x: 40, y: 66, landmarkType: "architecture" },
  { id: "warp", number: "04", title: "WARP Architects", category: "career", dateRange: "August 2018 – December 2019", description: "A related architecture and design-workshop chapter, kept intentionally concise until more public detail is ready.", x: 52, y: 40, landmarkType: "architecture" },
  { id: "cognizant", number: "05", title: "Cognizant", category: "career", dateRange: "September 2022 – February 2024", description: "The transition into UX and enterprise product design, working with complex information and digital systems.", x: 72, y: 55, landmarkType: "enterprise" },
  { id: "motorq", number: "06", title: "Motorq", category: "career", dateRange: "March 2024 – Present", description: "The current product-design chapter: connected-vehicle intelligence, operational workflows, and interfaces that help work move forward.", x: 84, y: 30, landmarkType: "connected", relatedProjectIds: ["fuse-ai", "vehicle-recovery-console"] },
  { id: "frontier", number: "07", title: "The unexplored frontier", category: "frontier", description: "A reminder that the map is still growing through continued learning, making, and thoughtful work.", x: 94, y: 12, landmarkType: "frontier" },
]
