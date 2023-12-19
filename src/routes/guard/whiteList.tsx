import { Spin } from 'antd'
import React, { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import type { IRouter } from '..'
import BasicLayout from '@/layouts/BasicLayout'
import PortalLayout from '@/layouts/PortalLayout'

const Market = lazy(() => import('../../pages/market'))
const Portal = lazy(() => import('../../pages/Portal'))
const Trade = lazy(() => import('../../pages/trade'))
const OrderViewAll = lazy(() => import('../../pages/market/order-view-all'))
const NotFound = lazy(() => import('../../pages/NotFound'))

export const whiteList: IRouter[] = [
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
