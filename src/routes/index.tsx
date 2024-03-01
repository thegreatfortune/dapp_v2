import { type RouteObject } from 'react-router-dom'
import React, { lazy } from 'react'
import { Spin } from 'antd'
import { whiteList } from './guard/whiteList'
import BasicLayout from '@/layouts/BasicLayout'

import Test from '@/pages/Test'

const ApplyLoan = lazy(() => import('../pages/user/personal-center/apply-loan/index'))

const MyLoan = lazy(() => import('../pages/user/my-loan'))
const MyFollow = lazy(() => import('../pages/user/my-follow'))
const PersonalCenter = lazy(() => import('../pages/user/personal-center'))

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
      <BasicLayout>
        <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
          <PersonalCenter />
        </React.Suspense>
      </BasicLayout>
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
    path: '/my-follow',
    element: (
      <BasicLayout showInput={true}>
        <React.Suspense fallback={<div> <Spin size="large" />Loading...</div>}>
          <MyFollow />
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
