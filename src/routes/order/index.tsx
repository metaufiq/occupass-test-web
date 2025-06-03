import { useEffect, useState, useMemo, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type ColumnDef, type ColumnFiltersState } from "@tanstack/react-table";

import { CustomerOrder, Order, OrderDetail } from "dtos";
import { formatDateAPI } from "@/lib/utils";
import { fetchOrders } from "@/api/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useOrderStore from "@/stores/order";
import DataTable from "@/components/DataTable";
import ControlBar from "@/components/ControlBar";
import PageHeader from "@/components/PageHeader";

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

interface Props {
  onSelectOrder: (order: CustomerOrder) => void;
}

// Helper function to calculate total amount from order details
const calculateOrderAmount = (orderDetails: OrderDetail[]) => {
  return orderDetails.reduce((total, detail) => {
    return total + detail.unitPrice * detail.quantity * (1 - detail.discount);
  }, 0);
};

// Helper function to get total items count from order details
const getItemsCount = (orderDetails: OrderDetail[]) => {
  return orderDetails.reduce((total, detail) => total + detail.quantity, 0);
};

// Helper function to determine order status based on dates
const getOrderStatus = (order: Order): OrderStatus => {
  if (order.shippedDate) {
    return "Shipped";
  } else if (order.orderDate) {
    return "Processing";
  } else {
    return "Pending";
  }
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "Delivered":
      return "bg-chart-4 text-white";
    case "Shipped":
      return "bg-primary text-primary-foreground";
    case "Processing":
      return "bg-chart-5 text-white";
    case "Pending":
      return "bg-chart-5 text-white";
    case "Cancelled":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const OrderList = ({ onSelectOrder }: Props) => {
  const setSelectedCustomerOrder = useOrderStore(
    (state) => state.setSelectedCustomerOrder
  );

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  // Search and filter state
  const [searchValue, setSearchValue] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: "all",
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<CustomerOrder>[] = useMemo(
    () => [
      {
        accessorFn: (row) => row.order.id,
        id: "id",
        header: "Order ID",
        cell: ({ getValue }) => (
          <div className="text-foreground font-medium text-base">
            {getValue<number>()}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.order.customerId,
        id: "customerId",
        header: "Customer",
        cell: ({ getValue }) => (
          <div className="text-muted-foreground text-sm font-medium">
            {getValue<string>()}
          </div>
        ),
      },
      {
        accessorFn: (row) => calculateOrderAmount(row.orderDetails),
        id: "amount",
        header: "Amount",
        cell: ({ getValue }) => (
          <div className="text-foreground text-sm font-medium">
            ${getValue<number>().toFixed(2)}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.order.freight,
        id: "freight",
        header: "Freight",
        cell: ({ getValue }) => (
          <div className="text-muted-foreground text-sm">
            ${getValue<number>().toFixed(2)}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.order.orderDate,
        id: "orderDate",
        header: "Date",
        cell: ({ getValue }) => (
          <div className="text-muted-foreground text-sm">
            {formatDateAPI(getValue<string>())}
          </div>
        ),
      },
      {
        accessorFn: (row) => getItemsCount(row.orderDetails),
        id: "items",
        header: "Items",
        cell: ({ getValue }) => (
          <div className="text-foreground text-sm font-medium">
            {getValue<number>()}
          </div>
        ),
      },
      {
        accessorFn: (row) => getOrderStatus(row.order),
        id: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue<OrderStatus>();
          return (
            <Badge className={`${getStatusColor(status)} w-24`}>{status}</Badge>
          );
        },
        enableSorting: false,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="outline"
            className="border-primary/30 text-primary hover:text-primary-foreground hover:bg-primary transition-all duration-200 font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onSelectOrder(row.original);
            }}
          >
            View Details
          </Button>
        ),
        enableSorting: false,
      },
    ],
    [onSelectOrder]
  );

  // Fetch orders whenever currentPage changes
  useEffect(() => {
    setLoading(true);

    fetchOrders({
      page: currentPage,
    })
      .then((response) => {
        if (response.response && response.response.results) {
          setOrders(response.response.results);
          setHasMorePages(!!response.response.results.length);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setHasMorePages(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  useEffect(() => {
    setSelectedCustomerOrder(null);
  }, [setSelectedCustomerOrder]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((filterKey: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
    setCurrentPage(1);

    // Update column filters based on selected filters
    setColumnFilters((prev) => {
      // Remove existing filter for this key
      const otherFilters = prev.filter((filter) => filter.id !== filterKey);

      // Add new filter if not 'all'
      if (value !== "all") {
        return [...otherFilters, { id: filterKey, value }];
      }

      return otherFilters;
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Filter options for ControlBar
  const filterOptions = useMemo(
    () => [
      {
        label: "Status",
        value: "status",
        accessorKey: "status",
        options: [
          { label: "Pending", value: "Pending" },
          { label: "Processing", value: "Processing" },
          { label: "Shipped", value: "Shipped" },
          { label: "Delivered", value: "Delivered" },
          { label: "Cancelled", value: "Cancelled" },
        ],
      },
    ],
    []
  );

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Orders"
        desc="Track and manage customer orders with ease"
      />
      {!loading && (
        <ControlBar
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search orders by order ID or customer..."
          filterOptions={filterOptions}
          currentFilterValues={filterValues}
          onFilterChange={handleFilterChange}
        />
      )}
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        title="Orders"
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        globalFilter={searchValue}
        onGlobalFilterChange={setSearchValue}
        pagination={{
          currentPage,
          hasNextPage: hasMorePages,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
};

function RouteComponent() {
  const navigate = useNavigate();
  const setSelectedCustomerOrder = useOrderStore(
    (state) => state.setSelectedCustomerOrder
  );

  return OrderList({
    onSelectOrder: (order) => {
      setSelectedCustomerOrder(order);
      navigate({
        to: "/order/detail",
      });
    },
  });
}

export const Route = createFileRoute("/order/")({
  component: RouteComponent,
});
