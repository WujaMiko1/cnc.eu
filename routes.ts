import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductionProgramSchema, updateProductionProgramSchema, insertMachineSchema, updateMachineSchema } from "@shared/schema";
import { z } from "zod";

const dateRangeSchema = z.object({
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
});

const paginationSchema = z.object({
  limit: z.string().transform(val => parseInt(val) || 50).optional(),
  offset: z.string().transform(val => parseInt(val) || 0).optional(),
});

const csvExportSchema = z.object({
  startDate: z.string().transform(str => new Date(str)).optional(),
  endDate: z.string().transform(str => new Date(str)).optional(),
  fields: z.array(z.string()).optional(),
  timeFormat: z.enum(['hms', 'seconds', 'minutes', 'hours']).default('hms'),
  separator: z.enum(['comma', 'semicolon', 'tab']).default('comma'),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Machine endpoints
  app.get("/api/machines", async (req, res) => {
    try {
      const machines = await storage.getMachines();
      res.json(machines);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/machines/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const machine = await storage.getMachine(id);
      
      if (!machine) {
        return res.status(404).json({ message: "Machine not found" });
      }
      
      res.json(machine);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/machines", async (req, res) => {
    try {
      const machineData = insertMachineSchema.parse(req.body);
      const machine = await storage.createMachine(machineData);
      res.status(201).json(machine);
    } catch (error) {
      res.status(400).json({ message: "Invalid machine data" });
    }
  });

  app.patch("/api/machines/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateMachineSchema.parse(req.body);
      const machine = await storage.updateMachine(id, updates);
      
      if (!machine) {
        return res.status(404).json({ message: "Machine not found" });
      }
      
      res.json(machine);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.delete("/api/machines/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMachine(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Machine not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get production programs with pagination
  app.get("/api/production-programs", async (req, res) => {
    try {
      const { limit, offset } = paginationSchema.parse(req.query);
      const programs = await storage.getProductionPrograms(limit, offset);
      res.json(programs);
    } catch (error) {
      res.status(400).json({ message: "Invalid query parameters" });
    }
  });

  // Get production programs by date range
  app.get("/api/production-programs/date-range", async (req, res) => {
    try {
      const { startDate, endDate } = dateRangeSchema.parse(req.query);
      const programs = await storage.getProductionProgramsByDateRange(startDate, endDate);
      res.json(programs);
    } catch (error) {
      res.status(400).json({ message: "Invalid date range parameters" });
    }
  });

  // Get production statistics
  app.get("/api/production-stats", async (req, res) => {
    try {
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      if (req.query.startDate && req.query.endDate) {
        const dates = dateRangeSchema.parse(req.query);
        startDate = dates.startDate;
        endDate = dates.endDate;
      }
      
      const stats = await storage.getProductionStats(startDate, endDate);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ message: "Invalid parameters" });
    }
  });

  // Create production program
  app.post("/api/production-programs", async (req, res) => {
    try {
      const programData = insertProductionProgramSchema.parse(req.body);
      const program = await storage.createProductionProgram(programData);
      res.status(201).json(program);
    } catch (error) {
      res.status(400).json({ message: "Invalid program data" });
    }
  });

  // Update production program
  app.patch("/api/production-programs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateProductionProgramSchema.parse(req.body);
      const program = await storage.updateProductionProgram(id, updates);
      
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.json(program);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Delete production program
  app.delete("/api/production-programs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProductionProgram(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Export CSV
  app.post("/api/export-csv", async (req, res) => {
    try {
      const config = csvExportSchema.parse(req.body);
      
      let programs;
      if (config.startDate && config.endDate) {
        programs = await storage.getProductionProgramsByDateRange(config.startDate, config.endDate);
      } else {
        programs = await storage.getProductionPrograms();
      }

      const formatTime = (seconds: number) => {
        switch (config.timeFormat) {
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
      };

      const getSeparator = () => {
        switch (config.separator) {
          case 'semicolon': return ';';
          case 'tab': return '\t';
          case 'comma':
          default: return ',';
        }
      };

      const separator = getSeparator();
      const defaultFields = ['name', 'startDate', 'endDate', 'workTime', 'idleTime', 'status'];
      const fields = config.fields || defaultFields;

      // Create CSV header
      const headerMap: Record<string, string> = {
        name: 'Nazwa Programu',
        startDate: 'Data Rozpoczęcia',
        endDate: 'Data Zakończenia',
        workTime: 'Czas Pracy',
        idleTime: 'Czas Postoju',
        status: 'Rodzaj Zakończenia'
      };

      const header = fields.map(field => headerMap[field] || field).join(separator);
      
      // Create CSV rows
      const rows = programs.map(program => {
        const rowData: Record<string, string> = {
          name: program.name,
          startDate: program.startDate.toISOString().replace('T', ' ').substring(0, 19),
          endDate: program.endDate ? program.endDate.toISOString().replace('T', ' ').substring(0, 19) : '',
          workTime: formatTime(program.workTimeSeconds),
          idleTime: formatTime(program.idleTimeSeconds),
          status: program.status
        };
        
        return fields.map(field => rowData[field] || '').join(separator);
      });

      const csv = [header, ...rows].join('\n');
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="raporty_produkcji.csv"');
      res.send('\uFEFF' + csv); // Add BOM for Excel compatibility
    } catch (error) {
      res.status(400).json({ message: "Invalid export configuration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
