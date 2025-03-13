import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create a default user for the system
  const defaultUser = await prisma.user.upsert({
    where: { email: "system@poetry.network" },
    update: {},
    create: {
      email: "system@poetry.network",
      name: "System",
      password: "not-used",
    },
  })

  // Create a default workshop for comments
  const defaultWorkshop = await prisma.workshop.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      title: "Default Workshop",
      description: "Default workshop for system use",
      isPrivate: true,
      hostId: defaultUser.id,
    },
  })

  console.log({ defaultUser, defaultWorkshop })
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