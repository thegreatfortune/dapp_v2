import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserStore from '@/store/userStore'

interface RouteGuardProps {
  children: React.ReactNode
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const navigate = useNavigate()

  const { currentUser } = useUserStore()

  useEffect(() => {
    const isAuthenticated = currentUser.accessToken

    if (!isAuthenticated)
      navigate('/follows')
  }, [navigate])

  return <>{children}</>
}

export default RouteGuard
