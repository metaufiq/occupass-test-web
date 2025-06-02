import { useEffect, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowUpDown, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';

import { CustomerOrder, Order, OrderDetail } from 'dtos';
import { formatDateAPI } from '@/lib/utils';
import { fetchOrders } from '@/api/orders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useOrderStore from '@/stores/order';

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
  const setSelectedCustomerOrder = useOrderStore((state) => state.setSelectedCustomerOrder);

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

  useEffect(() => {
    setSelectedCustomerOrder(null); 
  }, []);

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

  const SortableTableHead = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="text-card-foreground cursor-pointer hover:text-primary font-semibold text-sm uppercase tracking-wider transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    </TableHead>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">Orders</h2>
          <p className="text-muted-foreground text-lg">Track and manage customer orders with ease</p>
        </div>

        {/* Search and Filter Controls */}
        <Card className="card-hover bg-card border-border shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-input border-border text-foreground">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
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
        <Card className="card-hover bg-card border-border shadow-xl">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
                <div className="text-muted-foreground text-lg">Loading orders...</div>
              </div>
            ) : (
              <>
                <div className="rounded-md border-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                        <SortableTableHead field="id">Order ID</SortableTableHead>
                        <SortableTableHead field="customerId">Customer</SortableTableHead>
                        <SortableTableHead field="amount">Amount</SortableTableHead>
                        <SortableTableHead field="freight">Freight</SortableTableHead>
                        <TableHead className="text-card-foreground font-semibold text-sm uppercase tracking-wider">Status</TableHead>
                        <SortableTableHead field="orderDate">Date</SortableTableHead>
                        <SortableTableHead field="items">Items</SortableTableHead>
                        <TableHead className="text-card-foreground font-semibold text-sm uppercase tracking-wider">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No orders found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map((customerOrder, index) => {
                          const order = customerOrder.order;
                          const orderAmount = calculateOrderAmount(customerOrder.orderDetails);
                          const itemsCount = getItemsCount(customerOrder.orderDetails);
                          const status = getOrderStatus(order);
                          
                          return (
                            <TableRow 
                              key={order.id} 
                              className={`hover:bg-muted/30 transition-all duration-200 border-border ${
                                index % 2 === 0 ? 'bg-card' : 'bg-muted/10'
                              }`}
                            >
                              <TableCell className="py-4">
                                <div className="text-foreground font-medium text-base">{order.id}</div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-muted-foreground text-sm font-medium">{order.customerId}</div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-foreground text-sm font-medium">${orderAmount.toFixed(2)}</div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-muted-foreground text-sm">${order.freight.toFixed(2)}</div>
                              </TableCell>
                              <TableCell className="py-4">
                                <Badge className={getStatusColor(status)}>
                                  {status}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-muted-foreground text-sm">{formatDateAPI(order.orderDate)}</div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-foreground text-sm font-medium">{itemsCount}</div>
                              </TableCell>
                              <TableCell className="py-4">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="border-primary/30 text-primary hover:text-primary-foreground hover:bg-primary transition-all duration-200 font-medium"
                                  onClick={() => onSelectOrder(customerOrder)}
                                >
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
                  <div className="text-sm text-muted-foreground">
                    Showing orders for page <span className="font-medium text-foreground">{currentPage}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground px-3">
                      Page <span className="font-medium text-foreground">{currentPage}</span>
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
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
    </div>
  );
};

function RouteComponent() {
  const navigate = useNavigate();
  const setSelectedCustomerOrder = useOrderStore((state) => state.setSelectedCustomerOrder);
  return OrderList({
    onSelectOrder: (order)=>{
      setSelectedCustomerOrder(order)      
      navigate({
        to: '/order/detail',

      })
    }
  });
}

export const Route = createFileRoute('/order/')({
  component: RouteComponent,
})