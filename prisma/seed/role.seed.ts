import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const patient = await prisma.role.upsert({
    where: { code: "PATIENT" }, // Ensure this field is unique in your schema
    update: {}, // Required, even if you don't need to update anything
    create: {
      name: "user",
      code: "PATIENT",
      status: true
    },
  })

  const organisation = await prisma.role.upsert({
    where: { code: "ORGANISATION" }, // Ensure this field is unique in your schema
    update: {}, // Required, even if you don't need to update anything
    create: {
      name: "organisation",
      code: "ORGANISATION",
      status: true
    },
  })

  const branch = await prisma.role.upsert({
    where: { code: "BRANCH" }, // Ensure this field is unique in your schema
    update: {}, // Required, even if you don't need to update anything
    create: {
      name: "branch",
      code: "BRANCH",
      status: true
    },
  })

  const department = await prisma.role.upsert({
    where: { code: "DEPARTMENT" }, // Ensure this field is unique in your schema
    update: {}, // Required, even if you don't need to update anything
    create: {
      name: "department",
      code: "DEPARTMENT",
      status: true
    },
  })

  const doctor = await prisma.role.upsert({
    where: { code: "DOCTOR" }, // Ensure this field is unique in your schema
    update: {}, // Required, even if you don't need to update anything
    create: {
      name: "doctor",
      code: "DOCTOR",
      status: true
    },
  })
  
  console.log({ patient,organisation,branch,department,doctor })
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
