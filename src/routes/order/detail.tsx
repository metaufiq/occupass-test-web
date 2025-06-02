import { 
  ArrowLeft, 
  FileText, 
  MapPin, 
  DollarSign, 
  ShoppingBag,
  Calendar,
  Package,
  Truck
} from 'lucide-react';
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'

import useOrderStore from '@/stores/order';
import type { CustomerOrder } from 'dtos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';


export const Route = createFileRoute('/order/detail')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter();
  const navigate = useNavigate();
  const selectedCustomerOrder: CustomerOrder | null = useOrderStore((state) => state.selectedCustomerOrder);

  const handleGoBack = () => {
    router.history.back();
  };

  const handleGoToOrderPage = () => {
    navigate({ to: '/order', replace: true });
  };

  if (!selectedCustomerOrder?.order) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={handleGoToOrderPage}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go To Order Page
          </Button>
          
          <Card className="text-center">
            <CardContent className="p-8">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <CardTitle className="text-2xl mb-2">No Order Selected</CardTitle>
              <p className="text-muted-foreground">Please select an order to view its details.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { order, orderDetails } = selectedCustomerOrder;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTotal = () => {
    return orderDetails.reduce((total, detail) => {
      return total + (detail.unitPrice * detail.quantity * (1 - detail.discount));
    }, 0);
  };

  const getOrderStatus = () => {
    if (order.shippedDate) {
      return { label: 'Shipped', variant: 'default' as const };
    } else if (order.requiredDate && new Date(order.requiredDate) < new Date()) {
      return { label: 'Overdue', variant: 'destructive' as const };
    } else {
      return { label: 'Pending', variant: 'secondary' as const };
    }
  };

  const status = getOrderStatus();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={handleGoBack}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Order #{order.id}</h1>
              <p className="text-muted-foreground">Customer ID: {order.customerId}</p>
            </div>
            <div className="text-right">
              <Badge variant={status.variant} className="mb-2">
                {status.label}
              </Badge>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(calculateTotal() + order.freight)}
              </div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground block">Order Date</span>
                <span className="text-foreground font-medium">{formatDate(order.orderDate)}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Required Date</span>
                <span className="text-foreground font-medium">{formatDate(order.requiredDate)}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Shipped Date</span>
                <span className="text-foreground font-medium">{formatDate(order.shippedDate)}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Employee ID</span>
                <span className="text-foreground font-medium">{order.employeeId}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-secondary" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-foreground font-medium">{order.shipName}</div>
                <div className="text-muted-foreground text-sm">
                  {order.shipAddress}<br />
                  {order.shipCity}, {order.shipRegion} {order.shipPostalCode}<br />
                  {order.shipCountry}
                </div>
                <Separator className="my-4" />
                <div>
                  <span className="text-sm text-muted-foreground block">Shipping Method</span>
                  <div className="flex items-center mt-1">
                    <Truck className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-foreground font-medium">Via: {order.shipVia}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-accent" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">{formatCurrency(calculateTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground font-medium">{formatCurrency(order.freight)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{formatCurrency(calculateTotal() + order.freight)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-chart-1" />
              Order Items ({orderDetails.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Product ID
                    </div>
                  </TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetails.map((detail, index) => {
                  const itemTotal = detail.unitPrice * detail.quantity * (1 - detail.discount);
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">#{detail.productId}</div>
                      </TableCell>
                      <TableCell>{formatCurrency(detail.unitPrice)}</TableCell>
                      <TableCell>{detail.quantity}</TableCell>
                      <TableCell>
                        {detail.discount > 0 ? (
                          <Badge variant="outline">
                            {(detail.discount * 100).toFixed(0)}%
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(itemTotal)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}