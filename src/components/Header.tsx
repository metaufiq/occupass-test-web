import { useState, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { 
  Building2, 
  Users, 
  ShoppingCart, 
  Menu, 
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'


export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    {
      title: 'Customers',
      href: '/customer',
      icon: Users,
      description: 'Manage customer relationships'
    },
    {
      title: 'Orders',
      href: '/order',
      icon: ShoppingCart,
      description: 'Track and manage orders'
    }
  ]

  // Helper function to check if current route matches navigation item
  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
          "bg-background backdrop-blur-xl border-b",
          isScrolled 
            ? "border-border shadow-lg" 
            : "border-border/50 shadow-sm"
        )}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className={cn(
                "p-3 rounded-xl transition-all duration-300 ease-in-out",
                "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg",
                "group-hover:scale-105 group-hover:shadow-xl group-hover:from-primary/90 group-hover:to-primary/80"
              )}>
                <Building2 className="h-7 w-7" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                ERPia
              </span>
            </Link>

            {/* Right Side - Navigation + Actions */}
            <div className="flex items-center space-x-6">
              {/* Desktop Navigation  */}
              <nav className="hidden md:flex items-center space-x-2">
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item.href)
                  
                  return (
                    <Link 
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "group inline-flex items-center justify-center py-2 px-4 text-sm font-medium",
                        "transition-all duration-200 relative rounded-lg active:scale-95",
                        "hover:after:scale-x-100 after:transition-transform after:duration-200",
                        "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2",
                        "after:h-0.5 after:w-4/5 after:rounded-full",
                        isActive 
                          ? "text-primary bg-primary/10 after:scale-x-100 after:bg-primary shadow-sm" 
                          : "text-muted-foreground hover:text-foreground after:scale-x-0 after:bg-foreground hover:bg-muted/50"
                      )}
                    >
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "md:hidden h-11 w-11 rounded-xl transition-all duration-200",
                  "text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95"
                )}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? 
                  <X className="h-5 w-5" /> : 
                  <Menu className="h-5 w-5" />
                }
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen 
              ? "max-h-80 opacity-100 pb-6" 
              : "max-h-0 opacity-0"
          )}>
            <div className="pt-4 space-y-1 border-t border-border/50">
              {navigationItems.map((item) => {
                const isActive = isActiveRoute(item.href)
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-4 px-4 py-4 rounded-xl",
                      "transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] relative",
                      isActive 
                        ? "text-primary bg-primary/10 shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg transition-colors",
                      isActive ? "bg-primary/20" : "bg-muted"
                    )}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base flex items-center gap-2">
                        {item.title}
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Header Spacer */}
      <div className="h-20"></div>
    </>
  )
}