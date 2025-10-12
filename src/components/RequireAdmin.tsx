import { Navigate, useLocation } from 'react-router-dom'
import { getAccessTokenFromLS } from '@/utils/common'

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const token = getAccessTokenFromLS()
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}

