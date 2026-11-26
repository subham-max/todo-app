import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/context/authContext'
import { Brand } from '../../../shared/components/Brand'
import { AppIcon } from '../../../shared/components/AppIcon'
import { Button } from '../../../shared/components/Button'
import { TodosProvider } from '../context/TodosProvider'
import { useTodos } from '../context/todosContext'
import { TaskDialog } from './TaskDialog'
import type { Todo } from '../types'
import './todos.css'

const viewLabels = {
  today: 'Today',
  upcoming: 'Upcoming',
  all: 'All tasks',
  completed: 'Completed',
}

function getToday() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function TodoWorkspace() {
  const { user, signOut } = useAuth()
  const { todos, searchQuery, setSearchQuery } = useTodos()
  const [dialogTodo, setDialogTodo] = useState<Todo | null | undefined>(undefined)
  const navigate = useNavigate()
  const location = useLocation()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const view = (location.pathname.split('/').at(-1) || 'today') as keyof typeof viewLabels
  const label = viewLabels[view] ?? viewLabels.today
  const today = getToday()
  const [formattedDate] = useState(() =>
    new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()),
  )
  const todayTodos = todos.filter((todo) => todo.dueDate === today)
  const completedTodayCount = todayTodos.filter((todo) => todo.completed).length
  const activeTodos = todos.filter((todo) => !todo.completed)
  const completedCount = todos.filter((todo) => todo.completed).length
  const todayCount = todayTodos.filter((todo) => !todo.completed).length
  const firstName = user?.name.trim().split(/\s+/)[0] || 'there'

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  function handleSignOut() {
    signOut()
    navigate('/sign-in', { replace: true })
  }

  return (
    <div className="todo-shell">
      <aside className="todo-sidebar">
        <Brand className="app-brand" />
        <div className="workspace-switcher">
          <span className="workspace-avatar">D</span>
          <span className="workspace-name">
            <strong>Personal space</strong>
            <small>Free plan</small>
          </span>
        </div>

        <p className="sidebar-label">WORKSPACE</p>
        <nav className="sidebar-nav" aria-label="Task views">
          <NavLink to="/app/today" className={({ isActive }) => isActive ? 'active' : ''}>
            <AppIcon name="today" />
            <span>Today</span>
            <span className="nav-count">{todayCount}</span>
          </NavLink>
          <NavLink to="/app/upcoming" className={({ isActive }) => isActive ? 'active' : ''}>
            <AppIcon name="upcoming" />
            <span>Upcoming</span>
          </NavLink>
          <NavLink to="/app/all" className={({ isActive }) => isActive ? 'active' : ''}>
            <AppIcon name="all" />
            <span>All tasks</span>
            <span className="nav-count">{activeTodos.length}</span>
          </NavLink>
          <NavLink to="/app/completed" className={({ isActive }) => isActive ? 'active' : ''}>
            <AppIcon name="completed" />
            <span>Completed</span>
            <span className="nav-count">{completedCount}</span>
          </NavLink>
        </nav>

        <div className="sidebar-tip">
          <AppIcon name="sparkle" />
          <strong>Small steps add up.</strong>
          <span>You’ve completed {completedCount} {completedCount === 1 ? 'task' : 'tasks'} so far.</span>
        </div>

        <div className="sidebar-account">
          <span className="account-avatar">{firstName.charAt(0).toUpperCase()}</span>
          <span className="account-info">
            <strong>{user?.name}</strong>
            <small>{user?.email}</small>
          </span>
          <button type="button" className="logout-button" onClick={handleSignOut} aria-label="Sign out">
            <AppIcon name="logout" />
          </button>
        </div>
      </aside>

      <div className="todo-main">
        <header className="todo-topbar">
          <div className="topbar-context">
            <span className="topbar-kicker">PERSONAL SPACE</span>
            <span className="topbar-date">{formattedDate}</span>
          </div>
          <label className="task-search">
            <AppIcon name="search" />
            <input
              type="search"
              ref={searchInputRef}
              placeholder="Search your tasks"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search tasks"
            />
            <kbd>⌘ K</kbd>
          </label>
          <Button className="new-task-button" type="button" onClick={() => setDialogTodo(null)}>
            <AppIcon name="plus" />
            New task
          </Button>
          <button className="mobile-logout" type="button" onClick={handleSignOut} aria-label="Sign out">
            <AppIcon name="logout" />
          </button>
        </header>

        <main className="todo-content">
          <div className="mobile-greeting">
            <p className="eyebrow">YOUR DAY, IN FOCUS</p>
            <h1>Good day, {firstName}.</h1>
          </div>
          <section className="page-intro">
            <div>
              <p className="eyebrow">{view === 'today' ? 'YOUR DAY, IN FOCUS' : 'YOUR WORKSPACE'}</p>
              <h1>{view === 'today' ? `Good day, ${firstName}.` : label}</h1>
              <p>
                {view === 'today'
                  ? 'A clear plan makes room for a better day.'
                  : view === 'upcoming'
                    ? 'A little look ahead keeps the week feeling lighter.'
                    : view === 'completed'
                      ? 'Look at everything you have already made happen.'
                      : 'Everything you need to keep moving forward.'}
              </p>
            </div>
            {view === 'today' && (
              <div className="daily-progress" aria-label={`${completedTodayCount} of ${todayTodos.length} tasks due today completed`}>
                <span className="progress-ring" style={{ '--progress': `${todayTodos.length ? completedTodayCount / todayTodos.length * 100 : 0}%` } as CSSProperties}>
                  <span>{todayTodos.length ? Math.round(completedTodayCount / todayTodos.length * 100) : 0}%</span>
                </span>
                <span>
                  <strong>Daily progress</strong>
                  <small>{completedTodayCount} of {todayTodos.length} tasks done</small>
                </span>
              </div>
            )}
          </section>

          {view === 'today' && (
            <section className="summary-grid" aria-label="Task summary">
              <article className="summary-card">
                <span className="summary-icon summary-icon-green"><AppIcon name="today" /></span>
                <span><small>Due today</small><strong>{todayCount}</strong></span>
                <span className="summary-note">on your list</span>
              </article>
              <article className="summary-card">
                <span className="summary-icon summary-icon-peach"><AppIcon name="completed" /></span>
                <span><small>Completed</small><strong>{completedCount}</strong></span>
                <span className="summary-note">nice work</span>
              </article>
              <article className="summary-card summary-card-quote">
                <AppIcon name="sparkle" />
                <span><small>A gentle reminder</small><strong>One thing at a time.</strong></span>
              </article>
            </section>
          )}

          <Outlet context={{
            view,
            onEdit: (todo: Todo) => setDialogTodo(todo),
          }} />
        </main>
      </div>

      {dialogTodo !== undefined && (
        <TaskDialog
          todo={dialogTodo}
          onClose={() => setDialogTodo(undefined)}
        />
      )}
    </div>
  )
}

export function TodoLayout() {
  return (
    <TodosProvider>
      <TodoWorkspace />
    </TodosProvider>
  )
}
