import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpDown, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Order } from '@/lib/types';


type SortField = 'id' | 'customerName' | 'amount' | 'status' | 'orderDate' | 'items';

interface Props{
  onSelectOrder: (order: Order) => void;
}

const generateMockOrders = (count: number): Order[] => {
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `ord-${i + 1}`,
    customerId: `cust-${Math.floor(Math.random() * 50) + 1}`,
    customerName: `Customer ${Math.floor(Math.random() * 50) + 1}`,
    amount: Math.floor(Math.random() * 5000) + 100,
    status: statuses[i % statuses.length],
    orderDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    items: Math.floor(Math.random() * 10) + 1
  }));
};


// Order List Component
const OrderList = ({ onSelectOrder }:Props) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    // In real app, this would be an API call to the provided endpoint
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockOrders(150);
      setOrders(mockData);
      setFilteredOrders(mockData);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500';
      case 'Shipped': return 'bg-blue-500';
      case 'Processing': return 'bg-yellow-500';
      case 'Pending': return 'bg-orange-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Orders</h2>
        <p className="text-slate-400">Track and manage customer orders</p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
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
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-slate-400">Loading orders...</div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                {/* Table Header */}
                <div className="grid grid-cols-7 gap-4 p-4 border-b border-slate-700 bg-slate-800/50">
                  <div 
                    className="text-slate-200 cursor-pointer hover:text-white font-medium"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      Order ID <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div 
                    className="text-slate-200 cursor-pointer hover:text-white font-medium"
                    onClick={() => handleSort('customerName')}
                  >
                    <div className="flex items-center">
                      Customer <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div 
                    className="text-slate-200 cursor-pointer hover:text-white font-medium"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center">
                      Amount <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-slate-200 font-medium">Status</div>
                  <div 
                    className="text-slate-200 cursor-pointer hover:text-white font-medium"
                    onClick={() => handleSort('orderDate')}
                  >
                    <div className="flex items-center">
                      Date <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div 
                    className="text-slate-200 cursor-pointer hover:text-white font-medium"
                    onClick={() => handleSort('items')}
                  >
                    <div className="flex items-center">
                      Items <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-slate-200 font-medium">Actions</div>
                </div>
                
                {/* Table Body */}
                <div className="divide-y divide-slate-700">
                  {paginatedOrders.map((order) => (
                    <div key={order.id} className="grid grid-cols-7 gap-4 p-4 hover:bg-slate-700/50 transition-colors">
                      <div className="text-white font-medium">{order.id}</div>
                      <div className="text-slate-300">{order.customerName}</div>
                      <div className="text-slate-300">${order.amount.toLocaleString()}</div>
                      <div>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-slate-300">{order.orderDate}</div>
                      <div className="text-slate-300">{order.items}</div>
                      <div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                          onClick={() => onSelectOrder(order)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-slate-700">
                <div className="text-sm text-slate-400">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-slate-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
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
    onSelectOrder: (order) => {
      console.log(`Selected customer: ${order.customerName} (ID: ${order.id})`);  
      // Handle customer selection, e.g., navigate to customer details page
    }
  });
}

export const Route = createFileRoute('/order/')({
  component: RouteComponent,
})
