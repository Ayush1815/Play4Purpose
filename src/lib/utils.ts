import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function getDaysUntil(dateString: string): number {
  const target = new Date(dateString)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getNextDrawDate(): Date {
  const now = new Date()
  // Draw is on the last day of every month
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return next
}

export function getScoreColor(score: number): string {
  if (score <= 25) return 'text-emerald-600 bg-emerald-50'
  if (score <= 35) return 'text-amber-600 bg-amber-50'
  return 'text-rose-600 bg-rose-50'
}

export function validateScore(score: number): boolean {
  return Number.isInteger(score) && score >= 1 && score <= 45
}

export function getPrizePercentage(matchCount: 3 | 4 | 5): number {
  const percentages = { 3: 20, 4: 20, 5: 60 }
  return percentages[matchCount]
}
