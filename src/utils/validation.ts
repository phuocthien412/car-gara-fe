export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateEmail(email: string): string | null {
  if (!email) return 'Email là bắt buộc'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email) ? null : 'Email không hợp lệ'
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Mật khẩu là bắt buộc'
  if (password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự'
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasDigit = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  if (!(hasUpper && hasLower && hasDigit && hasSpecial)) {
    return 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt'
  }
  return null
}