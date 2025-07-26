require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const multas = await prisma.multa.findMany();
  console.log('Usuarios encontrados:', multas);
}

main()
  .catch(e => {
    console.error('Error al conectar con Supabase/Prisma:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });