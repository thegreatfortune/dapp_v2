import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { IRouter } from '..'
import routes from '..'
import { whiteList } from './whiteList'
import useUserStore from '@/store/userStore'

const getCurrentRouterMap = (routers: IRouter[], path: string): IRouter => {
  for (const router of routers) {
    if (router.path === path)
      return router
    if (router.children) {
      const childRouter = getCurrentRouterMap(router.children, path)
      if (childRouter)
        return childRouter
    }
  }
  return routes[routes.length - 1]
}

export const RouterBeforeEach = ({ children }: any) => {
  const location = useLocation()
  const navigator = useNavigate()

  const { activeUser } = useUserStore()

  useEffect(() => {
    const router = getCurrentRouterMap(routes, location.pathname)

    if (!activeUser.accessToken && !whiteList.map(e => e.path).includes(location.pathname))
      navigator('/market')
  }, [location.pathname])

  return children
}
