export type DashboardPeriod = "Daily" | "Weekly" | "Monthly";

export interface LeatherTypeCount {
  leatherTypeName: string;
  inboundCount: number;
  totalSkins?: number;
}

export interface CitesSummary {
  totalInbounds: number;
  totalSkins: number;
  inboundsInPeriod: number;
  skinsInPeriod: number;
  leatherTypes?: LeatherTypeCount[];
  topLeatherTypes?: LeatherTypeCount[];
}

export interface ProductionsSummary {
  total: number;
  inProgress: number;
  paused: number;
  completed: number;
  stockProductions: number;
  soldProductions: number;
  inStock: number;
  sold: number;
  startedInPeriod: number;
  completedInPeriod: number;
  hoursInPeriod: number;
}

export interface CraftsmanSummary {
  craftsmanId: number;
  fullName: string;
  totalProductions: number;
  totalHours: number;
  productionsInPeriod: number;
  hoursInPeriod: number;
  currentlyInProgress: number;
}

export interface DashboardData {
  period: DashboardPeriod;
  fromDate: string;
  toDate: string;
  cites: CitesSummary;
  productions: ProductionsSummary;
  craftsmen: CraftsmanSummary[];
}
