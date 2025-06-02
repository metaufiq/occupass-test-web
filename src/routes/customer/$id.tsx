import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/customer/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['customerDetails', id],
    queryFn: () => fetchCustomerDetails({ id }),
    enabled: !!id,
  })

if (isLoading) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="gradient-bg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
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
    if (order?.shippedDate) return { label: 'Shipped', variant: 'default' as const }
    if (order?.requiredDate && !order?.shippedDate) return { label: 'Pending', variant: 'secondary' as const }
    return { label: 'Processing', variant: 'outline' as const }
  }

  const totalFreight = orders.reduce((sum, order) => sum + (order.order?.freight || 0), 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-bg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{customer.companyName}</h1>
              <p className="text-white/70">Customer ID: {customer.id}</p>
            </div>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
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
                  <div className="w-2 h-6 bg-primary rounded-full mr-3"></div>
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Primary contact details for this customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Contact Name</label>
                    <p className="text-foreground">{customer.contactName || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Contact Title</label>
                    <p className="text-foreground">{customer.contactTitle || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-foreground font-mono">{customer.phone || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Fax</label>
                    <p className="text-foreground font-mono">{customer.fax || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-2 h-6 bg-secondary rounded-full mr-3"></div>
                  Address Information
                </CardTitle>
                <CardDescription>
                  Business address and location details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Street Address</label>
                    <p className="text-foreground">{customer.address || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">City</label>
                    <p className="text-foreground">{customer.city || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Region/State</label>
                    <p className="text-foreground">{customer.region || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Postal Code</label>
                    <p className="text-foreground font-mono">{customer.postalCode || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Country</label>
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
                  <div className="w-2 h-6 bg-accent rounded-full mr-3"></div>
                  Order Summary
                </CardTitle>
                <CardDescription>
                  Overview of customer order history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {orders.length}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Freight</p>
                    <p className="text-2xl font-bold text-foreground">${totalFreight.toFixed(2)}</p>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
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
                <div className="w-2 h-6 bg-chart-1 rounded-full mr-3"></div>
                Customer Orders
              </CardTitle>
              <CardDescription>
                Complete order history for {customer.companyName} ({orders.length} orders)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No orders found for this customer</p>
                  <p className="text-muted-foreground text-sm mt-2">Orders will appear here once created</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Ship To</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead className="text-right">Freight</TableHead>
                      <TableHead className="text-center">Items</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((customerOrder, index) => {
                      const order = customerOrder.order
                      const orderDetails = customerOrder.orderDetails || []
                      const status = getOrderStatus(order)
                      
                      return (
                        <TableRow key={order?.id || index}>
                          <TableCell className="font-medium">
                            <Badge variant="outline">#{order?.id}</Badge>
                          </TableCell>
                          <TableCell>
                            {order?.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>{order?.shipName || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{order?.shipCity || 'N/A'}</div>
                              {order?.shipCountry && (
                                <div className="text-muted-foreground">{order.shipCountry}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            ${(order?.freight || 0).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{orderDetails.length}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>{status.label}</Badge>
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