import { useEffect, useRef, type FormEvent } from 'react'
import { AppIcon } from '../../../shared/components/AppIcon'
import { Button } from '../../../shared/components/Button'
import { useTodos } from '../context/todosContext'
import { TODO_CATEGORIES, TODO_PRIORITIES, type NewTodo, type Todo } from '../types'

interface TaskDialogProps {
  todo: Todo | null
  onClose: () => void
}

function todayString() {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

export function TaskDialog({ todo, onClose }: TaskDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { addTodo, updateTodo, deleteTodo } = useTodos()

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const categoryValue = formData.get('category')
    const priorityValue = formData.get('priority')
    const values: NewTodo = {
      title: String(formData.get('title') ?? '').trim(),
      notes: String(formData.get('notes') ?? '').trim(),
      dueDate: String(formData.get('dueDate') ?? todayString()),
      category: TODO_CATEGORIES.find((category) => category === categoryValue) ?? 'Personal',
      priority: TODO_PRIORITIES.find((priority) => priority === priorityValue) ?? 'medium',
    }

    if (!values.title) return
    if (todo) updateTodo(todo.id, values)
    else addTodo(values)
    onClose()
  }

  function handleDelete() {
    if (!todo) return
    deleteTodo(todo.id)
    onClose()
  }

  return (
    <dialog
      className="task-dialog"
      ref={dialogRef}
      aria-labelledby="task-dialog-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <form className="task-form" onSubmit={handleSubmit}>
        <header className="dialog-heading">
          <div>
            <p className="eyebrow">{todo ? 'MAKE A CHANGE' : 'GET IT OUT OF YOUR HEAD'}</p>
            <h2 id="task-dialog-title">{todo ? 'Edit task' : 'Add a task'}</h2>
          </div>
          <button className="dialog-close" type="button" onClick={onClose} aria-label="Close dialog">
            <AppIcon name="close" />
          </button>
        </header>

        <label className="dialog-field">
          <span>What needs doing?</span>
          <input
            autoFocus
            name="title"
            defaultValue={todo?.title}
            placeholder="e.g. Prep for the team meeting"
            maxLength={120}
            required
          />
        </label>
        <label className="dialog-field">
          <span>A few details <small>Optional</small></span>
          <textarea
            name="notes"
            defaultValue={todo?.notes}
            placeholder="Add a note or a little context…"
            rows={3}
            maxLength={500}
          />
        </label>
        <div className="dialog-fields-row">
          <label className="dialog-field">
            <span>Due date</span>
            <input name="dueDate" type="date" defaultValue={todo?.dueDate ?? todayString()} required />
          </label>
          <label className="dialog-field">
            <span>Priority</span>
            <select name="priority" defaultValue={todo?.priority ?? 'medium'}>
              {TODO_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="dialog-field">
          <span>Area</span>
          <select name="category" defaultValue={todo?.category ?? 'Personal'}>
            {TODO_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>

        <footer className="dialog-actions">
          {todo && (
            <button className="delete-task-button" type="button" onClick={handleDelete}>
              <AppIcon name="delete" />
              Delete
            </button>
          )}
          <div>
            <button className="cancel-button" type="button" onClick={onClose}>Cancel</button>
            <Button type="submit">{todo ? 'Save changes' : 'Add task'}</Button>
          </div>
        </footer>
      </form>
    </dialog>
  )
}
