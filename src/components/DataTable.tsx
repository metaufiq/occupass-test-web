import { memo, useCallback, useMemo, useState } from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  searchPlaceholder?: string;
  searchAccessorKey?: string;
  filterOptions?: {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    accessorKey: string;
  };
  title: string;
  description: string;
  pagination?: {
    manual?: boolean;
    currentPage?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    onPageChange?: (page: number) => void;
  };
}

const Component = <TData, TValue>({
  columns,
  data,
  loading = false,
  searchPlaceholder = "Search...",
  filterOptions,
  title,
  description,
  pagination,
}: DataTableProps<TData, TValue>)=>{
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: pagination?.currentPage ? pagination.currentPage - 1 : 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination?.manual ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: pagination?.manual ? undefined : setPaginationState,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: pagination?.manual ? undefined : paginationState,
    },
    manualPagination: pagination?.manual,
    pageCount: pagination?.totalPages,
  });

  const handleFilterChange = useCallback((value: string) => {
    if (filterOptions) {
      if (value === 'all') {
        setColumnFilters(prev => prev.filter(filter => filter.id !== filterOptions.accessorKey));
      } else {
        setColumnFilters(prev => [
          ...prev.filter(filter => filter.id !== filterOptions.accessorKey),
          { id: filterOptions.accessorKey, value }
        ]);
      }
    }
  }, [filterOptions]);

  const currentFilterValue = columnFilters.find(
    filter => filter.id === filterOptions?.accessorKey
  )?.value as string || 'all';

  const handlePageChange = useCallback((page: number) => {
    if (pagination?.manual && pagination.onPageChange) {
      pagination.onPageChange(page);
    } else {
      setPaginationState(prev => ({ ...prev, pageIndex: page - 1 }));
    }
  }, [pagination]);

  const currentPage = useMemo(()=>pagination?.manual 
    ? (pagination.currentPage || 1)
    : paginationState.pageIndex + 1, [pagination, paginationState.pageIndex]);

  const totalPages = useMemo(()=>pagination?.manual 
    ? (pagination.totalPages || 1)
    : table.getPageCount(), [pagination, table]);

  const canGoPrevious = useMemo(()=>pagination?.manual 
    ? currentPage > 1
    : table.getCanPreviousPage(), [pagination, currentPage, table]);

  const canGoNext = useMemo(()=>pagination?.manual 
    ? (pagination.hasNextPage || false)
    : table.getCanNextPage(), [pagination, table]);

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>

        {/* Search and Filter Controls */}
        <Card className="card-hover bg-card border-border shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10 bg-input border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              {filterOptions && (
                <Select value={currentFilterValue} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-56 bg-input border-border text-foreground">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder={filterOptions.label} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all" className="text-popover-foreground">
                      All {filterOptions.label}
                    </SelectItem>
                    {filterOptions.options.map(option => (
                      <SelectItem key={option.value} value={option.value} className="text-popover-foreground">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="card-hover bg-card border-border shadow-xl">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
                <div className="text-muted-foreground text-lg">Loading {title.toLowerCase()}...</div>
              </div>
            ) : (
              <>
                <div className="rounded-md border-0">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="border-border bg-muted/50 hover:bg-muted/50">
                          {headerGroup.headers.map((header) => (
                            <TableHead
                              key={header.id}
                              className={`text-card-foreground font-semibold text-sm uppercase tracking-wider transition-colors ${
                                header.column.getCanSort()
                                  ? 'cursor-pointer hover:text-primary'
                                  : ''
                              }`}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <div className="flex items-center">
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                {header.column.getCanSort() && (
                                  <ArrowUpDown className="ml-2 h-4 w-4" />
                                )}
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row, index) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className={`hover:bg-muted/30 transition-all duration-200 border-border ${
                              index % 2 === 0 ? 'bg-card' : 'bg-muted/10'
                            }`}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id} className="py-4">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No {title.toLowerCase()} found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
                  <div className="text-sm text-muted-foreground">
                    {pagination?.manual ? (
                      <>
                        Showing {title.toLowerCase()} for page{' '}
                        <span className="font-medium text-foreground">{currentPage}</span>
                      </>
                    ) : (
                      <>
                        Showing{' '}
                        <span className="font-medium text-foreground">
                          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium text-foreground">
                          {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                          )}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium text-foreground">
                          {table.getFilteredRowModel().rows.length}
                        </span>{' '}
                        {title.toLowerCase()}
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!canGoPrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground px-3">
                      Page <span className="font-medium text-foreground">{currentPage}</span>
                      {!pagination?.manual && (
                        <> of <span className="font-medium text-foreground">{totalPages}</span></>
                      )}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!canGoNext}
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
}

 const DataTable= memo(Component) as typeof Component;

export default DataTable;