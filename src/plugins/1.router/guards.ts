import type { Router } from 'vue-router'

export const setupGuards = (router: Router) => {
  // 👉 router.beforeEach
  // Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
  router.beforeEach(async to => {
    /*
     * If it's a public route, continue navigation. This kind of pages are allowed to visited by login & non-login users. Basically, without any restrictions.
     * Examples of public routes are, 404, under maintenance, etc.
     */
    if (to.meta.public)
      return

    /**
     * Check if user is logged in by checking if token & user data exists in local storage
     * Feel free to update this logic to suit your needs
     */

    const session = await supabaseClient.auth.getSession()
    const isLoggedIn = !!session.data.session?.access_token

    if (isLoggedIn)
      localStorage.setItem('user', JSON.stringify(session.data.session?.user))

    // const isLoggedIn = !!(useCookie('App-User').value && useCookie('App-Token').value)

    /*
      If user is logged in and is trying to access login like page, redirect to home
      else allow visiting the page
      (WARN: Don't allow executing further by return statement because next code will check for permissions)
     */
    if (to.meta.unauthenticatedOnly) {
      if (isLoggedIn)
        return '/'
      else
        return undefined
    }

    // If user is not logged in, redirect to login page
    if (!isLoggedIn)
      return { name: 'login' }

    // if (!canNavigate(to)) {
    //   /* eslint-disable indent */
    //   return isLoggedIn
    //     ? { name: 'not-authorized' }
    //     : {
    //         name: 'login',
    //         query: {
    //           ...to.query,
    //           to: to.fullPath !== '/' ? to.path : undefined,
    //         },
    //       }
    //   /* eslint-enable indent */
    // }
  })
}
