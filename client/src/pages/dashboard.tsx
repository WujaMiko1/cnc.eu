import { useState } from "react";
import { StatsOverview } from "@/components/stats-overview";
import { DateRangePicker } from "@/components/date-range-picker";
import { ProductionTable } from "@/components/production-table";
import { ChartSection } from "@/components/chart-section";
import { ExportSection } from "@/components/export-section";
import { BarChart3, Activity } from "lucide-react";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Główny</h1>
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-accent" />
          <span className="text-sm text-muted-foreground">Przegląd systemu produkcji</span>
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><span>System</span></li>
          <li>/</li>
          <li className="text-foreground">Dashboard Główny</li>
        </ol>
      </nav>

      {/* Date Range Picker */}
      <DateRangePicker 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Stats Overview */}
      <StatsOverview dateRange={dateRange} />

      {/* Charts */}
      <ChartSection dateRange={dateRange} />

      {/* Production Table */}
      <ProductionTable dateRange={dateRange} />

      {/* Export Section */}
      <ExportSection dateRange={dateRange} />
    </div>
  );
}
