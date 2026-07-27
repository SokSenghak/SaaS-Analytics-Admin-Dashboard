-- ==========================================
-- LUMAORA SAAS PLATFORM DATABASE SCHEMA
-- PostgreSQL Initial Configuration & Seed Scripts
-- Target: Cloud SQL / Standard PostgreSQL
-- ==========================================

-- Enable any modern PostgreSQL extensions if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------
-- 1. SYSTEM METRICS TABLE
-- ------------------------------------------
-- Tracks real-time telemetry variables shown on the core dashboard widgets
CREATE TABLE IF NOT EXISTS system_metrics (
    id SERIAL PRIMARY KEY,
    mrr NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    mrr_growth NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    active_users INTEGER NOT NULL DEFAULT 0,
    active_users_growth NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    api_latency INTEGER NOT NULL DEFAULT 0, -- In milliseconds
    api_latency_growth NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    system_health NUMERIC(5, 2) NOT NULL DEFAULT 100.00, -- Percentage
    system_health_status VARCHAR(50) NOT NULL DEFAULT 'Optimal',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE system_metrics IS 'Stores global real-time SaaS diagnostic performance KPIs and MRR details.';

-- ------------------------------------------
-- 2. USER ACCOUNTS (CUSTOMER TENANTS)
-- ------------------------------------------
-- Tracks registered tenant users, current access tiers, and API request usage
CREATE TABLE IF NOT EXISTS user_accounts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    company VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    request_count INTEGER NOT NULL DEFAULT 0,
    growth NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended', 'Pending')),
    tier VARCHAR(20) NOT NULL DEFAULT 'Free' CHECK (tier IN ('Enterprise', 'Pro', 'Free')),
    role VARCHAR(50) NOT NULL DEFAULT 'Developer Operator',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_accounts_status ON user_accounts(status);
CREATE INDEX IF NOT EXISTS idx_user_accounts_tier ON user_accounts(tier);

COMMENT ON TABLE user_accounts IS 'Holds customer records, tenant subscription plans, and API ingestion rate counters.';

-- ------------------------------------------
-- 3. ADMINISTRATIVE ACTIVITY LOGS
-- ------------------------------------------
-- Stores a secure, read-only log of modifications to tenants or configurations
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES user_accounts(id) ON DELETE SET NULL,
    user_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    details TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Upgraded', 'API Reset', 'Suspended', 'Success', 'Warning')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_status ON activity_logs(status);

COMMENT ON TABLE activity_logs IS 'Immutable security trail monitoring administrative interventions and subscription upgrades.';

-- ------------------------------------------
-- 4. API CREDENTIALS MANAGEMENT
-- ------------------------------------------
-- Manages high-security access keys, usage telemetry, and status
CREATE TABLE IF NOT EXISTS api_keys (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    token_hash VARCHAR(255) NOT NULL, -- SHA-256 Hash of secret key
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Revoked')),
    scope VARCHAR(30) NOT NULL DEFAULT 'Read-Only' CHECK (scope IN ('Read-Only', 'Admin', 'Full-Access')),
    usage_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(status);
CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON api_keys(key_prefix);

COMMENT ON TABLE api_keys IS 'SaaS API credentials containing permissions scopes, key-masks, and request telemetry.';

-- ------------------------------------------
-- 5. WEBHOOK GATEWAY SUBSCRIPTIONS
-- ------------------------------------------
-- Configures endpoints subscribing to system state alerts
CREATE TABLE IF NOT EXISTS webhooks (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    events VARCHAR(50)[] NOT NULL, -- Array of subscription keys (e.g. user.created)
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    last_delivery TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE webhooks IS 'Maintains active outbound webhook targets, event subscriptions, and transaction logs.';

-- ------------------------------------------
-- 6. SYSTEM SCHEDULER & CRON JOBS
-- ------------------------------------------
-- System maintenance cron configurations
CREATE TABLE IF NOT EXISTS scheduled_jobs (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    schedule VARCHAR(50) NOT NULL, -- Cron syntax e.g., '*/15 * * * *'
    last_run TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Success', 'Running', 'Failed', 'Scheduled')),
    duration VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE scheduled_jobs IS 'Stores background tasks schedules and diagnostic execution runtimes.';

-- ------------------------------------------
-- 7. TELEMETRY GEOLOCATION REGIONS
-- ------------------------------------------
-- Maps worldwide edge deployments and localized connection bandwidths
CREATE TABLE IF NOT EXISTS telemetry_regions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    coordinates JSONB NOT NULL, -- Coordinate map objects {x: float, y: float}
    latency INTEGER NOT NULL DEFAULT 0, -- ms
    load NUMERIC(5, 2) NOT NULL DEFAULT 0.00, -- Percentage
    connections INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'Healthy' CHECK (status IN ('Healthy', 'Degraded', 'Critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE telemetry_regions IS 'Tracks global content delivery nodes, active socket loads, and latency health.';

-- ------------------------------------------
-- 8. PRODUCT CATALOG TABLE
-- ------------------------------------------
-- Represents the inventory of physical goods or licensing objects
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sold INTEGER NOT NULL DEFAULT 0,
    growth NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    stock INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(50) NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

COMMENT ON TABLE products IS 'Houses items list in catalog, pricing values, and active inventory level indicators.';

-- ------------------------------------------
-- 9. INCOMING CUSTOMER ORDERS
-- ------------------------------------------
-- Tracks order statuses, totals, and fulfillment pipelines
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    avatar TEXT,
    items VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Delivered', 'Shipped', 'Processing', 'Cancelled')),
    date VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

COMMENT ON TABLE orders IS 'Customer orders, including payment metrics, logistics phases, and processing records.';

-- ------------------------------------------
-- 10. MARKETING CAMPAIGNS
-- ------------------------------------------
-- Evaluates performance of outbound ad-spend structures
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g. Email, Instagram, Influencer
    budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    revenue NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ctr VARCHAR(10) NOT NULL DEFAULT '-', -- Click Through Rate
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Scheduled', 'Ended')),
    date VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE campaigns IS 'Outbound campaigns telemetry tracker to analyze ROI and consumer acquisition budgets.';

-- ------------------------------------------
-- 11. DISCOUNT CODES & COUPONS
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS discounts (
    code VARCHAR(50) PRIMARY KEY,
    discount VARCHAR(50) NOT NULL, -- e.g. '25% OFF', 'Free Shipping'
    type VARCHAR(50) NOT NULL CHECK (type IN ('Percentage', 'Fixed Amount', 'Free Shipping')),
    usage INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE discounts IS 'Saves active marketing discount voucher codes and usage analytics.';

-- ------------------------------------------
-- 12. CENTRAL COMMUNICATIONS INBOX
-- ------------------------------------------
-- Integrated client tickets and internal feedback messages
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(50) PRIMARY KEY,
    sender VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    preview TEXT,
    body TEXT,
    date VARCHAR(50),
    unread BOOLEAN DEFAULT TRUE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Support', 'Order Issue', 'Marketing', 'General')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(unread);
CREATE INDEX IF NOT EXISTS idx_messages_category ON messages(category);

COMMENT ON TABLE messages IS 'Stores support inquiries, resolution requests, and marketing communications.';

-- ------------------------------------------
-- 13. ADMINISTRATIVE ACCESS ROLES
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    role VARCHAR(50) PRIMARY KEY,
    description TEXT NOT NULL,
    caps VARCHAR(50)[] NOT NULL -- List of granular administrative privileges
);

COMMENT ON TABLE roles IS 'Stores role metadata alongside authorization capabilities for platform access control.';


-- ==========================================
-- SEED DATA INITIALIZATION
-- Pre-populates tables with default UI-state
-- ==========================================

-- Seed metrics (MRR, active nodes, latencies, status)
INSERT INTO system_metrics (mrr, mrr_growth, active_users, active_users_growth, api_latency, api_latency_growth, system_health, system_health_status)
VALUES (86492.00, 18.40, 542, 22.60, 48, -12.40, 99.98, 'Optimal');

-- Seed tenant accounts
INSERT INTO user_accounts (id, name, email, company, avatar_url, request_count, growth, status, tier, role)
VALUES 
('usr-1', 'Sarah Jenkins', 'sjenkins@cyberdyne.co', 'Cyberdyne Systems', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 2840128, 18.4, 'Active', 'Enterprise', 'Lead Admin'),
('usr-2', 'David Miller', 'david.miller@krypton.io', 'Krypton Labs', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 1928410, 11.2, 'Active', 'Enterprise', 'Security Auditor'),
('usr-3', 'Chloe Tanaka', 'tanaka@nakamoto.org', 'Nakamoto Lab', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', 1120340, 22.6, 'Active', 'Pro', 'Developer Operator'),
('usr-4', 'Marcus Vance', 'marcus@tyrell.corp', 'Tyrell Corp', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 870400, 2.4, 'Active', 'Pro', 'Billing Controller');

-- Seed actions security trail
INSERT INTO activity_logs (id, user_id, user_name, avatar_url, action, details, status)
VALUES 
('act-1', 'usr-1', 'Sarah Jenkins', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 'Access Tier Upgraded', 'Cyberdyne Systems promoted to Enterprise node tier', 'Upgraded'),
('act-2', 'usr-3', 'Chloe Tanaka', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', 'API Token Rotated', 'Regenerated primary client authorization prefix live-tok-*', 'API Reset'),
('act-3', 'usr-4', 'Marcus Vance', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 'Configuration Save', 'Successfully published new microservice configuration', 'Success');

-- Seed API credentials
INSERT INTO api_keys (id, name, key_prefix, token_hash, status, scope, usage_count)
VALUES 
('key-1', 'Main Production Key', 'live_pk_8f1s', 'df56a89c90b0e56721ef9a8b8c2d2e1aef9a8b8c2d2e1aef9a8b8c2d2e1aa467', 'Active', 'Full-Access', 1420800),
('key-2', 'Stripe Webhook Gateway', 'live_pk_2k9l', '8f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a', 'Active', 'Admin', 894300),
('key-3', 'Analytic Integration Hub', 'live_pk_3n1q', '2e1aef9a8b8c2d2e1aef9a8b8c2d2e1aef9a8b8c2d2e1aef9a8b8c2d2e1aa467', 'Revoked', 'Read-Only', 12300);

-- Seed webhooks integration
INSERT INTO webhooks (id, name, url, events, status, last_delivery)
VALUES 
('wh-1', 'Salesforce Synchronization Pipeline', 'https://api.salesforce.com/v2/webhooks/lumaora', ARRAY['user.created', 'user.deleted', 'billing.succeeded'], 'Active', CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
('wh-2', 'Slack DevOps Alarm Channel', '', ARRAY['system.alert', 'security.breach'], 'Active', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
('wh-3', 'Segment Ingestion Stream', 'https://api.segment.io/v1/projects/lumaora/webhooks', ARRAY['*'], 'Inactive', NULL);

-- Seed cron maintenance tasks
INSERT INTO scheduled_jobs (id, name, schedule, status, duration, last_run)
VALUES 
('job-1', 'Telemetry Buffer Pruning', '*/5 * * * *', 'Success', '1.4s', CURRENT_TIMESTAMP - INTERVAL '3 minutes'),
('job-2', 'Stripe Financial Ledger Reconciliation', '0 0 * * *', 'Scheduled', '24.8s', CURRENT_TIMESTAMP - INTERVAL '23 hours'),
('job-3', 'Security Certificate SSL Checks', '0 12 * * *', 'Success', '4.2s', CURRENT_TIMESTAMP - INTERVAL '11 hours');

-- Seed coordinates and properties for live network nodes
INSERT INTO telemetry_regions (id, name, coordinates, latency, load, connections, status)
VALUES 
('reg-1', 'North America (East)', '{"x": 26, "y": 38}', 34, 45.2, 14820, 'Healthy'),
('reg-2', 'Western Europe (Ireland)', '{"x": 48, "y": 28}', 42, 62.8, 12050, 'Healthy'),
('reg-3', 'East Asia (Tokyo)', '{"x": 86, "y": 42}', 89, 78.4, 18450, 'Healthy'),
('reg-4', 'South America (Sao Paulo)', '{"x": 36, "y": 72}', 124, 91.5, 5210, 'Degraded'),
('reg-5', 'Australia East (Sydney)', '{"x": 92, "y": 78}', 165, 96.2, 4120, 'Critical');

-- Seed products inventory
INSERT INTO products (id, name, price, sold, growth, stock, category, image)
VALUES 
('prod-1', 'Minimal Table Lamp', 129.00, 1284, 24.00, 45, 'Lighting', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=150&q=80'),
('prod-2', 'Ceramic Vase', 79.00, 1120, 18.00, 12, 'Decor', 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=150&q=80'),
('prod-3', 'Nordic Lounge Chair', 249.00, 980, 16.00, 5, 'Furniture', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=150&q=80'),
('prod-4', 'Linen Cushion Set', 159.00, 870, 12.00, 84, 'Textiles', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=150&q=80');

-- Seed orders list
INSERT INTO orders (id, name, avatar, items, price, status, date)
VALUES 
('ord-1248', 'Sophia Miller', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', '2 items', 129.00, 'Delivered', 'Today, 11:24 AM'),
('ord-1247', 'James Carter', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', '1 item', 79.00, 'Shipped', 'Today, 09:15 AM'),
('ord-1246', 'Olivia Brown', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', '3 items', 249.00, 'Processing', 'Yesterday'),
('ord-1245', 'Daniel Wilson', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', '2 items', 159.00, 'Delivered', 'Yesterday');

-- Seed marketing campaigns
INSERT INTO campaigns (id, name, type, budget, revenue, ctr, status, date)
VALUES 
('camp-1', 'Summer Glow Sale', 'Email Campaign', 1200.00, 14200.00, '4.8%', 'Active', 'Starts 05 July'),
('camp-2', 'Social Media Push', 'Instagram Ads', 800.00, 5600.00, '3.2%', 'Active', 'Ongoing'),
('camp-3', 'Holiday Special Deals', 'Influencer Collab', 2500.00, 0.00, '-', 'Scheduled', 'Scheduled Dec 1');

-- Seed discounts coupons
INSERT INTO discounts (code, discount, type, usage, status)
VALUES 
('SUMMERGLOW25', '25% OFF', 'Percentage', 148, 'Active'),
('WELCOME10', '10% OFF', 'Percentage', 310, 'Active'),
('LUMAORAPRO', 'Free Shipping', 'Free Shipping', 42, 'Active');

-- Seed inbox support tickets
INSERT INTO messages (id, sender, subject, preview, body, date, unread, category)
VALUES 
('msg-1', 'Sophia Miller', 'Inquiry about Minimal Table Lamp stock', 'Hi Lumaora support, I wanted to buy 5 table lamps but noticed only...', 'Hi Lumaora support,\n\nI wanted to buy 5 of the Minimal Table Lamps for a dining room redecoration project, but noticed that there are only 4 remaining in stock. When will you be restocking this item? I would love to place a bulk order as soon as they are available.\n\nBest,\nSophia Miller', '10:42 AM', TRUE, 'Support'),
('msg-2', 'James Carter', 'Shipping address correction', 'Hello, I just placed order #1247. I made a typo in my ZIP code...', 'Hello,\n\nI just placed order #1247. I noticed that I made a typo in my shipping ZIP code (should be 90210 instead of 90211). Could you please correct this before the package ships out today?\n\nThank you,\nJames', 'Yesterday', FALSE, 'Order Issue'),
('msg-3', 'Olivia Brown', 'Collaboration proposal', 'Hello marketing team! I am an interior design influencer with...', 'Hello marketing team!\n\nI am an interior design influencer with 120k followers on Instagram. I absolutely love your home decor catalog and would be thrilled to discuss a potential partnership or sponsor opportunity for my upcoming living room makeover video series.\n\nLet me know if we can set up a short call!\n\nOlivia', '2 days ago', FALSE, 'Marketing');

-- Seed role configurations
INSERT INTO roles (role, description, caps)
VALUES 
('Lead Admin', 'Full core systems deployment and master key access', ARRAY['node.write', 'keys.grant', 'users.modify', 'billing.read']),
('Security Auditor', 'Inspects real-time auth patterns and active tokens', ARRAY['keys.grant', 'users.modify']),
('Developer Operator', 'Can adjust microservices scaling and telemetry POPs', ARRAY['node.write', 'billing.read']),
('Billing Controller', 'MRR ledger monitoring and stripe integration audits', ARRAY['billing.read']);
