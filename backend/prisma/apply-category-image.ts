import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function applyCategoryMigration() {
  console.log("Adding image column to Category table if not exists...")
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "image" TEXT;
    `)
    console.log("Successfully ensured image column exists on Category table.")
  } catch (err) {
    console.error("Migration error:", err)
  } finally {
    await prisma.$disconnect()
  }
}

applyCategoryMigration()

