import { type User, type InsertUser, type Machine, type InsertMachine, type UpdateMachine, type ProductionProgram, type InsertProductionProgram, type UpdateProductionProgram } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Machines
  getMachines(): Promise<Machine[]>;
  getMachine(id: string): Promise<Machine | undefined>;
  createMachine(machine: InsertMachine): Promise<Machine>;
  updateMachine(id: string, updates: UpdateMachine): Promise<Machine | undefined>;
  deleteMachine(id: string): Promise<boolean>;
  
  // Production Programs
  getProductionPrograms(limit?: number, offset?: number): Promise<ProductionProgram[]>;
  getProductionProgramsByDateRange(startDate: Date, endDate: Date): Promise<ProductionProgram[]>;
  getProductionProgram(id: string): Promise<ProductionProgram | undefined>;
  createProductionProgram(program: InsertProductionProgram): Promise<ProductionProgram>;
  updateProductionProgram(id: string, updates: UpdateProductionProgram): Promise<ProductionProgram | undefined>;
  deleteProductionProgram(id: string): Promise<boolean>;
  getProductionStats(startDate?: Date, endDate?: Date): Promise<{
    totalWorkTime: number;
    totalIdleTime: number;
    totalEmergencyTime: number;
    totalPrograms: number;
    efficiency: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private machines: Map<string, Machine>;
  private productionPrograms: Map<string, ProductionProgram>;

  constructor() {
    this.users = new Map();
    this.machines = new Map();
    this.productionPrograms = new Map();
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample machines
    const sampleMachines: Machine[] = [
      {
        id: randomUUID(),
        name: "Centrum CNC M1",
        position: "Stanowisko A1",
        status: "working",
        speed: 1850,
        filesCompleted: 142,
        lastUpdate: new Date(),
      },
      {
        id: randomUUID(),
        name: "Tokarka CNC T2",
        position: "Stanowisko B3",
        status: "idle",
        speed: 0,
        filesCompleted: 89,
        lastUpdate: new Date(),
      },
      {
        id: randomUUID(),
        name: "Frezarka F3",
        position: "Stanowisko C2",
        status: "emergency",
        speed: 0,
        filesCompleted: 67,
        lastUpdate: new Date(),
      },
      {
        id: randomUUID(),
        name: "Centrum CNC M4",
        position: "Stanowisko A2",
        status: "working",
        speed: 2100,
        filesCompleted: 203,
        lastUpdate: new Date(),
      },
    ];

    sampleMachines.forEach(machine => {
      this.machines.set(machine.id, machine);
    });

    const machineIds = Array.from(this.machines.keys());
    
    const samplePrograms: ProductionProgram[] = [
      {
        id: randomUUID(),
        name: "PROG_001_Obudowa",
        machineId: machineIds[0],
        startDate: new Date("2024-01-15T08:30:00"),
        endDate: new Date("2024-01-15T16:45:00"),
        workTimeSeconds: 27135, // 7:32:15
        idleTimeSeconds: 2565,  // 0:42:45
        emergencyTimeSeconds: 0,
        status: "zakończono_pomyślnie",
        createdAt: new Date("2024-01-15T08:30:00"),
      },
      {
        id: randomUUID(),
        name: "PROG_002_Korpus",
        machineId: machineIds[1],
        startDate: new Date("2024-01-16T09:15:00"),
        endDate: new Date("2024-01-16T14:20:00"),
        workTimeSeconds: 15512, // 4:18:32
        idleTimeSeconds: 2788,  // 0:46:28
        emergencyTimeSeconds: 1800, // 0:30:00
        status: "emergency",
        createdAt: new Date("2024-01-16T09:15:00"),
      },
      {
        id: randomUUID(),
        name: "PROG_003_Ramie",
        machineId: machineIds[2],
        startDate: new Date("2024-01-17T07:45:00"),
        endDate: new Date("2024-01-17T17:30:00"),
        workTimeSeconds: 32118, // 8:55:18
        idleTimeSeconds: 2982,  // 0:49:42
        emergencyTimeSeconds: 0,
        status: "zakończono_pomyślnie",
        createdAt: new Date("2024-01-17T07:45:00"),
      },
    ];

    samplePrograms.forEach(program => {
      this.productionPrograms.set(program.id, program);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Machine methods
  async getMachines(): Promise<Machine[]> {
    return Array.from(this.machines.values());
  }

  async getMachine(id: string): Promise<Machine | undefined> {
    return this.machines.get(id);
  }

  async createMachine(insertMachine: InsertMachine): Promise<Machine> {
    const id = randomUUID();
    const machine: Machine = {
      id,
      name: insertMachine.name,
      position: insertMachine.position,
      status: insertMachine.status || "idle",
      speed: insertMachine.speed || 0,
      filesCompleted: insertMachine.filesCompleted || 0,
      lastUpdate: new Date(),
    };
    this.machines.set(id, machine);
    return machine;
  }

  async updateMachine(id: string, updates: UpdateMachine): Promise<Machine | undefined> {
    const existing = this.machines.get(id);
    if (!existing) return undefined;

    const updated = { 
      ...existing, 
      ...updates,
      lastUpdate: new Date()
    };
    this.machines.set(id, updated);
    return updated;
  }

  async deleteMachine(id: string): Promise<boolean> {
    return this.machines.delete(id);
  }

  async getProductionPrograms(limit = 50, offset = 0): Promise<ProductionProgram[]> {
    const programs = Array.from(this.productionPrograms.values())
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    
    return programs.slice(offset, offset + limit);
  }

  async getProductionProgramsByDateRange(startDate: Date, endDate: Date): Promise<ProductionProgram[]> {
    return Array.from(this.productionPrograms.values())
      .filter(program => {
        const programStart = new Date(program.startDate);
        return programStart >= startDate && programStart <= endDate;
      })
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }

  async getProductionProgram(id: string): Promise<ProductionProgram | undefined> {
    return this.productionPrograms.get(id);
  }

  async createProductionProgram(insertProgram: InsertProductionProgram): Promise<ProductionProgram> {
    const id = randomUUID();
    const program: ProductionProgram = {
      id,
      name: insertProgram.name,
      machineId: insertProgram.machineId || null,
      startDate: insertProgram.startDate,
      endDate: insertProgram.endDate || null,
      workTimeSeconds: insertProgram.workTimeSeconds || 0,
      idleTimeSeconds: insertProgram.idleTimeSeconds || 0,
      emergencyTimeSeconds: insertProgram.emergencyTimeSeconds || 0,
      status: insertProgram.status || "running",
      createdAt: new Date(),
    };
    this.productionPrograms.set(id, program);
    return program;
  }

  async updateProductionProgram(id: string, updates: UpdateProductionProgram): Promise<ProductionProgram | undefined> {
    const existing = this.productionPrograms.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.productionPrograms.set(id, updated);
    return updated;
  }

  async deleteProductionProgram(id: string): Promise<boolean> {
    return this.productionPrograms.delete(id);
  }

  async getProductionStats(startDate?: Date, endDate?: Date): Promise<{
    totalWorkTime: number;
    totalIdleTime: number;
    totalEmergencyTime: number;
    totalPrograms: number;
    efficiency: number;
  }> {
    let programs = Array.from(this.productionPrograms.values());
    
    if (startDate && endDate) {
      programs = programs.filter(program => {
        const programStart = new Date(program.startDate);
        return programStart >= startDate && programStart <= endDate;
      });
    }

    const totalWorkTime = programs.reduce((sum, p) => sum + p.workTimeSeconds, 0);
    const totalIdleTime = programs.reduce((sum, p) => sum + p.idleTimeSeconds, 0);
    const totalEmergencyTime = programs.reduce((sum, p) => sum + p.emergencyTimeSeconds, 0);
    const totalTime = totalWorkTime + totalIdleTime + totalEmergencyTime;
    
    return {
      totalWorkTime,
      totalIdleTime,
      totalEmergencyTime,
      totalPrograms: programs.length,
      efficiency: totalTime > 0 ? (totalWorkTime / totalTime) * 100 : 0,
    };
  }
}

export const storage = new MemStorage();
