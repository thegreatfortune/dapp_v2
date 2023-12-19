import { Navigate, type RouteObject } from 'react-router-dom'
import React, { lazy } from 'react'
import { Spin } from 'antd'
import { whiteList } from './guard/whiteList'
import BasicLayout from '@/layouts/BasicLayout'

import Test from '@/pages/Test'

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
  auth?: boolean
}

export type IRouter = (RouteObject & { meta?: IRouterMeta })

const routes: IRouter[] = [
  ...whiteList,
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
]

if (import.meta.env.DEV) {
  routes.push(
    ...[

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
