import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface DateRangePickerProps {
  dateRange: {
    from: Date;
    to: Date;
  };
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [localFromDate, setLocalFromDate] = useState(
    dateRange.from.toISOString().split('T')[0]
  );
  const [localToDate, setLocalToDate] = useState(
    dateRange.to.toISOString().split('T')[0]
  );

  const applyDateRange = () => {
    onDateRangeChange({
      from: new Date(localFromDate),
      to: new Date(localToDate),
    });
  };

  const setPreset = (preset: string) => {
    const today = new Date();
    let from: Date;
    let to: Date = today;

    switch (preset) {
      case 'today':
        from = new Date(today);
        break;
      case 'week':
        from = new Date(today);
        from.setDate(today.getDate() - 7);
        break;
      case 'month':
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      default:
        return;
    }

    const fromStr = from.toISOString().split('T')[0];
    const toStr = to.toISOString().split('T')[0];
    
    setLocalFromDate(fromStr);
    setLocalToDate(toStr);
    onDateRangeChange({ from, to });
  };

  return (
    <Card className="mb-8 bg-card">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Wybór Zakresu Dat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="date-from" className="block text-sm font-medium mb-2">
              Data Od
            </Label>
            <Input
              id="date-from"
              type="date"
              value={localFromDate}
              onChange={(e) => setLocalFromDate(e.target.value)}
              className="bg-black border-gray-600 focus:ring-accent focus:border-accent"
            />
          </div>
          <div>
            <Label htmlFor="date-to" className="block text-sm font-medium mb-2">
              Data Do
            </Label>
            <Input
              id="date-to"
              type="date"
              value={localToDate}
              onChange={(e) => setLocalToDate(e.target.value)}
              className="bg-black border-gray-600 focus:ring-accent focus:border-accent"
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={applyDateRange}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
            >
              <Search className="mr-2 h-4 w-4" />
              Zastosuj
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPreset('today')}
            className="bg-gray-700 hover:bg-gray-600"
          >
            Dziś
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPreset('week')}
            className="bg-gray-700 hover:bg-gray-600"
          >
            Tydzień
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPreset('month')}
            className="bg-gray-700 hover:bg-gray-600"
          >
            Miesiąc
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
