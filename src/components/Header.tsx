import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  Users, 
  ShoppingCart, 
  Menu, 
  X,
  BarChart3,
} from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
      title: 'Dashboard',
      href: '/',
      icon: BarChart3,
      description: 'Overview and analytics'
    },
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

  return (
    <>
      <header 
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
          ${!isScrolled 
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm' 
            : 'bg-background/95 backdrop-blur-xl border-b border-border shadow-lg'
          }
        `}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className={`
                p-3 rounded-xl transition-all duration-300 ease-in-out
                bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg
                group-hover:scale-105 group-hover:shadow-xl group-hover:from-primary/90 group-hover:to-primary/80
              `}>
                <Building2 className="h-7 w-7" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                ERPia
              </span>
            </Link>

            {/* Right Side - Navigation + Actions */}
            <div className="flex items-center space-x-6">
              {/* Desktop Navigation - Moved to the right */}
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList className="space-x-2">
                  {navigationItems.map((item) => (
                    <NavigationMenuItem key={item.href}>
                      <Link to={item.href}>
                        <NavigationMenuLink 
                          className={`
                            group inline-flex h-15 items-center justify-center 
                            rounded-xl px-5 py-2 text-sm font-medium transition-all duration-200
                            text-muted-foreground
                            focus:text-foreground focus:outline-none 
                            focus:ring-2 focus:ring-ring focus:ring-offset-2
                            disabled:pointer-events-none disabled:opacity-50 
                            space-x-3 relative
                            hover:after:scale-x-100 after:scale-x-0 after:transition-transform after:duration-200
                            after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 
                            after:h-0.5 after:w-4/5 after:bg-foreground after:rounded-full
                            data-[active]:text-primary data-[active]:after:scale-x-100 data-[active]:after:bg-primary
                            active:scale-95
                          `}
                        >
                          <item.icon className="h-5 w-5 transition-transform group-hover:scale-110 hover:text-accent-foreground" />
                          <span className="font-medium">{item.title}</span>
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-11 w-11 rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95"
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
          <div className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMobileMenuOpen ? 'max-h-80 opacity-100 pb-6' : 'max-h-0 opacity-0'}
          `}>
            <div className="pt-4 space-y-1 border-t border-border/50">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="p-2 rounded-lg bg-muted transition-colors">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base">{item.title}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Header Spacer */}
      <div className="h-20"></div>
    </>
  )
}