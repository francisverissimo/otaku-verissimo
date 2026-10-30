import shortLogo from '@/assets/logo-short.svg'

export function DefaultLoading() {
  return (
    <div className="flex w-full animate-pulse flex-col items-center justify-center p-4 opacity-40">
      <img src={shortLogo} alt="ov logo" className="w-16" />

      <span className="text-xl font-medium">Loading...</span>
    </div>
  )
}
