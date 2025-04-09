import { TMedia } from '@/types/t-media'

type TAnimeFuzzyDateProps = { fuzzyDate: TMedia['startDate'] }

export function AnimeFuzzyDate({ fuzzyDate }: TAnimeFuzzyDateProps) {
  const { year, month, day } = fuzzyDate

  if (!year && !month && !day) {
    return <span className="flex-1 text-lg">?</span>
  }

  const parts: string[] = []

  if (day) {
    parts.push(String(day))
  }

  if (month) {
    const date = new Date()
    date.setMonth(month - 1)
    parts.push(date.toLocaleString('en-US', { month: 'short' }))
  }

  if (year) {
    parts.push(String(year))
  }

  const formattedDate = parts.join(', ')

  return <span className="flex-1 text-lg">{formattedDate}</span>
}
