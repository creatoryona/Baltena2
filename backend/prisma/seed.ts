import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding Baltena Market products...")

  // 1. Create or find category
  const category = await prisma.category.upsert({
    where: { slug: "baltena-products" },
    update: { name: "ባልትና ውጤቶች" },
    create: {
      name: "ባልትና ውጤቶች",
      slug: "baltena-products",
    },
  })

  console.log(`Category ready: ${category.name} (${category.slug})`)

  const productsData = [
    {
      name: "በርበሬ (Berbere)",
      slug: "berbere",
      description: "Authentic, freshly ground Ethiopian spiced red pepper blend for wot and traditional cooking.",
      variants: [
        { size: "250g", price: 85.00, stock: 50 },
        { size: "500g", price: 155.00, stock: 40 },
        { size: "1kg", price: 290.00, stock: 25 },
      ],
    },
    {
      name: "ንጥር ቅቤ (Nitir Kibbeh)",
      slug: "nitir-kibbeh",
      description: "Traditional clarified butter infused with kosseret, tikur azmud, and aromatic spices.",
      variants: [
        { size: "250g", price: 120.00, stock: 30 },
        { size: "500g", price: 220.00, stock: 25 },
        { size: "1kg", price: 400.00, stock: 15 },
      ],
    },
    {
      name: "ሽሮ (Shiro Powder)",
      slug: "shiro-powder",
      description: "Carefully roasted and seasoned chickpea and split pea flour for rich shiro tegamino.",
      variants: [
        { size: "500g", price: 75.00, stock: 60 },
        { size: "1kg", price: 140.00, stock: 45 },
        { size: "2kg", price: 260.00, stock: 20 },
      ],
    },
    {
      name: "ምቱ ቅቤ (Fresh Traditional Butter)",
      slug: "mitu-qibe",
      description: "Fresh, unclarified traditional Ethiopian homestyle dairy butter.",
      variants: [
        { size: "250g", price: 110.00, stock: 20 },
        { size: "500g", price: 200.00, stock: 15 },
      ],
    },
    {
      name: "ቁንዶ በርበሬ (Qundo Berbere - Mild)",
      slug: "qundo-berbere",
      description: "Mild, fragrant spice blend with reduced heat, perfect for delicate dishes.",
      variants: [
        { size: "250g", price: 80.00, stock: 35 },
        { size: "500g", price: 145.00, stock: 25 },
        { size: "1kg", price: 270.00, stock: 10 },
      ],
    },
    {
      name: "ቡሎ / ቢሶ (Bulo Roasted Barley)",
      slug: "bulo-roasted-barley",
      description: "Finely ground roasted highland barley flour for nourishing breakfast drinks and porridge.",
      variants: [
        { size: "500g", price: 55.00, stock: 50 },
        { size: "1kg", price: 100.00, stock: 40 },
        { size: "2kg", price: 185.00, stock: 20 },
      ],
    },
    {
      name: "ምስር (Red Lentils / Misir)",
      slug: "misir-red-lentils",
      description: "Select grade cleaned red split lentils for misir wot.",
      variants: [
        { size: "500g", price: 60.00, stock: 70 },
        { size: "1kg", price: 110.00, stock: 55 },
        { size: "2kg", price: 200.00, stock: 30 },
      ],
    },
    {
      name: "ቅቤ ሽሮ (Kibbeh Shiro)",
      slug: "kibbeh-shiro",
      description: "Premium sun-dried shiro specially prepared with nitir kibbeh seasonings.",
      variants: [
        { size: "500g", price: 100.00, stock: 25 },
        { size: "1kg", price: 185.00, stock: 20 },
      ],
    },
  ]

  for (const item of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        categoryId: category.id,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        categoryId: category.id,
      },
    })

    // Upsert variants
    for (const v of item.variants) {
      const existing = await prisma.productVariant.findFirst({
        where: {
          productId: product.id,
          size: v.size,
        },
      })

      if (existing) {
        await prisma.productVariant.update({
          where: { id: existing.id },
          data: { price: v.price, stock: v.stock },
        })
      } else {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            size: v.size,
            price: v.price,
            stock: v.stock,
          },
        })
      }
    }

    console.log(`Product seeded: ${product.name} (${item.variants.length} variants)`)
  }

  console.log("Seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

