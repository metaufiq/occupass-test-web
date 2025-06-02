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
  filterOptions?: FilterOption;
  currentFilterValue?: string;
  onFilterChange?: (value: string) => void;
}

const ControlBar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterOptions,
  currentFilterValue = 'all',
  onFilterChange,
}: Props) => {
  const handleFilterChange = useCallback((value: string) => {
    onFilterChange?.(value);
  }, [onFilterChange]);

  return (
    <Card className="card-hover bg-card border-border shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-input border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>
          {filterOptions && onFilterChange && (
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
  );
};

export default ControlBar;