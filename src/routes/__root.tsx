import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'
import ErrorPage from '../components/ErrorPage'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: () => {
    return (
      <ErrorPage
        errorCode="404"
        title="Page Not Found"
        description="Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL."
      />
    )
  },
})