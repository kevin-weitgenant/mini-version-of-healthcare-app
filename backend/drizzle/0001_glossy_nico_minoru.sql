ALTER TABLE "treatment_plans" ALTER COLUMN "lifestyleAdvice" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "treatment_plans" ALTER COLUMN "lifestyleAdvice" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "treatment_plans" ADD COLUMN "diagnosisName" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "treatment_plans" ADD COLUMN "diagnosisDescription" text NOT NULL;--> statement-breakpoint
ALTER TABLE "treatment_plans" ADD COLUMN "medicines" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "treatment_plans" ADD COLUMN "doctorNotes" text NOT NULL;--> statement-breakpoint
ALTER TABLE "treatment_plans" DROP COLUMN "diagnosis";--> statement-breakpoint
ALTER TABLE "treatment_plans" DROP COLUMN "recommendedMedicines";