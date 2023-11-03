import { Navigate, type RouteObject } from 'react-router-dom'
import React, { lazy } from 'react'
import BasicLayout from '@/layouts/BasicLayout'
import PersonalCenter from '@/pages/personal-center'
import Trade from '@/pages/trade'

const Index = lazy(() => import('../pages/index'))
const NotFound = lazy(() => import('../pages/NotFound'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/market" replace={true} />,
  },
  {
    path: '/market',
    index: true,
    element: (
      <BasicLayout>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Index />
        </React.Suspense>
      </BasicLayout>
    ),
  },
  {
    path: '/trade',
    index: true,
    element: (
      <BasicLayout>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Trade />
        </React.Suspense>
      </BasicLayout>
    ),
  },
  {
    path: '/personal-center',
    element: (
      <BasicLayout>
        <React.Suspense fallback={<div>Loading...</div>}>
          <PersonalCenter />
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
