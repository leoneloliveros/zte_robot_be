import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function getAllOlt() {
  const olts = await prisma.olt.findMany({
    select: {
      id: false,
      name: true,
      ipAddress: true,
      status: true,
    }
  });
  return olts;
}

export async function createOlt(data) {
  const olt = await prisma.olt.create({
    data
  });

  return olt;
}

export async function getOltByName(name) {

  const olt = await prisma.olt.findUnique({
    where: {
      name
    }
  });

  return olt;
}

export async function deleteOlt(name) {
  const olt = await prisma.olt.delete({
    where: {
      name,
    },
  });

  return olt;
}

export async function updateOlt(data) {
  const olt = await prisma.olt.update({
    where: {
      name: data.name,
    },
    data,
  });

  return olt;
}