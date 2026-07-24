export interface UserAccount {
  id: string;
  name: string;
  email: string;
  company: string;
  avatarUrl: string;
  requestCount: number;
  growth: number;
  status: 'Active' | 'Suspended' | 'Pending';
  tier: 'Enterprise' | 'Pro' | 'Free';
  role: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  avatarUrl: string;
  action: string;
  details: string;
  timestamp: string;
  status: 'Upgraded' | 'API Reset' | 'Suspended' | 'Success' | 'Warning';
}

export interface APIKey {
  id: string;
  name: string;
  keyPrefix: string;
  created: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
  scope: 'Read-Only' | 'Admin' | 'Full-Access';
  usageCount: number;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'Active' | 'Inactive';
  lastDelivery: string;
}

export interface ScheduledJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  status: 'Success' | 'Running' | 'Failed' | 'Scheduled';
  duration: string;
}

export interface TelemetryRegion {
  id: string;
  name: string;
  coordinates: { x: number; y: number }; // Percentage position on custom world map
  latency: number;
  load: number;
  connections: number;
  status: 'Healthy' | 'Degraded' | 'Critical';
}

export interface SystemMetrics {
  mrr: number;
  mrrGrowth: number;
  activeUsers: number;
  activeUsersGrowth: number;
  apiLatency: number;
  apiLatencyGrowth: number;
  systemHealth: number;
  systemHealthStatus: string;
}
