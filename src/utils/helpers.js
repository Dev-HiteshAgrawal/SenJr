import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return format(d, 'MMM dd, yyyy')
}

export const formatDateTime = (date) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return format(d, 'MMM dd, yyyy HH:mm')
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  
  if (isToday(d)) {
    return `Today at ${format(d, 'HH:mm')}`
  }
  if (isYesterday(d)) {
    return `Yesterday at ${format(d, 'HH:mm')}`
  }
  return formatDistanceToNow(d, { addSuffix: true })
}

export const calculateLevel = (xp) => {
  return Math.floor(xp / 1000) + 1
}

export const calculateXPProgress = (xp) => {
  return (xp % 1000) / 10
}

export const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}