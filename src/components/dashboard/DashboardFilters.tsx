import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { type EcosystemStatus, type EcosystemType, type Region } from "@/lib/api";

interface DashboardFiltersProps {
  regions: Region[];
  selectedRegion: string | null;
  onRegionChange: (region: string | null) => void;
  selectedStatus: EcosystemStatus | null;
  onStatusChange: (status: EcosystemStatus | null) => void;
  selectedType: EcosystemType | null;
  onTypeChange: (type: EcosystemType | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

const statusOptions: EcosystemStatus[] = ['active', 'monitoring', 'degraded', 'restored'];
const typeOptions: EcosystemType[] = ['watershed', 'forest', 'urban_block', 'farm', 'grassland', 'wetland'];

export function DashboardFilters({
  regions,
  selectedRegion,
  onRegionChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
  searchQuery,
  onSearchChange,
  className,
}: DashboardFiltersProps) {
  const hasFilters = selectedRegion || selectedStatus || selectedType || searchQuery;

  const clearFilters = () => {
    onRegionChange(null);
    onStatusChange(null);
    onTypeChange(null);
    onSearchChange('');
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search ecosystems..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-secondary border-border"
        />
      </div>

      {/* Region Filter */}
      <Select
        value={selectedRegion || 'all'}
        onValueChange={(v) => onRegionChange(v === 'all' ? null : v)}
      >
        <SelectTrigger className="w-[180px] bg-secondary border-border">
          <SelectValue placeholder="All Regions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Regions</SelectItem>
          {regions.map((region) => (
            <SelectItem key={region.id} value={region.id}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={selectedStatus || 'all'}
        onValueChange={(v) => onStatusChange(v === 'all' ? null : v as EcosystemStatus)}
      >
        <SelectTrigger className="w-[150px] bg-secondary border-border">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status} className="capitalize">
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Type Filter */}
      <Select
        value={selectedType || 'all'}
        onValueChange={(v) => onTypeChange(v === 'all' ? null : v as EcosystemType)}
      >
        <SelectTrigger className="w-[150px] bg-secondary border-border">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {typeOptions.map((type) => (
            <SelectItem key={type} value={type} className="capitalize">
              {type.replace('_', ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="verdant-ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-1"
        >
          <X className="w-3 h-3" />
          Clear
        </Button>
      )}
    </div>
  );
}
