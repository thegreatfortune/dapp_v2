// 路由表配置：src/routes/index.tsx
import { Navigate, type RouteObject } from 'react-router-dom'
import { lazy } from 'react'

const Home = lazy(() => import('../App'))
const NotFound = lazy(() => import('../pages/NotFound'))

const routes: RouteObject[] = [
  { path: '/', element: <Navigate to='/home' /> },
  { path: '/home', element: <Home /> },
  { path: '*', element: <NotFound /> },
]

export default routes
