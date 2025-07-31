import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker";
import { StatsOverview } from "@/components/stats-overview";
import { ChartSection } from "@/components/chart-section";
import { BarChart3, TrendingUp, Clock, Target } from "lucide-react";
import type { ProductionProgram } from "@shared/schema";

export default function ProductionAnalysis() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  const { data: programs, isLoading } = useQuery({
    queryKey: ['/api/production-programs/date-range', dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async () => {
      const response = await fetch(
        `/api/production-programs/date-range?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`
      );
      if (!response.ok) throw new Error('Failed to fetch programs');
      const data = await response.json();
      return data as ProductionProgram[];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/production-stats', dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async () => {
      const response = await fetch(
        `/api/production-stats?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`
      );
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  // Calculate additional metrics
  const avgProgramDuration = programs && programs.length > 0
    ? programs.reduce((sum, p) => sum + (p.workTimeSeconds + p.idleTimeSeconds + p.emergencyTimeSeconds), 0) / programs.length / 3600
    : 0;

  const completionRate = programs && programs.length > 0
    ? (programs.filter(p => p.status === 'zakończono_pomyślnie').length / programs.length) * 100
    : 0;

  const emergencyRate = programs && programs.length > 0
    ? (programs.filter(p => p.status === 'emergency').length / programs.length) * 100
    : 0;

  return (
    <div className="space-y-8 p-2">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-navy-dark to-navy p-8 rounded-xl border border-border shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dzienny Przegląd Pracy</h1>
            <p className="text-blue-200 text-lg">Analiza produktywności i rozkład czasów</p>
          </div>
          <div className="flex items-center space-x-3 bg-black/20 px-6 py-3 rounded-lg">
            <BarChart3 className="h-8 w-8 text-accent" />
            <span className="text-white font-medium">System Monitorowania</span>
          </div>
        </div>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Main Stats Overview */}
      <StatsOverview dateRange={dateRange} />

      {/* Advanced Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-accent/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Średni Czas Programu</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {avgProgramDuration.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Na podstawie {programs?.length || 0} programów
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-success/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Wskaźnik Ukończenia</CardTitle>
              <Target className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {completionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Programy ukończone pomyślnie
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-error/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Wskaźnik Awarii</CardTitle>
              <TrendingUp className="h-4 w-4 text-error" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-error">
              {emergencyRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Programy zakończone awarią
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <ChartSection dateRange={dateRange} />

      {/* Detailed Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Analiza Wydajności</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <div className="animate-pulse h-4 bg-muted rounded"></div>
                <div className="animate-pulse h-4 bg-muted rounded"></div>
                <div className="animate-pulse h-4 bg-muted rounded"></div>
              </div>
            ) : stats ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Całkowity czas produkcji</span>
                  <span className="font-medium">{(stats.totalWorkTime / 3600).toFixed(1)}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Czas postojów</span>
                  <span className="font-medium text-warning">{(stats.totalIdleTime / 3600).toFixed(1)}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Czas awarii</span>
                  <span className="font-medium text-error">{(stats.totalEmergencyTime / 3600).toFixed(1)}h</span>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Ogólna wydajność</span>
                    <span className={`font-bold ${stats.efficiency >= 80 ? 'text-success' : stats.efficiency >= 60 ? 'text-warning' : 'text-error'}`}>
                      {stats.efficiency.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Brak danych do analizy</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Rekomendacje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats && stats.efficiency < 60 && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
                  <p className="text-sm font-medium text-error">Niska wydajność</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Rozważ analizę przyczyn długich przestojów
                  </p>
                </div>
              )}
              
              {emergencyRate > 10 && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-sm font-medium text-warning">Wysoki wskaźnik awarii</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sprawdź procedury konserwacji maszyn
                  </p>
                </div>
              )}
              
              {stats && stats.efficiency >= 80 && (
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm font-medium text-success">Wysoka wydajność</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Utrzymaj obecne standardy pracy
                  </p>
                </div>
              )}

              {completionRate >= 90 && (
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-sm font-medium text-accent">Doskonałe wykonanie</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Programy są realizowane zgodnie z planem
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}