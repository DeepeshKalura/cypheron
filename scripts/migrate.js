const { neon } = require("@neondatabase/serverless")
const { drizzle } = require("drizzle-orm/neon-http")

const schema = require("../lib/schema")

async function migrate() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required")
  }

  console.log("Starting migration...")

  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql)

  try {
    // Create enums
    await sql`CREATE TYPE user_role AS ENUM ('BUYER', 'SELLER', 'ADMIN')`
    await sql`CREATE TYPE kyc_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED')`
    await sql`CREATE TYPE contract_status AS ENUM ('DEPLOYED', 'FAILED')`
    await sql`CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED')`

    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        wallet_address TEXT UNIQUE,
        avatar_url TEXT,
        bio TEXT,
        role user_role DEFAULT 'BUYER',
        kyc_status kyc_status DEFAULT 'PENDING',
        reputation_score INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS auth_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        provider TEXT NOT NULL,
        provider_account_id TEXT NOT NULL,
        email TEXT,
        name TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS smart_contracts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        contract_address TEXT UNIQUE,
        contract_name TEXT NOT NULL,
        contract_type TEXT DEFAULT 'STANDARD',
        status contract_status DEFAULT 'FAILED',
        tx_hash TEXT,
        deployment_metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS datasets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        file_hash TEXT NOT NULL,
        file_size INTEGER,
        price NUMERIC(18, 6) NOT NULL,
        zk_proof_hash TEXT,
        category TEXT,
        tags TEXT[],
        is_fraudulent BOOLEAN DEFAULT FALSE,
        fraud_reason TEXT,
        view_count INTEGER DEFAULT 0,
        purchase_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
        amount NUMERIC(18, 6) NOT NULL,
        tx_hash TEXT UNIQUE,
        status transaction_status DEFAULT 'PENDING',
        decryption_key TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS api_keys (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        key_hash TEXT NOT NULL,
        last_used_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        changes JSONB,
        reason TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    console.log("✅ Migration completed successfully!")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

migrate()
