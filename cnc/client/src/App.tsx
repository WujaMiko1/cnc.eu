import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import MachineMonitoring from "@/pages/machine-monitoring";
import ProductionAnalysis from "@/pages/production-analysis";
import ProductionPrograms from "@/pages/production-programs";
import CsvExport from "@/pages/csv-export";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={ProductionAnalysis} />
        <Route path="/maszyny" component={MachineMonitoring} />
        <Route path="/analiza" component={ProductionAnalysis} />
        <Route path="/programy" component={ProductionPrograms} />
        <Route path="/eksport" component={CsvExport} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
