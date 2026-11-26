import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../../auth/context/authContext'
import { createSeedTodos } from '../data/seedTodos'
import { isTodoCategory, isTodoPriority, type NewTodo, type Todo } from '../types'
import { TodosContext, type TodosContextValue } from './todosContext'

const STORAGE_PREFIX = 'daylist.todos.v1'

function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false
  const todo = value as Partial<Todo>
  return (
    typeof todo.id === 'string' &&
    typeof todo.title === 'string' &&
    typeof todo.notes === 'string' &&
    typeof todo.dueDate === 'string' &&
    isTodoPriority(todo.priority) &&
    isTodoCategory(todo.category) &&
    typeof todo.completed === 'boolean' &&
    typeof todo.createdAt === 'string'
  )
}

function storageKey(userId: number) {
  return `${STORAGE_PREFIX}.${userId}`
}

function loadTodos(userId: number) {
  const storedTodos = localStorage.getItem(storageKey(userId))
  if (!storedTodos) return createSeedTodos()

  const parsed: unknown = JSON.parse(storedTodos)
  if (!Array.isArray(parsed) || !parsed.every(isTodo)) {
    throw new Error('Saved tasks are invalid. Clear this browser’s daylist task data to continue.')
  }
  return parsed
}

interface TodosProviderProps {
  children: ReactNode
}

export function TodosProvider({ children }: TodosProviderProps) {
  const { user } = useAuth()
  if (!user) throw new Error('TodosProvider requires an authenticated user')

  const [todos, setTodos] = useState<Todo[]>(() => loadTodos(user.id))
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    localStorage.setItem(storageKey(user.id), JSON.stringify(todos))
  }, [todos, user.id])

  const addTodo = useCallback((input: NewTodo) => {
    const todo: Todo = {
      ...input,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTodos((current) => [todo, ...current])
  }, [])

  const updateTodo = useCallback((id: string, input: NewTodo) => {
    setTodos((current) => current.map((todo) =>
      todo.id === id ? { ...todo, ...input } : todo,
    ))
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos((current) => current.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    ))
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }, [])

  const value = useMemo<TodosContextValue>(() => ({
    todos,
    searchQuery,
    setSearchQuery,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  }), [todos, searchQuery, addTodo, updateTodo, toggleTodo, deleteTodo])

  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
}
