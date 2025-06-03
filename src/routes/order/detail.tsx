import { useMemo } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  MapPin, 
  DollarSign, 
  ShoppingBag,
  Calendar,
  Package,
  Truck,
  Hash,
  Percent
} from 'lucide-react';
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'

import type { CustomerOrder, OrderDetail } from 'dtos';
import useOrderStore from '@/stores/order';
import { formatDateAPI } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import DataTable from '@/components/DataTable';

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

  const calculateItemTotal = (detail: OrderDetail) => {
    return detail.unitPrice * detail.quantity * (1 - detail.discount);
  };

  // Define columns for order details DataTable
  const orderDetailColumns: ColumnDef<OrderDetail>[] = useMemo(() => [
    {
      accessorKey: 'productId',
      header: () => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Product ID
        </div>
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="flex items-center gap-1 w-fit font-mono">
          <Hash className="h-3 w-3" />
          {row.original.productId}
        </Badge>
      ),
    },
    {
      accessorKey: 'unitPrice',
      header: () => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Unit Price
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-mono">
          <DollarSign className="h-3 w-3 text-muted-foreground" />
          {row.original.unitPrice.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'quantity',
      header: () => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Quantity
        </div>
      ),
      cell: ({ row }) => (
        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
          <Package className="h-3 w-3" />
          {row.original.quantity}
        </Badge>
      ),
    },
    {
      accessorKey: 'discount',
      header: () => (
        <div className="flex items-center gap-2">
          <Percent className="h-4 w-4" />
          Discount
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.original.discount > 0 ? (
            <Badge variant="outline" className="flex items-center gap-1">
              {(row.original.discount * 100).toFixed(0)}
              <Percent className="h-3 w-3 text-muted-foreground" />
            </Badge>
          ) : (
            <span className="text-muted-foreground text-sm">None</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'total',
      header: () => (
        <div className="flex items-center justify-end gap-2">
          <DollarSign className="h-4 w-4" />
          Total
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right font-mono font-medium">
          <div className="flex items-center justify-start gap-1">
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            {calculateItemTotal(row.original).toFixed(2)}
          </div>
        </div>
      ),
    },
  ], []);

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

  const getOrderStatus = () => {
    if (order.shippedDate) {
      return { label: 'Shipped', variant: 'default' as const };
    } else if (order.requiredDate && new Date(formatDateAPI(order.requiredDate)) < new Date(new Date().toLocaleDateString())) {
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

        {/* Order Items DataTable */}
        <div className="mb-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="h-6 w-6 text-chart-1" />
              <h2 className="text-2xl font-bold text-foreground">Order Items</h2>
            </div>
            <p className="text-muted-foreground">
              Complete list of items in order #{order.id} ({orderDetails.length} items)
            </p>
          </div>
          
          {orderDetails.length === 0 ? (
            <Card>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">No items found for this order</p>
                  <p className="text-muted-foreground text-sm mt-2">Order items will appear here once added</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <DataTable
              columns={orderDetailColumns}
              data={orderDetails}
              title="Items"
            />
          )}
        </div>
      </div>
    </div>
  );
}