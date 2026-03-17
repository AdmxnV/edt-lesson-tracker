export const EDT_LESSONS: string[] = [
  'Car Controls and Safety Checks',
  'Correct Positioning 1',
  'Changing Direction',
  'Progression Management',
  'Correct Positioning 2',
  'Anticipation and Reaction',
  'Sharing the Road',
  'Driving Safely through Traffic',
  'Changing Direction - More Complex Situations',
  'Speed Management',
  'Driving Calmly',
  'Night Driving',
]

export const TOTAL_LESSONS = 12

export const STUDENT_TYPES = [
  { value: 'full', label: 'Full EDT', description: 'All 12 lessons with you', color: 'blue' },
  { value: 'transfer', label: 'Transfer', description: 'Transferred from another ADI', color: 'purple' },
  { value: 'pre_test', label: 'Pre-Test Only', description: 'EDT done, came for prep only', color: 'amber' },
  { value: 'external', label: 'External', description: 'EDT done elsewhere, unknown history', color: 'gray' },
] as const
