import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, AlertTriangle, PieChart } from "lucide-react";

interface StatsOverviewProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function StatsOverview({ dateRange }: StatsOverviewProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/production-stats', dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async () => {
      const response = await fetch(
        `/api/production-stats?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`
      );
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card">
          <CardContent className="p-6">
            <p className="text-error">Błąd podczas ładowania statystyk</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: "Całkowity Czas Pracy",
      value: formatTime(stats.totalWorkTime),
      icon: Play,
      color: "text-success",
    },
    {
      title: "Czas Postoju",
      value: formatTime(stats.totalIdleTime),
      icon: Pause,
      color: "text-warning",
    },
    {
      title: "Czas Awarii",
      value: formatTime(stats.totalEmergencyTime),
      icon: AlertTriangle,
      color: "text-error",
    },
    {
      title: "Wydajność",
      value: `${stats.efficiency.toFixed(1)}%`,
      icon: PieChart,
      color: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
