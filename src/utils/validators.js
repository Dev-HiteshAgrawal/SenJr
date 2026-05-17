export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 8
}

export const validateName = (name) => {
  return name.trim().length >= 2
}

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-]{10,}$/
  return re.test(phone)
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== ''
}

export const getValidationError = (field, value) => {
  switch (field) {
    case 'email':
      if (!value) return 'Email is required'
      if (!validateEmail(value)) return 'Invalid email format'
      break
    case 'password':
      if (!value) return 'Password is required'
      if (!validatePassword(value)) return 'Password must be at least 8 characters'
      break
    case 'name':
      if (!value) return 'Name is required'
      if (!validateName(value)) return 'Name must be at least 2 characters'
      break
    case 'phone':
      if (value && !validatePhone(value)) return 'Invalid phone number'
      break
    default:
      return null
  }
  return null
}