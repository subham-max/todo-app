import { useMemo, useState } from 'react'
import { AppIcon } from '../../../shared/components/AppIcon'
import { useTodos } from '../context/todosContext'
import type { Todo, TodoView } from '../types'

type TaskFilter = 'all' | 'active' | 'completed'

interface TaskBoardProps {
  view: TodoView
  onEdit: (todo: Todo) => void
}

function localDateString() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatDueDate(date: string) {
  if (date === localDateString()) return 'Today'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
    .format(new Date(`${date}T12:00:00`))
}

function TaskRow({ todo, onEdit }: { todo: Todo; onEdit: (todo: Todo) => void }) {
  const { toggleTodo } = useTodos()
  const isOverdue = !todo.completed && todo.dueDate < localDateString()

  return (
    <li className={`task-row${todo.completed ? ' is-completed' : ''}`}>
      <button
        className="task-complete"
        type="button"
        aria-label={todo.completed ? `Mark ${todo.title} incomplete` : `Complete ${todo.title}`}
        aria-pressed={todo.completed}
        onClick={() => toggleTodo(todo.id)}
      >
        {todo.completed && <AppIcon name="completed" />}
      </button>
      <button className="task-copy" type="button" onClick={() => onEdit(todo)}>
        <span className="task-title">{todo.title}</span>
        {todo.notes && <span className="task-notes">{todo.notes}</span>}
      </button>
      <span className={`task-category category-${todo.category.toLowerCase()}`}>
        <span />
        {todo.category}
      </span>
      <span className={`task-priority priority-${todo.priority}`}>
        <span className="priority-mark" />
        {todo.priority}
      </span>
      <span className={`task-due${isOverdue ? ' overdue' : ''}`}>
        {isOverdue && <span className="overdue-dot" />}
        {isOverdue ? 'Overdue' : formatDueDate(todo.dueDate)}
      </span>
      <button
        className="task-edit"
        type="button"
        onClick={() => onEdit(todo)}
        aria-label={`Edit ${todo.title}`}
      >
        <AppIcon name="edit" />
      </button>
    </li>
  )
}

function EmptyState({ searching, onClearSearch }: { searching: boolean; onClearSearch: () => void }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon"><AppIcon name={searching ? 'search' : 'sparkle'} /></span>
      <h3>{searching ? 'No matching tasks' : 'Nothing on your list'}</h3>
      <p>
        {searching
          ? 'Try another search or clear the search field.'
          : 'Enjoy the breathing room, or add a task when something comes to mind.'}
      </p>
      {searching && (
        <button type="button" onClick={onClearSearch}>Clear search</button>
      )}
    </div>
  )
}

export function TaskBoard({ view, onEdit }: TaskBoardProps) {
  const { todos, searchQuery, setSearchQuery } = useTodos()
  const [filter, setFilter] = useState<TaskFilter>('all')
  const today = localDateString()
  const visibleTodos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return todos
      .filter((todo) => {
        if (view === 'today') return !todo.completed && todo.dueDate <= today
        if (view === 'upcoming') return !todo.completed && todo.dueDate > today
        if (view === 'completed') return todo.completed
        if (filter === 'active') return !todo.completed
        if (filter === 'completed') return todo.completed
        return true
      })
      .filter((todo) => !query || `${todo.title} ${todo.notes} ${todo.category}`.toLowerCase().includes(query))
      .sort((left, right) =>
        left.dueDate.localeCompare(right.dueDate) ||
        ['high', 'medium', 'low'].indexOf(left.priority) - ['high', 'medium', 'low'].indexOf(right.priority),
      )
  }, [todos, view, today, filter, searchQuery])

  const allCount = view === 'all' ? todos.length : visibleTodos.length
  const activeCount = view === 'all' ? todos.filter((todo) => !todo.completed).length : visibleTodos.length
  const completedCount = view === 'all' ? todos.filter((todo) => todo.completed).length : 0

  return (
    <section className="task-board" aria-label="Task list">
      <div className="task-board-heading">
        <div>
          <h2>{view === 'today' ? 'Your focus list' : view === 'upcoming' ? 'Coming up' : view === 'completed' ? 'Look what you did' : 'Everything'}</h2>
          <p>
            {visibleTodos.length
              ? `${visibleTodos.length} ${visibleTodos.length === 1 ? 'task' : 'tasks'}${view === 'today' ? ' to focus on' : ''}`
              : 'Your list is up to date'}
          </p>
        </div>
        {view === 'all' && (
          <div className="list-filters" aria-label="Filter tasks">
            <button type="button" className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}>
              All <span>{allCount}</span>
            </button>
            <button type="button" className={filter === 'active' ? 'selected' : ''} onClick={() => setFilter('active')}>
              Open <span>{activeCount}</span>
            </button>
            <button type="button" className={filter === 'completed' ? 'selected' : ''} onClick={() => setFilter('completed')}>
              Done <span>{completedCount}</span>
            </button>
          </div>
        )}
      </div>
      {visibleTodos.length > 0 ? (
        <ul className="task-list">
          {visibleTodos.map((todo) => <TaskRow key={todo.id} todo={todo} onEdit={onEdit} />)}
        </ul>
      ) : (
        <EmptyState
          searching={Boolean(searchQuery.trim())}
          onClearSearch={() => setSearchQuery('')}
        />
      )}
    </section>
  )
}
