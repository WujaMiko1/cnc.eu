import { useState } from "react";
import { DateRangePicker } from "@/components/date-range-picker";
import { ProductionTable } from "@/components/production-table";
import { FileSearch, Database, Filter } from "lucide-react";

export default function ProductionPrograms() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Monitoring Programów Produkcyjnych</h1>
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-accent" />
          <span className="text-sm text-muted-foreground">Historia i szczegóły programów</span>
        </div>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Production Programs Table */}
      <ProductionTable dateRange={dateRange} />
    </div>
  );
}