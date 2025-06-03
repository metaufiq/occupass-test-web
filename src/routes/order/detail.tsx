import { 
  ArrowLeft, 
  MapPin, 
  DollarSign,
  Calendar,
  Truck,
  ShoppingCart
} from 'lucide-react';
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'

import { ERROR_CODE } from '@/lib/constants';
import type { CustomerOrder } from 'dtos';
import useOrderStore from '@/stores/order';
import { formatDateAPI } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import OrderItems from '@/components/order/detail/OrderItems';
import ErrorPage from '@/components/ErrorPage'; // Import the enhanced ErrorPage

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotal = () => {
    if (!selectedCustomerOrder?.orderDetails) return 0;
    return selectedCustomerOrder.orderDetails.reduce((total, detail) => {
      return total + (detail.unitPrice * detail.quantity * (1 - detail.discount));
    }, 0);
  };

  if (!selectedCustomerOrder?.order) {
    return (
      <ErrorPage
        errorCode={ERROR_CODE.NOT_FOUND}
        title="No Order Selected"
        description="Please select an order from the orders list to view its details. You can browse all available orders and click on any order to see its complete information."
        customActions={[
          {
            label: 'Go To Orders',
            onClick: handleGoToOrderPage,
            icon: ShoppingCart,
            variant: 'primary'
          },
        ]}
      />
    );
  }

  const { order, orderDetails } = selectedCustomerOrder;

  const getOrderStatus = () => {
    const requiredDate = new Date(formatDateAPI(order.requiredDate))
    const currentDate = new Date(new Date().toLocaleDateString())
    if (order.shippedDate) {
      return { label: 'Shipped', variant: 'default' as const };
    } else if (
      order.requiredDate &&
      requiredDate < currentDate
    ) {
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
                <span className="text-foreground font-medium">{formatDateAPI(order.orderDate)}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Required Date</span>
                <span className="text-foreground font-medium">{formatDateAPI(order.requiredDate)}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Shipped Date</span>
                <span className="text-foreground font-medium">{formatDateAPI(order.shippedDate)}</span>
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
                <DollarSign className="w-5 h-5 mr-2 text-accent-foreground" />
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

        <OrderItems
          orderDetails={orderDetails} 
          orderId={order.id}
        />
      </div>
    </div>
  );
}