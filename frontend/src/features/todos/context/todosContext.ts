import { createContext, useContext } from 'react'
import type { NewTodo, Todo } from '../types'

export interface TodosContextValue {
  todos: Todo[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  addTodo: (input: NewTodo) => void
  updateTodo: (id: string, input: NewTodo) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
}

export const TodosContext = createContext<TodosContextValue | null>(null)

export function useTodos() {
  const context = useContext(TodosContext)
  if (!context) throw new Error('useTodos must be used within TodosProvider')
  return context
}
