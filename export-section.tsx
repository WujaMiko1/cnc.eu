import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportSectionProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

interface ExportConfig {
  fields: string[];
  timeFormat: 'hms' | 'seconds' | 'minutes' | 'hours';
  separator: 'comma' | 'semicolon' | 'tab';
}

const defaultFields = [
  { id: 'name', label: 'Nazwa Programu', checked: true },
  { id: 'startDate', label: 'Data Rozpoczęcia', checked: true },
  { id: 'endDate', label: 'Data Zakończenia', checked: true },
  { id: 'workTime', label: 'Czas Pracy', checked: true },
  { id: 'idleTime', label: 'Czas Postoju', checked: true },
  { id: 'status', label: 'Rodzaj Zakończenia', checked: true },
];

export function ExportSection({ dateRange }: ExportSectionProps) {
  const [fields, setFields] = useState(defaultFields);
  const [timeFormat, setTimeFormat] = useState<ExportConfig['timeFormat']>('hms');
  const [separator, setSeparator] = useState<ExportConfig['separator']>('comma');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const updateField = (fieldId: string, checked: boolean) => {
    setFields(prev => 
      prev.map(field => 
        field.id === fieldId ? { ...field, checked } : field
      )
    );
  };

  const generateCSV = async () => {
    setIsExporting(true);
    
    try {
      const selectedFields = fields.filter(f => f.checked).map(f => f.id);
      
      if (selectedFields.length === 0) {
        toast({
          title: "Błąd eksportu",
          description: "Wybierz przynajmniej jedno pole do eksportu.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch('/api/export-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
          fields: selectedFields,
          timeFormat,
          separator,
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'raporty_produkcji.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Eksport zakończony",
        description: "Plik CSV został pomyślnie wygenerowany i pobrany.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Błąd eksportu",
        description: "Wystąpił błąd podczas generowania pliku CSV.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Konfiguracja Eksportu CSV</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Pola do Eksportu</h4>
            <div className="space-y-3">
              {fields.map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={field.checked}
                    onCheckedChange={(checked) => updateField(field.id, !!checked)}
                    className="border-gray-600 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <Label
                    htmlFor={field.id}
                    className="text-sm cursor-pointer"
                  >
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Opcje Eksportu</h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium mb-2">Format Czasu</Label>
                <Select value={timeFormat} onValueChange={(value: ExportConfig['timeFormat']) => setTimeFormat(value)}>
                  <SelectTrigger className="bg-black border-gray-600 focus:ring-accent focus:border-accent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-gray-600">
                    <SelectItem value="hms">Godziny:Minuty:Sekundy</SelectItem>
                    <SelectItem value="seconds">Sekundy</SelectItem>
                    <SelectItem value="minutes">Minuty</SelectItem>
                    <SelectItem value="hours">Godziny</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium mb-2">Separator CSV</Label>
                <Select value={separator} onValueChange={(value: ExportConfig['separator']) => setSeparator(value)}>
                  <SelectTrigger className="bg-black border-gray-600 focus:ring-accent focus:border-accent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-gray-600">
                    <SelectItem value="comma">Przecinek (,)</SelectItem>
                    <SelectItem value="semicolon">Średnik (;)</SelectItem>
                    <SelectItem value="tab">Tab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={generateCSV}
                disabled={isExporting}
                className="w-full btn-success"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Generowanie...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Pobierz Plik CSV
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
