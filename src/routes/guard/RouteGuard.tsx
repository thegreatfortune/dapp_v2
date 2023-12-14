import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserStore from '@/store/userStore'

interface RouteGuardProps {
  children: React.ReactNode
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const navigate = useNavigate()

  const { activeUser } = useUserStore()

  useEffect(() => {
    const isAuthenticated = activeUser.accessToken

    if (!isAuthenticated)
      navigate('/market')
  }, [navigate])

  return <>{children}</>
}

export default RouteGuard
