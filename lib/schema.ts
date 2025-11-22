import { pgTable, text, timestamp, uuid, integer, decimal, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Enum for user roles
export const userRoleEnum = pgEnum("user_role", ["BUYER", "SELLER", "BOTH", "ADMIN"])

// Enum for KYC status
export const kycStatusEnum = pgEnum("kyc_status", ["PENDING", "VERIFIED", "REJECTED"])

// Enum for contract status
export const contractStatusEnum = pgEnum("contract_status", ["DEPLOYED", "FAILED"])

// Enum for transaction status
export const transactionStatusEnum = pgEnum("transaction_status", ["PENDING", "COMPLETED", "FAILED"])

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  walletAddress: text("wallet_address").unique(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  role: userRoleEnum("role").default("BUYER"),
  kycStatus: kycStatusEnum("kyc_status").default("PENDING"),
  reputationScore: integer("reputation_score").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Auth Accounts table (for OAuth and wallet connections)
export const authAccounts = pgTable("auth_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(), // GOOGLE, WALLET_SUI
  providerAccountId: text("provider_account_id").notNull(),
  email: text("email"),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Smart Contracts table
export const smartContracts = pgTable("smart_contracts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  contractAddress: text("contract_address").unique(),
  contractName: text("contract_name").notNull(),
  contractType: text("contract_type").default("STANDARD"),
  status: contractStatusEnum("status").default("FAILED"),
  txHash: text("tx_hash"),
  deploymentMetadata: jsonb("deployment_metadata"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Datasets table
export const datasets = pgTable("datasets", {
  id: uuid("id").primaryKey().defaultRandom(),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  fileHash: text("file_hash").notNull(),
  fileSize: integer("file_size"),
  price: decimal("price", { precision: 18, scale: 6 }).notNull(),
  zkProofHash: text("zk_proof_hash"),
  category: text("category"),
  tags: text("tags").array(),
  status: text("status").default("active"), // "active" or "draft"
  verified: boolean("verified").default(false),
  isFraudulent: boolean("is_fraudulent").default(false),
  fraudReason: text("fraud_reason"),
  viewCount: integer("view_count").default(0),
  purchaseCount: integer("purchase_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Transactions table
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  datasetId: uuid("dataset_id")
    .notNull()
    .references(() => datasets.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 18, scale: 6 }).notNull(),
  txHash: text("tx_hash").unique(),
  status: transactionStatusEnum("status").default("PENDING"),
  decryptionKey: text("decryption_key"),
  createdAt: timestamp("created_at").defaultNow(),
})

// API Keys table
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  keyHash: text("key_hash").notNull(),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Admin audit logs
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  changes: jsonb("changes"),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  authAccounts: many(authAccounts),
  smartContracts: many(smartContracts),
  datasets: many(datasets, { relationName: "seller" }),
  buyTransactions: many(transactions, { relationName: "buyer" }),
  sellTransactions: many(transactions, { relationName: "seller" }),
  apiKeys: many(apiKeys),
}))

export const authAccountsRelations = relations(authAccounts, ({ one }) => ({
  user: one(users, {
    fields: [authAccounts.userId],
    references: [users.id],
  }),
}))

export const smartContractsRelations = relations(smartContracts, ({ one }) => ({
  user: one(users, {
    fields: [smartContracts.userId],
    references: [users.id],
  }),
}))

export const datasetsRelations = relations(datasets, ({ one, many }) => ({
  seller: one(users, {
    fields: [datasets.sellerId],
    references: [users.id],
    relationName: "seller",
  }),
  transactions: many(transactions),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
  buyer: one(users, {
    fields: [transactions.buyerId],
    references: [users.id],
    relationName: "buyer",
  }),
  seller: one(users, {
    fields: [transactions.sellerId],
    references: [users.id],
    relationName: "seller",
  }),
  dataset: one(datasets, {
    fields: [transactions.datasetId],
    references: [datasets.id],
  }),
}))

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}))
