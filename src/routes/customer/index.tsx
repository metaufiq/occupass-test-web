import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowUpDown, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { Customer } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



type SortField = 'name' | 'email' | 'company' | 'status' | 'totalOrders';

export const Route = createFileRoute('/customer/')({
  component: RouteComponent,
})

// Mock data generators (in real app, these would come from API)
const generateMockCustomers = (count: number): Customer[] => {
  const statuses = ['Active', 'Inactive', 'Pending'];
  const companies = ['TechCorp', 'DataSystems', 'CloudWorks', 'InnovateLab', 'DigitalFlow'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `cust-${i + 1}`,
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    company: companies[i % companies.length],
    status: statuses[i % statuses.length],
    createdDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    totalOrders: Math.floor(Math.random() * 50) + 1
  }));
};


// Customer List Component
const CustomerList = ({ onSelectCustomer }:{onSelectCustomer:(customer:Customer)=>void}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    // In real app, this would be an API call to the provided endpoint
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockCustomers(100);
      setCustomers(mockData);
      setFilteredCustomers(mockData);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
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

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }, [customers, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Inactive': return 'bg-red-500';
      case 'Pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Customers</h2>
        <p className="text-slate-400">Manage your customer database</p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search customers..."
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-slate-400">Loading customers...</div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-4 p-4 border-b border-slate-700 bg-slate-800/50">
                  <div 
                    className="text-slate-200 cursor-pointer hover:text-white font-medium"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div 
                    className="text-slate-200 cursor-pointer hover:text-white font-medium"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div 
                    className="text-slate-200 cursor-pointer hover:text-white font-medium"
                    onClick={() => handleSort('company')}
                  >
                    <div className="flex items-center">
                      Company <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-slate-200 font-medium">Status</div>
                  <div 
                    className="text-slate-200 cursor-pointer hover:text-white font-medium"
                    onClick={() => handleSort('totalOrders')}
                  >
                    <div className="flex items-center">
                      Orders <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-slate-200 font-medium">Actions</div>
                </div>
                
                {/* Table Body */}
                <div className="divide-y divide-slate-700">
                  {paginatedCustomers.map((customer) => (
                    <div key={customer.id} className="grid grid-cols-6 gap-4 p-4 hover:bg-slate-700/50 transition-colors">
                      <div className="text-white font-medium">{customer.name}</div>
                      <div className="text-slate-300">{customer.email}</div>
                      <div className="text-slate-300">{customer.company}</div>
                      <div>
                        <Badge className={`${getStatusColor(customer.status)} text-white`}>
                          {customer.status}
                        </Badge>
                      </div>
                      <div className="text-slate-300">{customer.totalOrders}</div>
                      <div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                          onClick={() => onSelectCustomer(customer)}
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
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
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
  return CustomerList({
    onSelectCustomer: (customer) => {
      console.log(`Selected customer: ${customer.name}`);
      
      // Handle customer selection, e.g., navigate to customer details page
    }
  });
}
