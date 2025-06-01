import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpDown, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';

import { CustomerOrder, Order, OrderDetail } from 'dtos';
import { fetchOrders } from '@/api/orders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDateAPI } from '@/lib/utils';

type SortField = 'id' | 'customerId' | 'amount' | 'orderDate' | 'items' | 'freight';

type SortValue = number | string | Date

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface Props {
  onSelectOrder: (order: CustomerOrder) => void;
}

// Helper function to calculate total amount from order details
const calculateOrderAmount = (orderDetails: OrderDetail[]) => {
  return orderDetails.reduce((total, detail) => {
    return total + (detail.unitPrice * detail.quantity * (1 - detail.discount));
  }, 0);
};

// Helper function to get total items count
const getItemsCount = (orderDetails: OrderDetail[]) => {
  return orderDetails.reduce((total, detail) => total + detail.quantity, 0);
};

// Helper function to determine order status (since it's not in the backend)
const getOrderStatus = (order: Order):OrderStatus => {
  if (order.shippedDate) {
    return 'Shipped';
  } else if (order.orderDate) {
    return 'Processing';
  } else {
    return 'Pending';
  }
};

// Order List Component
const OrderList = ({ onSelectOrder }: Props) => {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<CustomerOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);

  // Fetch orders whenever currentPage changes
  useEffect(() => {
    setLoading(true);

    fetchOrders({
      page: currentPage,
    }).then(response => {
      if (response.response && response.response.results) {
        setOrders(response.response.results);
        setHasMorePages(!!response.response.results.length);
      }
    }).catch(error => {
      console.error('Error fetching orders:', error);
      setHasMorePages(false);
    }).finally(() => {
      setLoading(false);
    });
  }, [currentPage]); // Added currentPage to dependency array

  useEffect(() => {
    let filtered = orders.filter(customerOrder => {
      const order = customerOrder.order;
      const matchesSearch = 
        order.id.toString().includes(searchTerm.toLowerCase()) ||
        order.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shipName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const orderStatus = getOrderStatus(order);
      const matchesStatus = statusFilter === 'all' || orderStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: SortValue, bValue: SortValue;
      
      switch (sortField) {
        case 'id':
          aValue = a.order.id;
          bValue = b.order.id;
          break;
        case 'customerId':
          aValue = a.order.customerId;
          bValue = b.order.customerId;
          break;
        case 'amount':
          aValue = calculateOrderAmount(a.orderDetails);
          bValue = calculateOrderAmount(b.orderDetails);
          break;
        case 'orderDate':
          aValue = new Date(a.order.orderDate || '');
          bValue = new Date(b.order.orderDate || '');
          break;
        case 'items':
          aValue = getItemsCount(a.orderDetails);
          bValue = getItemsCount(b.orderDetails);
          break;
        case 'freight':
          aValue = a.order.freight;
          bValue = b.order.freight;
          break;
        default:
          aValue = a.order.id;
          bValue = b.order.id;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMorePages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'bg-chart-4 text-white';
      case 'Shipped': return 'bg-primary text-primary-foreground';
      case 'Processing': return 'bg-chart-5 text-white';
      case 'Pending': return 'bg-chart-5 text-white';
      case 'Cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Orders</h2>
        <p className="text-muted-foreground">Track and manage customer orders</p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="bg-card border-border card-hover">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-input border-border text-foreground">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-card border-border card-hover">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">Loading orders...</div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                {/* Table Header */}
                <div className="grid grid-cols-8 gap-4 p-4 border-b border-border bg-muted/50">
                  <div 
                    className="text-foreground cursor-pointer hover:text-primary font-medium transition-colors"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      Order ID <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div 
                    className="text-foreground cursor-pointer hover:text-primary font-medium transition-colors"
                    onClick={() => handleSort('customerId')}
                  >
                    <div className="flex items-center">
                      Customer <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div 
                    className="text-foreground cursor-pointer hover:text-primary font-medium transition-colors"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center">
                      Amount <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div 
                    className="text-foreground cursor-pointer hover:text-primary font-medium transition-colors"
                    onClick={() => handleSort('freight')}
                  >
                    <div className="flex items-center">
                      Freight <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-foreground font-medium">Status</div>
                  <div 
                    className="text-foreground cursor-pointer hover:text-primary font-medium transition-colors"
                    onClick={() => handleSort('orderDate')}
                  >
                    <div className="flex items-center">
                      Date <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div 
                    className="text-foreground cursor-pointer hover:text-primary font-medium transition-colors"
                    onClick={() => handleSort('items')}
                  >
                    <div className="flex items-center">
                      Items <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-foreground font-medium">Actions</div>
                </div>
                
                {/* Table Body */}
                <div className="divide-y divide-border">
                  {filteredOrders.map((customerOrder) => {
                    const order = customerOrder.order;
                    const orderAmount = calculateOrderAmount(customerOrder.orderDetails);
                    const itemsCount = getItemsCount(customerOrder.orderDetails);
                    const status = getOrderStatus(order);
                    
                    return (
                      <div key={order.id} className="grid grid-cols-8 gap-4 p-4 hover:bg-muted/30 transition-colors">
                        <div className="text-foreground font-medium">{order.id}</div>
                        <div className="text-card-foreground">{order.customerId}</div>
                        <div className="text-card-foreground">${orderAmount.toFixed(2)}</div>
                        <div className="text-card-foreground">${order.freight.toFixed(2)}</div>
                        <div>
                          <Badge className={getStatusColor(status)}>
                            {status}
                          </Badge>
                        </div>
                        <div className="text-card-foreground">{formatDateAPI(order.orderDate)}</div>
                        <div className="text-card-foreground">{itemsCount}</div>
                        <div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-border text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent transition-colors"
                            onClick={() => onSelectOrder(customerOrder)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Showing orders for page {currentPage}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent transition-colors"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent transition-colors"
                    onClick={handleNextPage}
                    disabled={!hasMorePages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function RouteComponent() {
  return OrderList({
    onSelectOrder: (customerOrder) => {
      console.log(`Selected order: ${customerOrder.order.id} for customer: ${customerOrder.order.customerId}`);  
      // Here you can handle the selected order, e.g., navigate to order details page
    }
  });
}

export const Route = createFileRoute('/order/')({
  component: RouteComponent,
})