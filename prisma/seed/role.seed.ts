import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const patient = await prisma.role.upsert({
    where: { code: "ROLE_PATIENT" }, // Ensure this field is unique in your schema
    update: {}, // Required, even if you don't need to update anything
    create: {
      name: "user",
      code: "ROLE_PATIENT",
      status: true
    },
  })

  const organisation = await prisma.role.upsert({
    where: { code: "ROLE_ORGANISATION" }, // Ensure this field is unique in your schema
    update: {}, // Required, even if you don't need to update anything
    create: {
      name: "organisation",
      code: "ROLE_ORGANISATION",
      status: true
    },
  })

  const branch = await prisma.role.upsert({
    where: { code: "ROLE_BRANCH" }, // Ensure this field is unique in your schema
    update: {}, // Required, even if you don't need to update anything
    create: {
      name: "branch",
      code: "ROLE_BRANCH",
      status: true
    },
  })

  const department = await prisma.role.upsert({
    where: { code: "ROLE_DEPARTMENT" }, // Ensure this field is unique in your schema
    update: {}, // Required, even if you don't need to update anything
    create: {
      name: "department",
      code: "ROLE_DEPARTMENT",
      status: true
    },
  })

  const doctor = await prisma.role.upsert({
    where: { code: "ROLE_DOCTOR" }, // Ensure this field is unique in your schema
    update: {}, // Required, even if you don't need to update anything
    create: {
      name: "doctor",
      code: "ROLE_DOCTOR",
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
