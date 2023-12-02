import { Navigate, type RouteObject } from 'react-router-dom'
import React, { lazy } from 'react'
import { Spin } from 'antd'
import BasicLayout from '@/layouts/BasicLayout'
import PersonalCenter from '@/pages/personal-center'
import Trade from '@/pages/trade'
import ApplyLoan from '@/pages/loan/apply-loan'
import MyLoan from '@/pages/personal-center/my-loan'
import OrderViewAll from '@/pages/market/order-view-all'
import LoanDetails from '@/pages/loan/loan-details'
import MyLend from '@/pages/personal-center/my-lend'
import Test from '@/pages/Test'

const Market = lazy(() => import('../pages/market'))
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
    meta: { showInput: false },
    element: (
      <BasicLayout>
        <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
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
        <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
          <MyLoan />
        </React.Suspense>
      </BasicLayout>
    ),
  },
  {
    path: '/my-lend',
    meta: { showInput: false },
    element: (
      <BasicLayout>
        <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
          <MyLend />
        </React.Suspense>
      </BasicLayout>
    ),
  },
  {
    path: '/apply-loan',
    meta: { showInput: false },
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
    meta: { showInput: false },
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
    meta: { showInput: false },
    element: (
      <BasicLayout>
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
    {
      path: 'test',
      meta: { showInput: false },
      element: (
        <BasicLayout>
          <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
            <Test />
          </React.Suspense>
        </BasicLayout>
      ),

    })
}

export default routes
