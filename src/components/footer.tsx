export function Footer() {
  return (
    <footer className="mt-4 bg-zinc-900">
      <div className="mx-auto flex w-full max-w-5xl justify-end p-4">
        <div className="divide-main flex divide-x">
          <p className="pr-4 text-sm">
            <span>Powered by AniList</span>
          </p>

          <span className="space-x-1 pl-4 text-sm">
            <a
              href="https://francissportfolio.vercel.app/"
              target="_blank"
              className="text-second inline-block duration-200 hover:brightness-125"
            >
              francisverissimo
            </a>

            <span className="inline-block">&copy; {new Date().getFullYear()}</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
