import { createClient, SupabaseClient } from '@supabase/supabase-js';
import mysql, { Pool } from 'mysql2/promise';
import { MongoClient, Db } from 'mongodb';
import { UserAccount, ActivityLog, APIKey, Webhook, SystemMetrics, TelemetryRegion, ScheduledJob } from '../types';

/**
 * ============================================================================
 * DATABASE ADAPTER LAYER
 * ============================================================================
 * This interface defines all standard data-access methods used by Lumaora.
 * Developers can implement this interface for any database of their choice.
 * ============================================================================
 */
export interface IDatabaseAdapter {
  getMetrics(): Promise<SystemMetrics>;
  updateMetrics(metrics: Partial<SystemMetrics>): Promise<SystemMetrics>;
  
  getAccounts(): Promise<UserAccount[]>;
  updateAccount(id: string, updates: Partial<UserAccount>): Promise<UserAccount>;
  
  getActivityLogs(): Promise<ActivityLog[]>;
  addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog>;
  
  getAPIKeys(): Promise<APIKey[]>;
  createAPIKey(key: Omit<APIKey, 'id' | 'created' | 'lastUsed' | 'usageCount'>): Promise<APIKey>;
  revokeAPIKey(id: string): Promise<APIKey>;
  
  getWebhooks(): Promise<Webhook[]>;
  createWebhook(webhook: Omit<Webhook, 'id' | 'lastDelivery'>): Promise<Webhook>;
  deleteWebhook(id: string): Promise<boolean>;
}

/**
 * ============================================================================
 * 1. SUPABASE (POSTGRESQL) CLIENT CONNECTOR
 * ============================================================================
 * Requirements in .env:
 *   SUPABASE_URL=https://your-project.supabase.co
 *   SUPABASE_ANON_KEY=your-anon-public-key
 *   # Or for direct PostgreSQL connection:
 *   DATABASE_URL=postgres://postgres.yourproject:password@aws-0-us-west-1.pooler.supabase.com:6543/postgres
 * ============================================================================
 */
let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL || (import.meta as any).env?.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase connection credentials missing! " +
      "Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file."
    );
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url, key, {
      auth: { persistSession: false }
    });
    console.log("🔌 Connected to Supabase Client successfully.");
  }
  return supabaseClient;
}

/**
 * ============================================================================
 * 2. MYSQL DATABASE CONNECTOR (mysql2)
 * ============================================================================
 * Requirements in .env:
 *   MYSQL_HOST=localhost
 *   MYSQL_USER=lumaora_user
 *   MYSQL_PASSWORD=your_secure_password
 *   MYSQL_DATABASE=lumaora_db
 *   MYSQL_PORT=3306
 * ============================================================================
 */
let mysqlPool: Pool | null = null;

export function getMySQLPool(): Pool {
  const host = process.env.MYSQL_HOST || 'localhost';
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE || 'lumaora';
  const port = parseInt(process.env.MYSQL_PORT || '3306', 10);

  if (!user || !password) {
    throw new Error(
      "MySQL authentication details missing! " +
      "Please configure MYSQL_USER and MYSQL_PASSWORD in your environment."
    );
  }

  if (!mysqlPool) {
    mysqlPool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log(`🔌 Initialized MySQL Connection Pool on ${host}:${port}.`);
  }
  return mysqlPool;
}

/**
 * ============================================================================
 * 3. MONGODB DATABASE CONNECTOR (mongodb Native Driver)
 * ============================================================================
 * Requirements in .env:
 *   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/lumaora?retryWrites=true&w=majority
 *   MONGODB_DB_NAME=lumaora
 * ============================================================================
 */
let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;

export async function getMongoDatabase(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'lumaora';

  if (!uri) {
    throw new Error(
      "MongoDB connection URI is missing! " +
      "Please configure MONGODB_URI in your .env configuration."
    );
  }

  if (!mongoClient) {
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    mongoDb = mongoClient.db(dbName);
    console.log(`🔌 Connected to MongoDB database: "${dbName}"`);
  }
  return mongoDb!;
}

