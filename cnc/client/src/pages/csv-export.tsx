import { useState } from "react";
import { DateRangePicker } from "@/components/date-range-picker";
import { ExportSection } from "@/components/export-section";
import { Download, FileSpreadsheet, Settings } from "lucide-react";

export default function CsvExport() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Format Eksportu CSV</h1>
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="h-6 w-6 text-accent" />
          <span className="text-sm text-muted-foreground">Konfigurowalny eksport danych</span>
        </div>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Export Configuration */}
      <ExportSection dateRange={dateRange} />
    </div>
  );
}