import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import type { ProductionProgram } from "@shared/schema";

interface ChartSectionProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

const COLORS = {
  work: '#4CAF50',
  idle: '#FF9800',
  emergency: '#F44336'
};

export function ChartSection({ dateRange }: ChartSectionProps) {
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="bg-card">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!programs) return null;

  // Prepare daily chart data
  const dailyData: Record<string, { day: string; work: number; idle: number; emergency: number }> = {};
  
  programs.forEach(program => {
    const day = new Date(program.startDate).toLocaleDateString('pl-PL', { weekday: 'short' });
    if (!dailyData[day]) {
      dailyData[day] = { day, work: 0, idle: 0, emergency: 0 };
    }
    dailyData[day].work += program.workTimeSeconds / 3600; // Convert to hours
    dailyData[day].idle += program.idleTimeSeconds / 3600;
    dailyData[day].emergency += program.emergencyTimeSeconds / 3600;
  });

  const chartData = Object.values(dailyData);

  // Prepare pie chart data
  const totalWork = programs.reduce((sum, p) => sum + p.workTimeSeconds, 0);
  const totalIdle = programs.reduce((sum, p) => sum + p.idleTimeSeconds, 0);
  const totalEmergency = programs.reduce((sum, p) => sum + p.emergencyTimeSeconds, 0);

  const pieData = [
    { name: 'Czas Pracy', value: totalWork / 3600, fill: COLORS.work },
    { name: 'Czas Postoju', value: totalIdle / 3600, fill: COLORS.idle },
    { name: 'Czas Awarii', value: totalEmergency / 3600, fill: COLORS.emergency },
  ].filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="bg-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Dzienny Przegląd Pracy</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#424242" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#ffffff', fontSize: 12 }}
                axisLine={{ stroke: '#424242' }}
              />
              <YAxis 
                tick={{ fill: '#ffffff', fontSize: 12 }}
                axisLine={{ stroke: '#424242' }}
                label={{ value: 'Godziny', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#ffffff' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#424242', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}h`, '']}
              />
              <Bar dataKey="work" fill={COLORS.work} name="Czas Pracy" />
              <Bar dataKey="idle" fill={COLORS.idle} name="Czas Postoju" />
              <Bar dataKey="emergency" fill={COLORS.emergency} name="Czas Awarii" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Rozkład Czasów</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#424242', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}h`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col space-y-2 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-white">{entry.name}: {entry.value.toFixed(1)}h</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