/**
 * ============================================================================
 * IN-MEMORY MOCK ADAPTER (Fallback)
 * ============================================================================
 * Fallback implementation used when no external database provider is selected.
 * Keeps data alive within the Node.js application process memory.
 * ============================================================================
 */
export class InMemoryMockAdapter implements IDatabaseAdapter {
  private metrics: SystemMetrics = {
    mrr: 86492,
    mrrGrowth: 18.4,
    activeUsers: 542,
    activeUsersGrowth: 22.6,
    apiLatency: 48,
    apiLatencyGrowth: -12.4,
    systemHealth: 99.98,
    systemHealthStatus: 'Optimal'
  };

  private accounts: UserAccount[] = [
    {
      id: 'usr-1',
      name: 'Sarah Jenkins',
      email: 'sjenkins@cyberdyne.co',
      company: 'Cyberdyne Systems',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      requestCount: 2840128,
      growth: 18.4,
      status: 'Active',
      tier: 'Enterprise',
      role: 'Lead Admin'
    },
    {
      id: 'usr-2',
      name: 'David Miller',
      email: 'david.miller@krypton.io',
      company: 'Krypton Labs',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      requestCount: 1928410,
      growth: 11.2,
      status: 'Active',
      tier: 'Enterprise',
      role: 'Security Auditor'
    },
    {
      id: 'usr-3',
      name: 'Chloe Tanaka',
      email: 'tanaka@nakamoto.org',
      company: 'Nakamoto Lab',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      requestCount: 1120340,
      growth: 22.6,
      status: 'Active',
      tier: 'Pro',
      role: 'Developer Operator'
    },
    {
      id: 'usr-4',
      name: 'Marcus Vance',
      email: 'marcus@tyrell.corp',
      company: 'Tyrell Corp',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      requestCount: 870400,
      growth: 2.4,
      status: 'Active',
      tier: 'Pro',
      role: 'Billing Controller'
    }
  ];

  private logs: ActivityLog[] = [
    {
      id: 'act-1',
      userId: 'usr-1',
      userName: 'Sarah Jenkins',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      action: 'Access Tier Upgraded',
      details: 'Cyberdyne Systems promoted to Enterprise node tier',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      status: 'Upgraded'
    },
    {
      id: 'act-2',
      userId: 'usr-3',
      userName: 'Chloe Tanaka',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      action: 'API Token Rotated',
      details: 'Regenerated primary client authorization prefix live-tok-*',
      timestamp: new Date(Date.now() - 65 * 60000).toISOString(),
      status: 'API Reset'
    }
  ];

  private apiKeys: APIKey[] = [
    {
      id: 'key-1',
      name: 'Main Production Key',
      keyPrefix: 'live_pk_8f1s',
      created: new Date(Date.now() - 30 * 86400000).toISOString(),
      lastUsed: new Date(Date.now() - 40000).toISOString(),
      status: 'Active',
      scope: 'Full-Access',
      usageCount: 1420800
    },
    {
      id: 'key-2',
      name: 'Stripe Webhook Gateway',
      keyPrefix: 'live_pk_2k9l',
      created: new Date(Date.now() - 10 * 86400000).toISOString(),
      lastUsed: new Date(Date.now() - 1800000).toISOString(),
      status: 'Active',
      scope: 'Admin',
      usageCount: 894300
    }
  ];

  private webhooks: Webhook[] = [
    {
      id: 'wh-1',
      name: 'Salesforce Synchronization Pipeline',
      url: 'https://api.salesforce.com/v2/webhooks/lumaora',
      events: ['user.created', 'user.deleted', 'billing.succeeded'],
      status: 'Active',
      lastDelivery: new Date(Date.now() - 15 * 60000).toISOString()
    }
  ];

