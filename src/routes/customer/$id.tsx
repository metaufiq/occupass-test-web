import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Printer, 
  Briefcase, 
  MapPin, 
  Building, 
  Globe, 
  Mail,
  Package,
  DollarSign,
  Calendar,
  Truck,
  Hash,
  CheckCircle,
  Clock,
  AlertCircle,
  ShoppingCart
} from 'lucide-react'

import { formatDateAPI } from '@/lib/utils'
import { fetchCustomerDetails } from '@/api/customers'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/customer/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const router = useRouter()
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['customerDetails', id],
    queryFn: () => fetchCustomerDetails({ id }),
    enabled: !!id,
  })

  const handleGoBack = () => {
    router.history.back()
  }

if (isLoading) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="gradient-bg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-24" />
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    </div>
  )
}

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Customer</AlertTitle>
            <AlertDescription>
              Failed to load customer details. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const customerData = data?.response
  const customer = customerData?.customer
  const orders = customerData?.orders || []

  if (!customer) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Customer Not Found</AlertTitle>
            <AlertDescription>
              No customer found with ID: {id}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const getOrderStatus = (order: any) => {
    if (order?.shippedDate) return { 
      label: 'Shipped', 
      variant: 'default' as const, 
      icon: CheckCircle 
    }
    if (order?.requiredDate && !order?.shippedDate) return { 
      label: 'Pending', 
      variant: 'secondary' as const, 
      icon: Clock 
    }
    return { 
      label: 'Processing', 
      variant: 'outline' as const, 
      icon: AlertCircle 
    }
  }

  const totalFreight = orders.reduce((sum, order) => sum + (order.order?.freight || 0), 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-bg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="text-white hover:bg-white/10 hover:text-white border-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <Building className="h-8 w-8 text-white/80" />
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{customer.companyName}</h1>
                  <p className="text-white/70 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Customer ID: {customer.id}
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Active Customer
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-primary" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Primary contact details for this customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Contact Name
                    </label>
                    <p className="text-foreground">{customer.contactName || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Contact Title
                    </label>
                    <p className="text-foreground">{customer.contactTitle || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </label>
                    <p className="text-foreground font-mono">{customer.phone || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Printer className="h-4 w-4" />
                      Fax
                    </label>
                    <p className="text-foreground font-mono">{customer.fax || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-secondary" />
                  Address Information
                </CardTitle>
                <CardDescription>
                  Business address and location details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Street Address
                    </label>
                    <p className="text-foreground">{customer.address || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      City
                    </label>
                    <p className="text-foreground">{customer.city || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Region/State
                    </label>
                    <p className="text-foreground">{customer.region || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Postal Code
                    </label>
                    <p className="text-foreground font-mono">{customer.postalCode || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Country
                    </label>
                    <p className="text-foreground font-semibold">{customer.country || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-3 text-accent-foreground" />
                  Order Summary
                </CardTitle>
                <CardDescription>
                  Overview of customer order history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {orders.length}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Total Freight
                    </p>
                    <p className="text-2xl font-bold text-foreground">${totalFreight.toFixed(2)}</p>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    ${totalFreight.toFixed(2)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Orders Table */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-3 text-chart-1" />
                Customer Orders
              </CardTitle>
              <CardDescription>
                Complete order history for {customer.companyName} ({orders.length} orders)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">No orders found for this customer</p>
                  <p className="text-muted-foreground text-sm mt-2">Orders will appear here once created</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Order ID
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Order Date
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Ship To
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Destination
                        </div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <DollarSign className="h-4 w-4" />
                          Freight
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Package className="h-4 w-4" />
                          Items
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Status
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((customerOrder, index) => {
                      const order = customerOrder.order
                      const orderDetails = customerOrder.orderDetails || []
                      const status = getOrderStatus(order)
                      const StatusIcon = status.icon
                      
                      return (
                        <TableRow key={order?.id || index}>
                          <TableCell className="font-medium">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              {order?.id}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {order?.orderDate ? formatDateAPI(order.orderDate) : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {order?.shipName || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <div>{order?.shipCity || 'N/A'}</div>
                                {order?.shipCountry && (
                                  <div className="text-muted-foreground">{order.shipCountry}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            <div className="flex items-center justify-end gap-1">
                              <DollarSign className="h-3 w-3 text-muted-foreground" />
                              {(order?.freight || 0).toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="flex items-center gap-1 w-fit mx-auto">
                              <Package className="h-3 w-3" />
                              {orderDetails.length}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}