import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Crear usuarios
  const alumno = await prisma.usuario.create({
    data: {
      login: 'alumno1',
      password: '123456',
      nombre: 'Laura',
      apellido1: 'Gómez',
      apellido2: 'Sánchez',
      email: 'laura.alumno@example.com',
      calle: 'Calle Luna',
      numero: '12',
      piso: '3B',
      ciudad: 'Madrid',
      codigoPostal: '28001',
      estado: 'ACTIVO',
      tipo: 'ALUMNO',
      telefonoPadres: '611223344'
    }
  })

  const profesor = await prisma.usuario.create({
    data: {
      login: 'profesor1',
      password: 'abcdef',
      nombre: 'Carlos',
      apellido1: 'Ruiz',
      apellido2: 'Martínez',
      email: 'carlos.prof@example.com',
      calle: 'Av. del Sol',
      numero: '5',
      ciudad: 'Sevilla',
      piso: null,
      codigoPostal: '41001',
      estado: 'ACTIVO',
      tipo: 'PROFESOR',
      departamento: 'Lengua y Literatura'
    }
  })

  // Crear libros
  const libro1 = await prisma.libro.create({
    data: {
      isbn: '978-3-16-148410-0',
      titulo: 'Cien años de soledad',
      autor: 'Gabriel García Márquez',
      numPaginas: 417,
      numEjemplares: 2,
      numEjemplaresDisponibles: 1,
      portadaURL: 'https://example.com/portada1.jpg'
    }
  })

  const libro2 = await prisma.libro.create({
    data: {
      isbn: '978-0-14-044913-6',
      titulo: 'Don Quijote de la Mancha',
      autor: 'Miguel de Cervantes',
      numPaginas: 863,
      numEjemplares: 1,
      numEjemplaresDisponibles: 1,
      portadaURL: 'https://example.com/portada2.jpg'
    }
  })

  // Crear ejemplares
  const ejemplar1 = await prisma.ejemplar.create({
    data: {
      codigoEjemplar: 'EJ-1001',
      fechaAdquisicion: new Date('2020-05-20'),
      observaciones: 'Buen estado',
      libro: { connect: { id: libro1.id } }
    }
  })

  const ejemplar2 = await prisma.ejemplar.create({
    data: {
      codigoEjemplar: 'EJ-1002',
      fechaAdquisicion: new Date('2021-08-10'),
      observaciones: 'Cubierta rayada',
      libro: { connect: { id: libro1.id } }
    }
  })

  // Crear préstamo activo
  await prisma.prestamo.create({
    data: {
      fechaInicio: new Date(),
      deberiaDevolverseEl: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días después
      usuario: { connect: { id: alumno.id } },
      ejemplar: { connect: { id: ejemplar1.id } }
    }
  })

  // Crear multa activa
  await prisma.multa.create({
    data: {
      fechaInicio: new Date(),
      dias: 4,
      fechaFin: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      usuario: { connect: { id: alumno.id } }
    }
  })

  // Crear recomendación
  await prisma.recomendacion.create({
    data: {
      comentario: 'Si te gustó, también te gustará este clásico.',
      libroOrigen: { connect: { id: libro1.id } },
      libroRecomendado: { connect: { id: libro2.id } }
    }
  })

  // Crear préstamo histórico
  await prisma.prestamoHistorico.create({
    data: {
      fechaInicio: new Date('2024-01-15'),
      deberiaDevolverseEl: new Date('2024-01-22'),
      fechaDevolucion: new Date('2024-01-23'),
      usuario: { connect: { id: profesor.id } },
      ejemplar: { connect: { id: ejemplar2.id } },
      multa: undefined
    }
  })

  // Crear multa histórica
  await prisma.multaHistorica.create({
    data: {
      fechaInicio: new Date('2024-02-01'),
      fechaFin: new Date('2024-02-05'),
      usuario: { connect: { id: profesor.id } }
    }
  })
}

main()
  .then(() => {
    console.log('✅ Seed ejecutado correctamente')
  })
  .catch((e) => {
    console.error(e)
    //process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
