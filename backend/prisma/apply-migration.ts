import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function applyMigration() {
  console.log("Checking and applying missing columns to database...")
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerId" INTEGER;
    `)
    console.log("Successfully ensured customerId column exists on Order table.")

    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'Order_customerId_fkey'
        ) THEN
          ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" 
          FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        END IF;
      END $$;
    `)
    console.log("Successfully ensured foreign key relationship exists.")
  } catch (err) {
    console.error("Migration error:", err)
  } finally {
    await prisma.$disconnect()
  }
}

applyMigration()

