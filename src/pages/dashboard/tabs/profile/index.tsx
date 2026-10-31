import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import { UnauthenticatedView } from '@/components/unauthenticated-view'

export function Profile() {
  const { user, signout } = useAuth()
  const navigate = useNavigate()

  if (user === undefined) return <span className="p-4 text-2xl">Loading...</span>

  if (user === null) return <UnauthenticatedView />

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4 pt-20">
      {user && (
        <>
          <img
            className="w-20 rounded-full"
            src={user.avatar.medium ?? undefined}
            alt="profile picture"
          />

          <span className="text-main text-2xl">{user.name}</span>

          <button
            className="mt-auto ml-auto w-full rounded p-1 text-red-600 ring-2 ring-red-600 transition hover:text-red-500 hover:ring-red-500"
            onClick={() => {
              signout()
              navigate('/')
            }}
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  )
}
