ALTER TABLE "datasets" ADD COLUMN "status" text DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "datasets" ADD COLUMN "verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "datasets" ADD CONSTRAINT "uniqueSellerTitle" UNIQUE("seller_id","title");