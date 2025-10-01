-- Rename the old column to a temporary name
ALTER TABLE "Note" RENAME COLUMN "content" TO "temp_content";

-- Add the new column with the correct JSON type
ALTER TABLE "Note" ADD COLUMN "content" JSONB;

-- Set a default value for null content. Use an empty JSON array for Slate content.
UPDATE "Note" SET "temp_content" = '[]' WHERE "temp_content" IS NULL;

-- Update the new column with data from the old one, casting it as JSONB
UPDATE "Note" SET "content" = "temp_content"::jsonb;

-- Make the new column non-nullable
ALTER TABLE "Note" ALTER COLUMN "content" SET NOT NULL;

-- Drop the old temporary column
ALTER TABLE "Note" DROP COLUMN "temp_content";