import type { AnimeView } from './anime-queries'

type StudiosListProps = {
  studios: AnimeView['studios']
}

export function AnimeStudios({ studios }: StudiosListProps) {
  const animationStudio = studios.filter((studio) => studio.isMain)
  const producers = studios.reduce(
    (acc, curr) => {
      if (!curr.isMain && !acc.some((accArr) => curr.id == accArr.id)) {
        acc.push(curr)
      }

      return acc
    },
    [] as StudiosListProps['studios']
  )

  return (
    <div className="flex flex-col gap-2 px-4">
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <span className="min-w-[110px] text-lg">Studios</span>

        <div className="flex flex-col gap-1">
          {animationStudio && animationStudio.length > 0
            ? animationStudio.map((studio, idx) => (
                <span key={idx} className="text-main flex-1 text-lg">
                  {studio.name}
                </span>
              ))
            : '?'}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <span className="min-w-[110px] text-lg">Producers</span>

        <div className="flex flex-col gap-1">
          {producers && producers.length > 0
            ? producers.map((producer) => {
                return (
                  <span key={producer.id} className="text-main flex-1 text-lg">
                    {producer.name}
                  </span>
                )
              })
            : '?'}
        </div>
      </div>
    </div>
  )
}
