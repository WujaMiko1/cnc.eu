import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileSpreadsheet, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import type { ProductionProgram } from "@shared/schema";

interface ProductionTableProps {
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

function formatDate(date: Date): string {
  return new Date(date).toLocaleString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function ProductionTable({ dateRange }: ProductionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof ProductionProgram | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

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

  const handleSort = (column: keyof ProductionProgram) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const exportCSV = async () => {
    try {
      const response = await fetch('/api/export-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
          timeFormat: 'hms',
          separator: 'comma',
        }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'raporty_produkcji.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  if (!programs) return null;

  // Filter and sort programs
  let filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortColumn) {
    filteredPrograms.sort((a, b) => {
      let aVal: any = a[sortColumn];
      let bVal: any = b[sortColumn];
      
      if (aVal instanceof Date) aVal = aVal.getTime();
      if (bVal instanceof Date) bVal = bVal.getTime();
      if (aVal === null || aVal === undefined) aVal = 0;
      if (bVal === null || bVal === undefined) bVal = 0;
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPrograms = filteredPrograms.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card className="bg-card mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Historia Programów Produkcyjnych</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Szukaj programu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black border-gray-600 focus:ring-accent focus:border-accent"
              />
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            </div>
            <Button 
              onClick={exportCSV}
              className="btn-success"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Eksportuj CSV
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-600">
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('name')}
                      className="flex items-center space-x-1 hover:text-accent p-0 h-auto"
                    >
                      <span>Nazwa Programu</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('startDate')}
                      className="flex items-center space-x-1 hover:text-accent p-0 h-auto"
                    >
                      <span>Data Rozpoczęcia</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('endDate')}
                      className="flex items-center space-x-1 hover:text-accent p-0 h-auto"
                    >
                      <span>Data Zakończenia</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Czas Pracy</TableHead>
                  <TableHead>Czas Postoju</TableHead>
                  <TableHead>Status Zakończenia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPrograms.map((program) => (
                  <TableRow key={program.id} className="border-gray-700 hover:bg-gray-700/50">
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(program.startDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {program.endDate ? formatDate(program.endDate) : '—'}
                    </TableCell>
                    <TableCell className="text-success">
                      {formatTime(program.workTimeSeconds)}
                    </TableCell>
                    <TableCell className="text-warning">
                      {formatTime(program.idleTimeSeconds)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={program.status === 'zakończono_pomyślnie' ? 'default' : 'destructive'}
                        className={
                          program.status === 'zakończono_pomyślnie'
                            ? 'bg-success text-black'
                            : 'bg-error text-white'
                        }
                      >
                        {program.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Wyświetlane {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPrograms.length)} z {filteredPrograms.length} rekordów
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="border-gray-600 hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={
                    currentPage === pageNum
                      ? "bg-accent text-accent-foreground"
                      : "border-gray-600 hover:bg-gray-700"
                  }
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="border-gray-600 hover:bg-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
