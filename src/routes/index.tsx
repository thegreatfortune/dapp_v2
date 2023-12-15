import { Navigate, type RouteObject } from 'react-router-dom'
import React, { lazy } from 'react'
import { Spin } from 'antd'
import BasicLayout from '@/layouts/BasicLayout'

import Test from '@/pages/Test'
import PortalLayout from '@/layouts/PortalLayout'
import DetailCard from '@/pages/loan/loan-details/components/DetailCard'

const Market = lazy(() => import('../pages/market'))
const Portal = lazy(() => import('../pages/Portal'))
const Trade = lazy(() => import('../pages/trade'))
const OrderViewAll = lazy(() => import('../pages/market/order-view-all'))
const LoanDetails = lazy(() => import('../pages/loan/loan-details'))
const PersonalCenter = lazy(() => import('../pages/personal-center'))
const ApplyLoan = lazy(() => import('../pages/loan/apply-loan'))
const MyLoan = lazy(() => import('../pages/personal-center/my-loan'))
const MyLend = lazy(() => import('../pages/personal-center/my-lend'))
const NotFound = lazy(() => import('../pages/NotFound'))

interface IRouterMeta {
  title?: string
  icon?: string
  isLoggedIn: boolean
}

const routes: (RouteObject & { meta?: IRouterMeta })[] = [
  {
    path: '/',
    element: <Navigate to="/portal" replace={true} />,
  },
  {
    path: '/portal',
    // meta: { showInput: false },
    element: (
      <PortalLayout>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Portal />
        </React.Suspense>
      </PortalLayout>
    ),
  },
  {
    path: '/market',
    index: true,
    element: (
      <BasicLayout showInput={true}>
        <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
          <Market />
        </React.Suspense>
      </BasicLayout>
    ),
  },
  {
    path: '/trade',
    index: true,
    element: (
      <BasicLayout>
        <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
          <Trade />
        </React.Suspense>
      </BasicLayout>
    ),
  },
  {
    path: '/personal-center',
    element: (
        <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
          <PersonalCenter />
        </React.Suspense>
    ),
  },
  {
    path: '/my-loan',
    element: (
      <BasicLayout showInput={true}>
        <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
          <MyLoan />
        </React.Suspense>
      </BasicLayout>
    ),
  },
  {
    path: '/my-lend',
    element: (
      <BasicLayout showInput={true}>
        <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
          <MyLend />
        </React.Suspense>
      </BasicLayout>
    ),
  },
  {
    path: '/apply-loan',
    element: (
      <BasicLayout>
        <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
          <ApplyLoan />
        </React.Suspense>
      </BasicLayout>
    ),
  },
  {
    path: '/loan-details',
    element: (
      <BasicLayout>
        <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
          <LoanDetails />
        </React.Suspense>
      </BasicLayout>
    ),
  },

  {
    path: '/view-all',
    element: (
      <BasicLayout showInput={true} >
        <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
          <OrderViewAll />
        </React.Suspense>
      </BasicLayout>
    ),
  },
  {
    path: '*',
    element: (
      <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
        <NotFound />
      </React.Suspense>
    ),
  },
]

if (import.meta.env.DEV) {
  routes.push(
    ...[
      {
        path: '/loan-details',
        element: (
          <BasicLayout>
            <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
              <DetailCard address={'src/pages/loan/loan-details/components/DetailCard.tsx'} />
            </React.Suspense>
          </BasicLayout>
        ),
      },
      {
        path: 'test',
        element: (
        <BasicLayout>
          <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
            <Test />
          </React.Suspense>
        </BasicLayout>
        ),

      }])
}

export default routes
