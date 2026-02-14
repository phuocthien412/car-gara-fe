import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { eventTargetLS, getAccessTokenFromLS } from '@/utils/common'
import { useEffect, useState } from 'react'

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [token, setToken] = useState(getAccessTokenFromLS())

  useEffect(() => {
    const handleClearLS = () => {
      setToken('')
      navigate('/admin/login', { state: { from: location }, replace: true })
    }
    
    eventTargetLS.addEventListener('clearLS', handleClearLS)
    
    return () => {
      eventTargetLS.removeEventListener('clearLS', handleClearLS)
    }
  }, [navigate, location])

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}