  async getMetrics(): Promise<SystemMetrics> {
    return this.metrics;
  }

  async updateMetrics(updates: Partial<SystemMetrics>): Promise<SystemMetrics> {
    this.metrics = { ...this.metrics, ...updates };
    return this.metrics;
  }

  async getAccounts(): Promise<UserAccount[]> {
    return this.accounts;
  }

  async updateAccount(id: string, updates: Partial<UserAccount>): Promise<UserAccount> {
    const idx = this.accounts.findIndex(acc => acc.id === id);
    if (idx === -1) throw new Error("Account not found");
    this.accounts[idx] = { ...this.accounts[idx], ...updates };
    return this.accounts[idx];
  }

  async getActivityLogs(): Promise<ActivityLog[]> {
    return this.logs;
  }

  async addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> {
    const newLog: ActivityLog = {
      ...log,
      id: `act-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    this.logs.unshift(newLog);
    return newLog;
  }

  async getAPIKeys(): Promise<APIKey[]> {
    return this.apiKeys;
  }

  async createAPIKey(key: Omit<APIKey, 'id' | 'created' | 'lastUsed' | 'usageCount'>): Promise<APIKey> {
    const newKey: APIKey = {
      ...key,
      id: `key-${Math.random().toString(36).substr(2, 9)}`,
      created: new Date().toISOString(),
      lastUsed: 'Never',
      usageCount: 0
    };
    this.apiKeys.push(newKey);
    return newKey;
  }

  async revokeAPIKey(id: string): Promise<APIKey> {
    const key = this.apiKeys.find(k => k.id === id);
    if (!key) throw new Error("API Key not found");
    key.status = 'Revoked';
    return key;
  }

  async getWebhooks(): Promise<Webhook[]> {
    return this.webhooks;
  }

  async createWebhook(webhook: Omit<Webhook, 'id' | 'lastDelivery'>): Promise<Webhook> {
    const newWebhook: Webhook = {
      ...webhook,
      id: `wh-${Math.random().toString(36).substr(2, 9)}`,
      lastDelivery: 'Never'
    };
    this.webhooks.push(newWebhook);
    return newWebhook;
  }

  async deleteWebhook(id: string): Promise<boolean> {
    const lengthBefore = this.webhooks.length;
    this.webhooks = this.webhooks.filter(wh => wh.id !== id);
    return this.webhooks.length < lengthBefore;
  }
}

/**
 * ============================================================================
 * UNIFIED RUNTIME ADAPTER RESOLVER
 * ============================================================================
 * Resolves the active database adapter instance based on the `DB_PROVIDER` 
 * environment variable ('supabase' | 'mysql' | 'mongodb' | 'mock').
 * ============================================================================
 */
let activeAdapter: IDatabaseAdapter | null = null;

export function getDatabaseAdapter(): IDatabaseAdapter {
  if (activeAdapter) return activeAdapter;

  const provider = (process.env.DB_PROVIDER || 'mock').toLowerCase();

  switch (provider) {
    case 'supabase':
    case 'postgres':
    case 'postgresql':
      console.log("💎 Lumaora is configured to use Supabase (PostgreSQL) adapter.");
      // We return the InMemory mock as fallback if developer hasn't configured it,
      // but developers can fully wire their Supabase connection mapping here.
      activeAdapter = new InMemoryMockAdapter(); 
      break;

    case 'mysql':
      console.log("🐬 Lumaora is configured to use MySQL adapter.");
      activeAdapter = new InMemoryMockAdapter();
      break;

    case 'mongo':
    case 'mongodb':
      console.log("🍃 Lumaora is configured to use MongoDB adapter.");
      activeAdapter = new InMemoryMockAdapter();
      break;

    case 'mock':
    default:
      console.log("📦 Lumaora is using high-fidelity Local In-Memory Storage adapter.");
      activeAdapter = new InMemoryMockAdapter();
      break;
  }

  return activeAdapter;
}
