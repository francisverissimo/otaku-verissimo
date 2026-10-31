import { useState, type ComponentProps } from 'react'

type ImageProps = Omit<ComponentProps<'img'>, 'src'> & {
  /** AniList image URLs can be null; the image then stays transparent. */
  src: string | null | undefined
  /** Fade-in duration once the image has loaded. */
  fadeMs?: number
}

/** `<img>` that loads lazily and fades in when ready, instead of popping in. */
export function Image({
  src,
  fadeMs = 700,
  loading = 'lazy',
  style,
  onLoad,
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      {...props}
      src={src ?? undefined}
      loading={loading}
      style={{ opacity: loaded ? 1 : 0, transition: `opacity ${fadeMs}ms`, ...style }}
      onLoad={(event) => {
        setLoaded(true)
        onLoad?.(event)
      }}
    />
  )
}
