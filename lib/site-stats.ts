export const siteStats = {
  countries: 15,
  students: 500,
  teachers: 8,
  experienceYears: 5,
  foundedYear: 2019,
  satisfaction: 4.9,
} as const

export const siteStatLabels = {
  students: { ar: "طالب وطالبة", en: "Students", fr: "Étudiants" },
  teachers: { ar: "معلمون ومعلمات", en: "Certified Teachers", fr: "Enseignants certifiés" },
  countries: { ar: "دولة حول العالم", en: "Countries Worldwide", fr: "Pays dans le monde" },
  experience: { ar: "سنوات من الخبرة", en: "Years of Experience", fr: "Années d'expérience" },
} as const
