export interface CSVExportConfig {
  fields: string[];
  timeFormat: 'hms' | 'seconds' | 'minutes' | 'hours';
  separator: 'comma' | 'semicolon' | 'tab';
  startDate?: Date;
  endDate?: Date;
}

export function formatTimeForExport(seconds: number, format: CSVExportConfig['timeFormat']): string {
  switch (format) {
    case 'seconds':
      return seconds.toString();
    case 'minutes':
      return (seconds / 60).toFixed(2);
    case 'hours':
      return (seconds / 3600).toFixed(2);
    case 'hms':
    default:
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

export function getSeparatorChar(separator: CSVExportConfig['separator']): string {
  switch (separator) {
    case 'semicolon':
      return ';';
    case 'tab':
      return '\t';
    case 'comma':
    default:
      return ',';
  }
}

export function downloadCSV(csvContent: string, filename: string = 'raporty_produkcji.csv'): void {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}
