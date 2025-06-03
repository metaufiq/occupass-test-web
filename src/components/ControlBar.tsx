import { useCallback } from 'react';
import { Search, Filter } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterOption {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  accessorKey: string;
}

interface Props {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterOptions?: FilterOption[];
  currentFilterValues?: Record<string, string>;
  onFilterChange?: (filterKey: string, value: string) => void;
}

const ControlBar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterOptions = [],
  currentFilterValues = {},
  onFilterChange,
}: Props) => {
  const handleFilterChange = useCallback((filterKey: string, value: string) => {
    onFilterChange?.(filterKey, value);
  }, [onFilterChange]);

  return (
    <Card className="card-hover bg-card border-border shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-input border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          {/* Filters Row */}
          {filterOptions.length > 0 && onFilterChange && (
            <div className="flex flex-wrap gap-3">
              {filterOptions.map((filter) => (
                <Select 
                  key={filter.value}
                  value={currentFilterValues[filter.value] || 'all'} 
                  onValueChange={(value) => handleFilterChange(filter.value, value)}
                >
                  <SelectTrigger className="w-48 bg-input border-border text-foreground">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all" className="text-popover-foreground">
                      All {filter.label}
                    </SelectItem>
                    {filter.options.map(option => (
                      <SelectItem 
                        key={`${filter.value}-${option.value}`} 
                        value={option.value} 
                        className="text-popover-foreground"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlBar;