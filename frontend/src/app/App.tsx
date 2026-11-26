import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AuthLayout } from '../features/auth/components/AuthLayout'
import { RequireAuth } from './RequireAuth'
import { RouteError } from './RouteError'

const SignInPage = lazy(() => import('../features/auth/pages/SignInPage'))
const SignUpPage = lazy(() => import('../features/auth/pages/SignUpPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const TodoLayout = lazy(() => import('../features/todos/components/TodoLayout').then((module) => ({ default: module.TodoLayout })))
const TodayPage = lazy(() => import('../features/todos/pages/TodayPage'))
const UpcomingPage = lazy(() => import('../features/todos/pages/UpcomingPage'))
const AllTasksPage = lazy(() => import('../features/todos/pages/AllTasksPage'))
const CompletedPage = lazy(() => import('../features/todos/pages/CompletedPage'))

function PageLoading() {
  return (
    <div className="page-loading" role="status">
      <span className="loading-indicator" />
      <span>Loading</span>
    </div>
  )
}

function withSuspense(page: ReactNode) {
  return <Suspense fallback={<PageLoading />}>{page}</Suspense>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/sign-in" replace />,
  },
  {
    element: <AuthLayout />,
    errorElement: <RouteError />,
    children: [
      {
        path: '/sign-in',
        element: withSuspense(<SignInPage />),
      },
      {
        path: '/sign-up',
        element: withSuspense(<SignUpPage />),
      },
    ],
  },
  {
    path: '/app',
    element: <RequireAuth><TodoLayout /></RequireAuth>,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <Navigate to="today" replace />,
      },
      {
        path: 'today',
        element: withSuspense(<TodayPage />),
      },
      {
        path: 'upcoming',
        element: withSuspense(<UpcomingPage />),
      },
      {
        path: 'all',
        element: withSuspense(<AllTasksPage />),
      },
      {
        path: 'completed',
        element: withSuspense(<CompletedPage />),
      },
    ],
  },
  {
    path: '*',
    element: withSuspense(<NotFoundPage />),
  },
])

function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
