import { useMemo } from 'react';
import { 
  Package,
  DollarSign,
  Hash,
  Percent,
  ShoppingBag
} from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import type { OrderDetail } from 'dtos';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import DataTable from '@/components/DataTable';

interface Props {
  orderDetails: OrderDetail[];
  orderId: number;
}

const OrderItems = ({ orderDetails, orderId }: Props) => {
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

  return (
    <div className="mb-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="h-6 w-6 text-chart-1" />
          <h2 className="text-2xl font-bold text-foreground">Order Items</h2>
        </div>
        <p className="text-muted-foreground">
          Complete list of items in order #{orderId} ({orderDetails.length} items)
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
  );
};

export default OrderItems;