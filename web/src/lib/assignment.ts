export interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  createdAt: string
  trashed: boolean
  trashedAt?: string
  archived: boolean
  completedAt?: string
  resources: Resource[]
}

export interface Resource {
  name: string
  url: string
}

export const statuses = {
  PENDING: 'Venter',
  IN_PROGRESS: 'Pågår',
  COMPLETED: 'Ferdig'
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat('nb-NO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date)
}

export function calculateDueDate(targetDate: Date): string {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()

  if (diff <= 0) {
    return 'Utløpt!'
  }

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `om ${years} år`
  if (months > 0) return `om ${months} måned${months > 1 ? 'er' : ''}`
  if (weeks > 0) return `om ${weeks} uke${weeks > 1 ? 'r' : ''}`
  if (days > 0) return `om ${days} dag${days > 1 ? 'er' : ''}`
  if (hours > 0) return `om ${hours} time${hours > 1 ? 'r' : ''}`
  if (minutes > 0) return `om ${minutes} minutt${minutes > 1 ? 'er' : ''}`
  return `om ${seconds} sekund${seconds > 1 ? 'er' : ''}`
}
