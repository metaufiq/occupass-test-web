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
  type OnChangeFn,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  title: string;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  pagination?: {
    currentPage?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    onPageChange?: (page: number) => void;
  };
}

const  renderSortIcon = (sortDirection: false | 'asc' | 'desc') => {
    if (sortDirection === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4 text-primary" />;
    } else if (sortDirection === 'desc') {
      return <ArrowDown className="ml-2 h-4 w-4 text-primary" />;
    } else {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
  };

const Component = <TData, TValue>({
  columns,
  data,
  loading = false,
  title,
  sorting: externalSorting,
  onSortingChange: onExternalSortingChange,
  columnFilters: externalColumnFilters,
  onColumnFiltersChange: onExternalColumnFiltersChange,
  globalFilter: externalGlobalFilter,
  onGlobalFilterChange: onExternalGlobalFilterChange,
  pagination,
}: DataTableProps<TData, TValue>) => {
  // Internal state (used when external state is not provided)
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] = useState<ColumnFiltersState>([]);
  const [internalGlobalFilter, setInternalGlobalFilter] = useState('');
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: pagination?.currentPage ? pagination.currentPage - 1 : 0,
    pageSize: 10,
  });

  // Use external state if provided, otherwise use internal state
  const sorting = externalSorting ?? internalSorting;
  const setSorting = onExternalSortingChange ?? setInternalSorting;
  const columnFilters = externalColumnFilters ?? internalColumnFilters;
  const setColumnFilters = onExternalColumnFiltersChange ?? setInternalColumnFilters;
  const globalFilter = externalGlobalFilter ?? internalGlobalFilter;
  const setGlobalFilter = onExternalGlobalFilterChange ?? setInternalGlobalFilter;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: pagination ? undefined : setPaginationState,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: pagination ? undefined : paginationState,
    },
    manualPagination: !!pagination,
    pageCount: pagination?.totalPages,
  });

  const handlePageChange = useCallback((page: number) => {
    if (pagination && pagination.onPageChange) {
      pagination.onPageChange(page);
    } else {
      setPaginationState(prev => ({ ...prev, pageIndex: page - 1 }));
    }
  }, [pagination]);

  const currentPage = useMemo(() => 
    pagination
      ? (pagination.currentPage || 1)
      : paginationState.pageIndex + 1, 
    [pagination, paginationState.pageIndex]
  );

  const totalPages = pagination ? 
    (pagination.totalPages || 1) : 
    table.getPageCount();
  
  const canGoPrevious = pagination
    ? currentPage > 1
    : table.getCanPreviousPage();

  const canGoNext = pagination
    ? (pagination.hasNextPage || false)
    : table.getCanNextPage();



  return (
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
                      {headerGroup.headers.map((header) => {
                        const sortDirection = header.column.getIsSorted();
                        const isActiveSorted = sortDirection !== false;
                        
                        return (
                          <TableHead
                            key={header.id}
                            className={`text-card-foreground font-semibold text-sm uppercase tracking-wider transition-all duration-200 ${
                              header.column.getCanSort()
                                ? 'cursor-pointer hover:text-primary hover:bg-muted/70'
                                : ''
                            } ${
                              isActiveSorted 
                                ? 'text-primary bg-primary/5 border-l-2 border-l-primary' 
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
                              {header.column.getCanSort() && renderSortIcon(sortDirection)}
                            </div>
                          </TableHead>
                        );
                      })}
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
                        {row.getVisibleCells().map((cell) => {
                          const isColumnSorted = cell.column.getIsSorted() !== false;
                          
                          return (
                            <TableCell 
                              key={cell.id} 
                              className={`py-4 transition-all duration-200 ${
                                isColumnSorted ? 'bg-primary/5 border-l-2 border-l-primary/20' : ''
                              }`}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          );
                        })}
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
                {pagination ? (
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
                  {!pagination && (
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
  );
};

const DataTable = memo(Component) as typeof Component;

export default DataTable;