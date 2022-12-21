import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const {name, email}=req.body
  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })