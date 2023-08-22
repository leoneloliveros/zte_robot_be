import { PrismaClient } from '@prisma/client';
import { data } from './data.js';
const prisma = new PrismaClient()

async function main() {
  data.forEach(async (olt) => {
    const oltData = await prisma.olt.upsert({
      where: { name: olt.name },
      update: {},
      create: {
        name: olt.name,
        ipAddress: olt.ipAddress,
        status: olt.status,
      },
    })
    console.log({ oltData })
  })
  console.log('🚀 ~ file: seed.js ~ line 127 ~ main ~ data')
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