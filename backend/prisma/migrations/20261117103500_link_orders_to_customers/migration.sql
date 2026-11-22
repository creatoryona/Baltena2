-- AlterTable
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerId" INTEGER;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Order_customerId_fkey'
    ) THEN
        ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" 
        FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

