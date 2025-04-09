import { TMedia } from '@/types/t-media'

type StudiosListProps = {
  studios: TMedia['studios']['edges']
}

export function AnimeStudios({ studios }: StudiosListProps) {
  const animationStudio = studios.filter((studio) => studio.isMain)
  const producers = studios.reduce(
    (acc, curr) => {
      if (!curr.isMain && !acc.some((accArr) => curr.node.id == accArr.node.id)) {
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
                  {studio.node.name}
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
                  <span key={producer.node.id} className="text-main flex-1 text-lg">
                    {producer.node.name}
                  </span>
                )
              })
            : '?'}
        </div>
      </div>
    </div>
  )
}
