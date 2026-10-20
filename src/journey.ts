export type JourneyMilestone = {
  number: number
  sourceId: `m${number}`
  chapter: "Stories" | "Spaces" | "Systems"
  title: string
  lesson: string
  description: string
  skills: string[]
}

export const journeyMilestones: JourneyMilestone[] = [
  { number: 1, sourceId: "m1", chapter: "Stories", title: "Infant Jesus Hospital", lesson: "Introducing myself with loud notifications", description: "A memorable beginning—announcing my arrival with all the volume I could manage.", skills: ["Awareness", "Expression", "First impressions"] },
  { number: 2, sourceId: "m2", chapter: "Stories", title: "Home & Town", lesson: "Absorbing stories and surroundings", description: "The people and places around me became a first education in noticing the world.", skills: ["Observation", "Empathy", "Context"] },
  { number: 3, sourceId: "m3", chapter: "Stories", title: "Keswick Public School", lesson: "Adapting to timetables and tiffin breaks", description: "Everyday rhythms taught me to adapt, find patterns, and make space for others.", skills: ["Adaptability", "Routines", "Community"] },
  { number: 4, sourceId: "m4", chapter: "Stories", title: "SDH Jain Vidyalaya", lesson: "Experimenting with choices beyond the syllabus", description: "Curiosity led me beyond the prescribed answers and into the freedom to try.", skills: ["Curiosity", "Experimentation", "Initiative"] },
  { number: 5, sourceId: "m5", chapter: "Spaces", title: "Tamil Nadu School of Architecture", lesson: "Interpreting spaces and stories", description: "Architecture taught me to understand how people, behavior, and place shape one another.", skills: ["Observation", "Storytelling", "Systems Thinking", "Design Foundations"] },
  { number: 6, sourceId: "m6", chapter: "Spaces", title: "Spacescape Architects", lesson: "Implementing ideas into real spaces", description: "Ideas met materials, constraints, and teams; design had to work in the real world.", skills: ["Execution", "Craft", "Problem Solving"] },
  { number: 7, sourceId: "m7", chapter: "Spaces", title: "WARP Architects", lesson: "Leading teams to shape bold spaces", description: "I learned to bring people together around a direction and make ambitious work real.", skills: ["Leadership", "Collaboration", "Direction"] },
  { number: 8, sourceId: "m8", chapter: "Systems", title: "School of Planning and Architecture", lesson: "Infusing products with empathy", description: "Human-centered design became a bridge from shaping physical spaces to shaping products.", skills: ["Empathy", "Human-Centered Design", "Product Thinking"] },
  { number: 9, sourceId: "m9", chapter: "Systems", title: "Cognizant Technology Solutions", lesson: "Interpreting data into experiences", description: "Complex information and systems became the raw material for clearer digital experiences.", skills: ["Data Interpretation", "UX Design", "Systems Thinking"] },
  { number: 10, sourceId: "m10", chapter: "Systems", title: "Motorq", lesson: "Impacting operations through interfaces", description: "I design interfaces that connect people with complex operations and help work move forward.", skills: ["Product Strategy", "Designing for Scale", "Impact"] },
]
