import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { 
  Users, 
  ShoppingCart, 
  User,
  Package,
} from 'lucide-react';

// Dashboard Component
const RouteComponent = () => {
  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your customers and orders</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">5,678</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Revenue</CardTitle>
            <Package className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">$89,432</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Active Customers</CardTitle>
            <User className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">892</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: RouteComponent,
})