import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { ERROR_CODE } from '@/lib/constants'
import Header from '../components/Header'
import Footer from '@/components/Footer'
import ErrorPage from '../components/ErrorPage'

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
      <Footer />
    </div>
  ),
  notFoundComponent: () => {
    return (
      <ErrorPage
        errorCode={ERROR_CODE.NOT_FOUND}
        title="Page Not Found"
        description="Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL."
      />
    )
  },
})