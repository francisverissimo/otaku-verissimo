import { useNavigate } from 'react-router'
import { CaretLeft } from '@phosphor-icons/react'

export function AnimeHeader() {
  const navigate = useNavigate()

  function handleGoBack() {
    if (window.history.state && window.history.state.idx > 0) {
      return navigate(-1)
    }

    navigate('/')
  }

  return (
    <div className="fixed top-0 right-0 left-0 z-40 w-full">
      <div className="mx-auto flex w-full max-w-5xl justify-between p-4">
        <div
          className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
          onClick={handleGoBack}
        >
          <CaretLeft size={24} className="text-white" />
        </div>
      </div>
    </div>
  )
}
