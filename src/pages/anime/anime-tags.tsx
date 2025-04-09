import { Subtitle } from '@/components/subtitle'
import { MediaTag } from '@/types/t-media'
import { useState } from 'react'

interface TAnimeTagsProps {
  tags: MediaTag[]
}

export function AnimeTags({ tags }: TAnimeTagsProps) {
  const [showSpoilerTags, setShowSpoilerTags] = useState(false)

  if (!tags.length) {
    return null
  }

  return (
    <div>
      <div className="flex justify-between p-4">
        <Subtitle className="font-raleway p-4 text-xl font-semibold uppercase underline underline-offset-4">
          tags
        </Subtitle>

        {tags.find((item) => item.isMediaSpoiler === true) && (
          <button
            className="outline-main/50 cursor-pointer text-lg font-medium text-yellow-400 italic"
            onClick={() => setShowSpoilerTags(!showSpoilerTags)}
          >
            {showSpoilerTags ? 'hide spoiler' : 'show spoilers'}
          </button>
        )}
      </div>

      <ul className="flex flex-wrap gap-x-2 gap-y-4 px-4 pb-4">
        {tags.map((tag) => {
          if (!tag.isMediaSpoiler || showSpoilerTags) {
            return (
              <li key={tag.id} className="flex justify-between gap-2">
                <span
                  data-is-spoiler={tag.isMediaSpoiler}
                  className="rounded-3xl px-2 py-1 text-lg text-zinc-300 ring data-[is-spoiler=true]:text-yellow-400 data-[is-spoiler=true]:italic"
                >
                  {tag.name.concat(` · ${tag.rank}%`)}
                </span>
              </li>
            )
          }
        })}
      </ul>
    </div>
  )
}
