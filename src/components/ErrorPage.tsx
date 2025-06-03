import { Link } from '@tanstack/react-router'
import { Home, ArrowLeft, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface CustomAction {
  label: string
  onClick?: () => void
  to?: string
  icon?: LucideIcon
  variant?: 'primary' | 'secondary'
}

interface ErrorPageProps {
  errorCode?: string | number
  title: string
  description: string
  customActions?: CustomAction[]
  showDefaultActions?: boolean
}

const DEFAULT_ACTIONS: CustomAction[] = [
  {
    label: 'Go Home',
    to: '/',
    icon: Home,
    variant: 'primary'
  },
  {
    label: 'Go Back',
    onClick: () => window.history.back(),
    icon: ArrowLeft,
    variant: 'secondary'
  }
]

const getButtonClasses = (variant: 'primary' | 'secondary' = 'primary') => {
  return cn(
    "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-md",
    variant === 'primary' 
      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
      : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
  )
}

const renderAction = (action: CustomAction, index: number) => {
  const IconComponent = action.icon
  const buttonClasses = getButtonClasses(action.variant)

  if (action.to) {
    return (
      <Link
        key={index}
        to={action.to}
        className={buttonClasses}
      >
        {IconComponent && <IconComponent className="w-5 h-5" />}
        {action.label}
      </Link>
    )
  }

  return (
    <button
      key={index}
      onClick={action.onClick}
      className={buttonClasses}
    >
      {IconComponent && <IconComponent className="w-5 h-5" />}
      {action.label}
    </button>
  )
}

const ErrorPage = ({ 
  errorCode, 
  title, 
  description, 
  customActions = [],
  showDefaultActions = true
}: ErrorPageProps) => {

  const actionsToShow = customActions.length > 0 ? customActions : (showDefaultActions ? DEFAULT_ACTIONS : [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Code - Only show if errorCode is provided */}
        {errorCode && (
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary mb-4 tracking-tight">
              {errorCode}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8 card-hover shadow-lg">
          <div className="mb-6">
            <h2 className="text-3xl font-semibold text-card-foreground mb-4">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {description}
            </p>
          </div>

          {/* Action Buttons */}
          {actionsToShow.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {actionsToShow.map((action, index) => renderAction(action, index))}
            </div>
          )}
        </div>

        {/* Status Indicator - Only show if errorCode is provided */}
        {errorCode && (
          <div className="mt-8 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              Error Code: {errorCode} - {title}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorPage