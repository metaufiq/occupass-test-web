import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Home, ArrowLeft } from 'lucide-react'

import Header from '../components/Header'

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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Code */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary mb-4 tracking-tight">
              404
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>

          {/* Main Content Card */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8 card-hover shadow-lg">
            <div className="mb-6">
              <h2 className="text-3xl font-semibold text-card-foreground mb-4">
                Page Not Found
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Oops! The page you're looking for doesn't exist. It might have been moved, deleted, 
                or you entered the wrong URL.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-md"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-md"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mt-8 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              Error Code: 404 - Resource Not Found
            </span>
          </div>
        </div>
      </div>
    )
  },
})