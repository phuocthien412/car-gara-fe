import PATH from './path'

export const breadcrumbMap: Record<string, string> = {
  [PATH.HOME]: 'Bảng điều khiển',
  [PATH.USER]: 'Danh sách người dùng',
}

// Helper function to get breadcrumb label for dynamic routes
export const getBreadcrumbLabel = (path: string): string => {
  // Check for exact matches first
  if (breadcrumbMap[path]) {
    return breadcrumbMap[path]
  }
  
  // Handle dynamic routes
  if (path.startsWith('/admin/message/') && path !== '/admin/message') {
    return 'Chi tiết hội thoại'
  }
  
  if (path.startsWith('/admin/ticket/') && path !== '/admin/ticket') {
    return 'Chi tiết Ticket'
  }
  
  if (path.startsWith('/user/') && path !== '/user') {
    return 'Chi tiết người dùng'
  }
  
  // Default fallback - return empty string to hide undefined pages
  return ''
}
