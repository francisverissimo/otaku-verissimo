import { Link, useLocation, useParams } from 'react-router'
import { DotsThreeCircleVertical, IdentificationCard, Users } from '@phosphor-icons/react'

const tabs = [
  { icon: DotsThreeCircleVertical, name: 'overview', path: '' },
  { icon: Users, name: 'characters', path: '/characters' },
  { icon: IdentificationCard, name: 'staff', path: '/staff' },
]

export function AnimeNavigationTabs() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const activeTab = tabs.find((tab) => tab.path && pathname.endsWith(tab.path))?.name ?? 'overview'

  return (
    <>
      <div className="bg-darkTxt/5 fixed top-0 left-0 z-30 hidden h-screen w-14 flex-col justify-center gap-4 backdrop-blur md:flex">
        <div className="flex flex-1 flex-col justify-center gap-4">
          {tabs.map((tab) => {
            return (
              <Link
                key={tab.name}
                to={`/anime/${id}${tab.path}`}
                data-active={activeTab === tab.name}
                className="group data-[active=true]:text-main data-[active=true]:bg-main/10 relative flex h-14 cursor-pointer items-center justify-center gap-1 p-2"
              >
                <tab.icon size={32} weight={activeTab === tab.name ? 'fill' : 'regular'} />
                <span className="bg-darkBG pointer-events-none absolute left-[100%] w-fit scale-75 rounded-full px-4 py-2 opacity-0 duration-100 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 lg:block">
                  {tab.name.toUpperCase()}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="bg-darkBG/70 fixed right-0 bottom-0 left-0 z-30 flex h-14 backdrop-blur duration-300 md:hidden">
        <div className="group mx-auto flex h-full w-full max-w-5xl items-center justify-center gap-4 px-4">
          {tabs.map((tab) => {
            return (
              <Link
                key={tab.name}
                to={`/anime/${id}${tab.path}`}
                data-active={activeTab === tab.name}
                className="data-[active=true]:text-main flex h-14 cursor-pointer items-center justify-center gap-1 p-2 duration-100 data-[active=true]:pointer-events-none data-[active=true]:-translate-y-1 data-[active=true]:scale-x-110"
              >
                <tab.icon size={24} weight={activeTab === tab.name ? 'fill' : 'regular'} />
                <span className="text-sm uppercase">{tab.name.toUpperCase()}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
