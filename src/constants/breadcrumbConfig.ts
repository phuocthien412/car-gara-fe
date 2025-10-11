import PATH from './path'

export const breadcrumbMap: Record<string, string> = {
  [PATH.HOME]: 'Bảng điều khiển',
  [PATH.USER]: 'Danh sách người dùng',
  [PATH.TICKET]: 'Danh sách Ticket',
  [PATH.TICKET_DETAIL]: 'Chi tiết Ticket',
  [PATH.MESSAGE]: 'Danh sách hội thoại',
  [PATH.MESSAGE_DETAIL]: 'Chi tiết hội thoại',
  [PATH.ADMIN_ROLE_ROLES]: 'Danh sách vai trò',
  [PATH.ADMIN_ROLE_PERMISSIONS]: 'Danh sách quyền',
  [PATH.WATER_QUALITY]: 'Quản lý chất lượng nước',
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
