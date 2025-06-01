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
          fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
          ${!isScrolled 
            ? 'bg-card/95 backdrop-blur-md border-b border-border shadow-lg' 
            : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'
          }
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className={`
                p-2 rounded-lg transition-all duration-300 ease-in-out
                ${!isScrolled 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white/10 text-white'
                }
                group-hover:scale-110
              `}>
                <Building2 className="h-6 w-6" />
              </div>
              <span className={`
                font-bold text-xl transition-colors duration-300
                ${!isScrolled ? 'text-foreground' : 'text-white'}
              `}>
                ERP Suite
              </span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link to={item.href}>
                      <NavigationMenuLink 
                        className={`
                          group inline-flex h-10 w-max items-center justify-center 
                          rounded-md px-4 py-2 text-sm font-medium transition-colors 
                          hover:bg-accent hover:text-accent-foreground 
                          focus:bg-accent focus:text-accent-foreground 
                          focus:outline-none disabled:pointer-events-none 
                          disabled:opacity-50 data-[active]:bg-accent/50 
                          data-[state=open]:bg-accent/50 space-x-2
                          ${!isScrolled 
                            ? 'text-foreground hover:text-accent-foreground' 
                            : 'text-white/90 hover:text-white hover:bg-white/10'
                          }
                        `}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className={`
                  md:hidden transition-colors duration-300
                  ${!isScrolled 
                    ? 'text-foreground hover:bg-accent' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
          `}>
            <div className="py-4 space-y-2 border-t border-border/50">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${!isScrolled 
                      ? 'text-foreground hover:bg-accent' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className={`
                      text-sm 
                      ${!isScrolled ? 'text-muted-foreground' : 'text-white/70'}
                    `}>
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
      <div className="h-16"></div>
    </>
  )
}