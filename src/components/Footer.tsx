import { Link } from "@tanstack/react-router";
import { Building2, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="dark bg-background border-t border-border/50 mt-auto">
      {/* Main Footer Content */}
      <div className="w-full px-5 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 w-full">
          {/* Brand Section */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-3 rounded transition-all duration-300 ease-in-out bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg group-hover:scale-105 group-hover:shadow-xl group-hover:from-primary/90 group-hover:to-primary/80">
                <Building2 className="h-3 w-3 text-white" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                ERPia
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Enterprise resource planning made simple. Integrate customers, inventory, and operations in one powerful platform designed for growing businesses.
            </p>
          </div>
          
          {/* Navigation Section */}
          <div className="flex flex-col justify-end items-end">
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="group transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-sm"
            >
              <ArrowUp className="h-4 w-4 mr-2 group-hover:animate-bounce" />
              Return to Top
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50 bg-muted/30">
        <div className="container px-5 py-2 text-xs text-muted-foreground">
              © {new Date().getFullYear()} ERPia. All rights reserved.
          </div>
      </div>
    </footer>
  );
}