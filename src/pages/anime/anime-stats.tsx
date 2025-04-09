interface AnimeStatsProps {
  average: number | null
  mean: number | null
  popularity: number | null
  favourites: number | null
}

export function AnimeStats(props: AnimeStatsProps) {
  const stats: Array<[key: string, value: number]> = Object.entries(props)

  return (
    <div className="divide-second/20 flex divide-x py-4">
      {stats.map(([key, value]) => {
        const shouldAddSuffix = ['average', 'mean'].includes(key)

        return (
          <div key={key} className="flex flex-col items-center justify-center px-4">
            <span className="text-xl font-medium">
              {(value ?? 0).toString().concat(shouldAddSuffix ? '%' : '')}
            </span>
            <span className="text-main text-lg">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </div>
        )
      })}
    </div>
  )
}
