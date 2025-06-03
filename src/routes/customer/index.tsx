import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { type ColumnDef, type ColumnFiltersState } from '@tanstack/react-table';

import { Customer } from 'dtos';
import { fetchAllCustomers } from '@/api/customers';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/DataTable';
import ControlBar from '@/components/ControlBar';
import PageHeader from '@/components/PageHeader';

interface Props {
  onSelectCustomer: (customer: Customer) => void;
}

const CustomerList = ({ onSelectCustomer }: Props) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Search and filter state
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    country: 'all',
    contactTitle: 'all'
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Customer>[] = useMemo(() => [
    {
      accessorKey: 'contactName',
      header: 'Contact Name',
      cell: ({ row }) => (
        <div className="text-foreground font-medium text-base">
          {row.getValue('contactName')}
          {row.original.contactTitle && (
            <div className="text-xs text-muted-foreground mt-1">{row.original.contactTitle}</div>
          )}
        </div>
      ),
    },
    {
     id: 'contactTitle',
     accessorKey: 'contactTitle',
    },
    {
      accessorKey: 'companyName',
      header: 'Company',
      cell: ({ getValue }) => (
        <div className="text-muted-foreground text-sm font-medium">{getValue<string>()}</div>
      ),
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">
          {row.getValue('city')}
          {row.original.region && (
            <div className="text-xs text-muted-foreground">{row.original.region}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ getValue }) => (
        <div className="text-muted-foreground text-sm font-medium">{getValue<string>()}</div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ getValue }) => (
        <div className="text-foreground text-sm">{getValue<string>()}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button 
          size="sm" 
          variant="outline"
          className="border-primary/30 text-primary hover:text-primary-foreground hover:bg-primary transition-all duration-200 font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onSelectCustomer(row.original);
          }}
        >
          View Details
        </Button>
      ),
      enableSorting: false,
    },
  ], [onSelectCustomer]);

  useEffect(() => {
    setLoading(true);
    fetchAllCustomers().then(response => {
      if (response?.response?.results && response.response.results.length > 0) {
        setCustomers(response.response.results);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleFilterChange = useCallback((filterKey: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [filterKey]: value
    }));
    
    // Update column filters based on selected filters
    setColumnFilters(prev => {
      // Remove existing filter for this key
      const otherFilters = prev.filter(filter => filter.id !== filterKey);
      
      // Add new filter if not 'all'
      if (value !== 'all') {
        return [...otherFilters, { id: filterKey, value }];
      }
      
      return otherFilters;
    });
  }, []);

  // Get unique values for filter dropdowns
  const uniqueCountries = useMemo(() => {
    return [...new Set(customers.map(c => c.country).filter(Boolean))]
      .sort()
      .map(country => ({ label: country, value: country }));
  }, [customers]);

  const uniqueContactTitles = useMemo(() => {
    return [...new Set(customers.map(c => c.contactTitle).filter(Boolean))]
      .sort()
      .map(title => ({ label: title, value: title }));
  }, [customers]);

  // Filter options for ControlBar
  const filterOptions = useMemo(() => {
    const options = [];
    
    if (uniqueCountries.length > 0) {
      options.push({
        label: 'Countries',
        value: 'country',
        accessorKey: 'country',
        options: uniqueCountries,
      });
    }
    
    if (uniqueContactTitles.length > 0) {
      options.push({
        label: 'Contact Titles',
        value: 'contactTitle',
        accessorKey: 'contactTitle',
        options: uniqueContactTitles,
      });
    }
    
    return options;
  }, [uniqueCountries, uniqueContactTitles]);

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Customers" desc="Manage your customer database with ease"/>
      {!loading && (
        <ControlBar
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search customers by name, company, city, or phone..."
          filterOptions={filterOptions}
          currentFilterValues={filterValues}
          onFilterChange={handleFilterChange}
        />
      )}
      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
        title="Customers"
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        globalFilter={searchValue}
        onGlobalFilterChange={setSearchValue}
        hiddenColumns={['contactTitle']}
      />
    </div>
  );
};

function RouteComponent() {
  const navigate = useNavigate();
  
  return CustomerList({
    onSelectCustomer: (customer) => {
      navigate({
        to: `/customer/${customer.id}`,
      });
    }
  });
}

export const Route = createFileRoute('/customer/')({
  component: RouteComponent,
});