import type { RouteObject } from 'react-router-dom'
import React, { lazy } from 'react'
import BasicLayout from '@/layouts/BasicLayout'

const Index = lazy(() => import('../pages/index'))
const NotFound = lazy(() => import('../pages/NotFound'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <BasicLayout>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Index />
        </React.Suspense>
      </BasicLayout>
    ),
  },
  {
    path: '*',
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <NotFound />
      </React.Suspense>
    ),
  },
]

export default routes
