export type TodoPriority = 'high' | 'medium' | 'low'
export type TodoCategory = 'Work' | 'Personal' | 'Wellness'
export type TodoView = 'today' | 'upcoming' | 'all' | 'completed'
export const TODO_CATEGORIES: TodoCategory[] = ['Work', 'Personal', 'Wellness']
export const TODO_PRIORITIES: TodoPriority[] = ['high', 'medium', 'low']

export function isTodoCategory(value: unknown): value is TodoCategory {
  return TODO_CATEGORIES.some((category) => category === value)
}

export function isTodoPriority(value: unknown): value is TodoPriority {
  return TODO_PRIORITIES.some((priority) => priority === value)
}

export interface Todo {
  id: string
  title: string
  notes: string
  dueDate: string
  priority: TodoPriority
  category: TodoCategory
  completed: boolean
  createdAt: string
}

export type NewTodo = Pick<Todo, 'title' | 'notes' | 'dueDate' | 'priority' | 'category'>
