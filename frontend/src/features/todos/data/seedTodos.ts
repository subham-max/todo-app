import type { Todo } from '../types'

function dayOffset(offset: number) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function createSeedTodos(): Todo[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'seed-plan-week',
      title: 'Plan the week ahead',
      notes: 'Review priorities and block out time for focused work.',
      dueDate: dayOffset(0),
      priority: 'high',
      category: 'Work',
      completed: false,
      createdAt: now,
    },
    {
      id: 'seed-lunch',
      title: 'Take a proper lunch break',
      notes: '',
      dueDate: dayOffset(0),
      priority: 'low',
      category: 'Wellness',
      completed: false,
      createdAt: now,
    },
    {
      id: 'seed-plants',
      title: 'Water the plants',
      notes: '',
      dueDate: dayOffset(0),
      priority: 'medium',
      category: 'Personal',
      completed: true,
      createdAt: now,
    },
    {
      id: 'seed-project',
      title: 'Share the project update',
      notes: 'Include the latest milestones and next steps.',
      dueDate: dayOffset(1),
      priority: 'high',
      category: 'Work',
      completed: false,
      createdAt: now,
    },
    {
      id: 'seed-groceries',
      title: 'Pick up groceries',
      notes: 'Oats, berries, and coffee.',
      dueDate: dayOffset(2),
      priority: 'medium',
      category: 'Personal',
      completed: false,
      createdAt: now,
    },
    {
      id: 'seed-walk',
      title: 'Go for an evening walk',
      notes: '',
      dueDate: dayOffset(3),
      priority: 'low',
      category: 'Wellness',
      completed: false,
      createdAt: now,
    },
  ]
}
