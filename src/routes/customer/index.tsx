import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';

import { Customer } from 'dtos';
import { fetchAllCustomers } from '@/api/customers';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/DataTable';

export const Route = createFileRoute('/customer/')({
  component: RouteComponent,
});

// Customer List Component
const CustomerList = ({ onSelectCustomer }: { onSelectCustomer: (customer: Customer) => void }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
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

  // Get unique countries for filter dropdown
  const uniqueCountries = useMemo(() => {
    return [...new Set(customers.map(c => c.country).filter(Boolean))]
      .sort()
      .map(country => ({ label: country, value: country }));
  }, [customers]);

  // Country filter options
  const countryFilterOptions = uniqueCountries.length > 0 ? {
    label: 'Countries',
    value: 'country',
    accessorKey: 'country',
    options: uniqueCountries,
  } : undefined;

  return (
    <DataTable
      columns={columns}
      data={customers}
      loading={loading}
      title="Customers"
      description="Manage your customer database with ease"
      searchPlaceholder="Search customers by name, company, city, or phone..."
      filterOptions={countryFilterOptions}
    />
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