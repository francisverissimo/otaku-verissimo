export function useToken() {
  return {
    getURLToken() {
      const currentUrl = window.location.href

      if (!currentUrl.includes('#access_token=')) {
        return null
      }

      const accessToken = currentUrl.split('#access_token=')[1].split('&')[0]
      localStorage.setItem('access_token', accessToken)
      const cleanUrl = currentUrl.split('#')[0]
      window.history.replaceState({}, document.title, cleanUrl)
      return accessToken
    },
    getStoredToken() {
      const accessToken = localStorage.getItem('access_token')
      return accessToken ? accessToken : null
    },
  }
}
