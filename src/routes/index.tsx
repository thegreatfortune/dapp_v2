// 路由表配置：src/routes/index.tsx
import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import BasicLayout from '../layouts/BasicLayout'

const Index = lazy(() => import('../pages/index'))
const NotFound = lazy(() => import('../pages/NotFound'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <BasicLayout><Index /></BasicLayout>,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

export default routes
