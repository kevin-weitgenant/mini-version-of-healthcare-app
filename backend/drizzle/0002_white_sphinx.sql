-- Add timezone column to users table
ALTER TABLE "users" ADD COLUMN "timezone" varchar(50) DEFAULT 'UTC' NOT NULL;

-- Add new timezone-aware columns to appointments table
ALTER TABLE "appointments" ADD COLUMN "appointmentDateTime" timestamp with time zone;
ALTER TABLE "appointments" ADD COLUMN "timezone" varchar(50);

-- Migrate existing data: convert date + time to UTC timestamp
-- This assumes existing appointments are in UTC (we'll update this later)
UPDATE "appointments" 
SET 
  "appointmentDateTime" = ("appointmentDate" + "appointmentTime")::timestamp with time zone,
  "timezone" = 'UTC'
WHERE "appointmentDateTime" IS NULL;

-- Make new columns NOT NULL after data migration
ALTER TABLE "appointments" ALTER COLUMN "appointmentDateTime" SET NOT NULL;
ALTER TABLE "appointments" ALTER COLUMN "timezone" SET NOT NULL;

-- Make legacy columns nullable (we'll remove them later)
ALTER TABLE "appointments" ALTER COLUMN "appointmentDate" DROP NOT NULL;
ALTER TABLE "appointments" ALTER COLUMN "appointmentTime" DROP NOT NULL;