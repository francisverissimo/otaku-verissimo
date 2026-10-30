type ErrorFallbackProps = {
  error: Error
  onRetry: () => void
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <div>
      <div className="m-auto flex flex-col p-4 shadow-xl">
        <strong>{error.name}</strong>
        <span>{error.message}</span>
      </div>
      <button onClick={onRetry}>Try again</button>
    </div>
  )
}
