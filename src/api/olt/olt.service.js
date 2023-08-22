import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function getAllOlt() {
  const olts = await prisma.olt.findMany({
    select: {
      id: true,
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

export async function getOlt(where) {

  const olt = await prisma.olt.findUnique({
    where,
  });

  return olt;
}

export async function deleteOlt(where) {
  const olt = await prisma.olt.delete({
    where,
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