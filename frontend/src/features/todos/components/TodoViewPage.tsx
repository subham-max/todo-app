import { useOutletContext } from 'react-router-dom'
import { TaskBoard } from './TaskBoard'
import type { Todo, TodoView } from '../types'

interface TodoPageContext {
  view: TodoView
  onEdit: (todo: Todo) => void
}

interface TodoViewPageProps {
  view: TodoView
}

export function TodoViewPage({ view }: TodoViewPageProps) {
  const { onEdit } = useOutletContext<TodoPageContext>()
  return <TaskBoard view={view} onEdit={onEdit} />
}
