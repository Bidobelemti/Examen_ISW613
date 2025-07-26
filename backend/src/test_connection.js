require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ejemplares = await prisma.ejemplar.findMany();
  console.log('Usuarios encontrados:', ejemplares);
}

main()
  .catch(e => {
    console.error('Error al conectar con Supabase/Prisma:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });