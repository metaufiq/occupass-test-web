import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { 
  Package,
  DollarSign,
  Calendar,
  Truck,
  Hash,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

import type { CustomerOrder } from 'dtos'
import { formatDateAPI } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import DataTable from '@/components/DataTable'

interface Props {
  orders: CustomerOrder[]
  companyName: string
}

export default function CustomerOrders({ orders, companyName }: Props) {
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

  // Define columns for DataTable
  const orderColumns: ColumnDef<CustomerOrder>[] = useMemo(() => [
    {
      accessorKey: 'order.id',
      header: () => (
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          Order ID
        </div>
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="flex items-center gap-1 w-fit">
          <Hash className="h-3 w-3" />
          {row.original.order?.id}
        </Badge>
      ),
    },
    {
      accessorKey: 'order.orderDate',
      header: () => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Order Date
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {row.original.order?.orderDate ? formatDateAPI(row.original.order.orderDate) : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'order.requiredDate',
      header: () => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Required Date
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {row.original.order?.requiredDate ? formatDateAPI(row.original.order.requiredDate) : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'order.shippedDate',
      header: () => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Shipped Date
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {row.original.order?.shippedDate ? formatDateAPI(row.original.order.shippedDate) : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'order.freight',
      header: () => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Freight
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right font-mono">
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            {(row.original.order?.freight || 0).toFixed(2)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'orderDetails',
      header: () => (
        <div className="flex items-center justify-center gap-2">
          <Package className="h-4 w-4" />
          Items
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="secondary" className="flex items-center gap-1 w-fit mx-auto">
            <Package className="h-3 w-3" />
            {row.original.orderDetails?.length || 0}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: () => (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4" />
          Status
        </div>
      ),
      cell: ({ row }) => {
        const status = getOrderStatus(row.original.order)
        const StatusIcon = status.icon
        return (
          <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
        )
      },
    },
  ], [])

  return (
    <div className="mt-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Package className="h-6 w-6 text-chart-1" />
          <h2 className="text-2xl font-bold text-foreground">Customer Orders</h2>
        </div>
        <p className="text-muted-foreground">
          Complete order history for {companyName} ({orders.length} orders)
        </p>
      </div>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No orders found for this customer</p>
              <p className="text-muted-foreground text-sm mt-2">Orders will appear here once created</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={orderColumns}
          data={orders}
          title="Orders"
        />
      )}
    </div>
  )
}