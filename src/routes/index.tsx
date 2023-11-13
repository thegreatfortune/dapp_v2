import { Navigate, type RouteObject } from 'react-router-dom'
import React, { lazy } from 'react'
import BasicLayout from '@/layouts/BasicLayout'
import PersonalCenter from '@/pages/personal-center'
import Trade from '@/pages/trade'
import ApplyLoan from '@/pages/apply-loan'
import MyLoan from '@/pages/personal-center/my-loan'
import Lend from '@/pages/lend'

const Index = lazy(() => import('../pages/index'))
const NotFound = lazy(() => import('../pages/NotFound'))

interface IRouterMeta {
  title?: string
  icon?: string
  showInMenu?: boolean
  showInput?: boolean
}

const routes: (RouteObject & { meta?: IRouterMeta })[] = [
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
    meta: { showInput: false },
    element: (
      <BasicLayout>
        <React.Suspense fallback={<div>Loading...</div>}>
          <PersonalCenter />
        </React.Suspense>
      </BasicLayout>
    ),
  },
  {
    path: '/my-loan',
    meta: { showInput: false },
    element: (
      <BasicLayout>
        <React.Suspense fallback={<div>Loading...</div>}>
          <MyLoan />
        </React.Suspense>
      </BasicLayout>
    ),
  },
  {
    path: '/apply-loan',
    meta: { showInput: false },
    element: (
      <BasicLayout>
        <React.Suspense fallback={<div>Loading...</div>}>
          <ApplyLoan />
        </React.Suspense>
      </BasicLayout>
    ),
  },
  {
    path: '/lend',
    meta: { showInput: false },
    element: (
      <BasicLayout>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Lend />
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
