import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowUpDown, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Customer } from 'dtos';
import { fetchAllCustomers } from '@/api/customers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SortField = 'contactName' | 'companyName' | 'city' | 'country' | 'phone';

export const Route = createFileRoute('/customer/')({
  component: RouteComponent,
})

// Customer List Component
const CustomerList = ({ onSelectCustomer }:{onSelectCustomer:(customer:Customer)=>void}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('contactName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    fetchAllCustomers().then(response => {
      if (response?.response?.results && response.response.results.length > 0) {
        setCustomers(response.response.results);
        setFilteredCustomers(response.response.results);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = customer.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = countryFilter === 'all' || customer.country === countryFilter;
      return matchesSearch && matchesCountry;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }, [customers, searchTerm, countryFilter, sortField, sortDirection]);

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

  // Get unique countries for filter dropdown
  const uniqueCountries = [...new Set(customers.map(c => c.country).filter(Boolean))].sort();

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">Customers</h2>
          <p className="text-muted-foreground text-lg">Manage your customer database with ease</p>
        </div>

        {/* Search and Filter Controls */}
        <Card className="card-hover bg-card border-border shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, company, city, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-input border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-56 h-12 bg-input border-border text-foreground">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all" className="text-popover-foreground">All Countries</SelectItem>
                  {uniqueCountries.map(country => (
                    <SelectItem key={country} value={country} className="text-popover-foreground">
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customer Table */}
        <Card className="card-hover bg-card border-border shadow-xl">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
                <div className="text-muted-foreground text-lg">Loading customers...</div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  {/* Table Header */}
                  <div className="grid grid-cols-6 gap-4 p-6 border-b border-border bg-muted/50">
                    <div 
                      className="text-card-foreground cursor-pointer hover:text-primary font-semibold text-sm uppercase tracking-wider transition-colors"
                      onClick={() => handleSort('contactName')}
                    >
                      <div className="flex items-center">
                        Contact Name <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                    <div 
                      className="text-card-foreground cursor-pointer hover:text-primary font-semibold text-sm uppercase tracking-wider transition-colors"
                      onClick={() => handleSort('companyName')}
                    >
                      <div className="flex items-center">
                        Company <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                    <div 
                      className="text-card-foreground cursor-pointer hover:text-primary font-semibold text-sm uppercase tracking-wider transition-colors"
                      onClick={() => handleSort('city')}
                    >
                      <div className="flex items-center">
                        City <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                    <div 
                      className="text-card-foreground cursor-pointer hover:text-primary font-semibold text-sm uppercase tracking-wider transition-colors"
                      onClick={() => handleSort('country')}
                    >
                      <div className="flex items-center">
                        Country <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                    <div 
                      className="text-card-foreground cursor-pointer hover:text-primary font-semibold text-sm uppercase tracking-wider transition-colors"
                      onClick={() => handleSort('phone')}
                    >
                      <div className="flex items-center">
                        Phone <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-card-foreground font-semibold text-sm uppercase tracking-wider">Actions</div>
                  </div>
                  
                  {/* Table Body */}
                  <div className="divide-y divide-border">
                    {paginatedCustomers.map((customer, index) => (
                      <div 
                        key={customer.id} 
                        className={`grid grid-cols-6 gap-4 p-6 hover:bg-muted/30 transition-all duration-200 ${
                          index % 2 === 0 ? 'bg-card' : 'bg-muted/10'
                        }`}
                      >
                        <div className="text-foreground font-medium text-base">
                          {customer.contactName}
                          {customer.contactTitle && (
                            <div className="text-xs text-muted-foreground mt-1">{customer.contactTitle}</div>
                          )}
                        </div>
                        <div className="text-muted-foreground text-sm font-medium">{customer.companyName}</div>
                        <div className="text-muted-foreground text-sm">
                          {customer.city}
                          {customer.region && (
                            <div className="text-xs text-muted-foreground">{customer.region}</div>
                          )}
                        </div>
                        <div className="text-muted-foreground text-sm font-medium">{customer.country}</div>
                        <div className="text-foreground text-sm">{customer.phone}</div>
                        <div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-primary/30 text-primary hover:text-primary-foreground hover:bg-primary transition-all duration-200 font-medium"
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
                <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                    <span className="font-medium text-foreground">{Math.min(currentPage * itemsPerPage, filteredCustomers.length)}</span> of{' '}
                    <span className="font-medium text-foreground">{filteredCustomers.length}</span> customers
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground px-3">
                      Page <span className="font-medium text-foreground">{currentPage}</span> of{' '}
                      <span className="font-medium text-foreground">{totalPages}</span>
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
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
  return CustomerList({
    onSelectCustomer: (customer) => {
      // Navigate to the customer details page
      navigate({
        to: `/customer/${customer.id}`,
      });
      
      // Handle customer selection, e.g., navigate to customer details page
    }
  });
}