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

  const libro3 = await prisma.libro.create({
    data: {
      isbn: '978-1-86197-876-9',
      titulo: '1984',
      autor: 'George Orwell',
      numPaginas: 328,
      numEjemplares: 3,
      numEjemplaresDisponibles: 3,
      portadaURL: 'https://example.com/portada3.jpg'
    }
  })

  const libro4 = await prisma.libro.create({
    data: {
      isbn: '978-0-7432-7356-5',
      titulo: 'El gran Gatsby',
      autor: 'F. Scott Fitzgerald',
      numPaginas: 180,
      numEjemplares: 2,
      numEjemplaresDisponibles: 2,
      portadaURL: 'https://example.com/portada4.jpg'
    }
  })

  const libro5 = await prisma.libro.create({
    data: {
      isbn: '978-0-451-52493-5',
      titulo: 'Fahrenheit 451',
      autor: 'Ray Bradbury',
      numPaginas: 256,
      numEjemplares: 4,
      numEjemplaresDisponibles: 4,
      portadaURL: 'https://example.com/portada5.jpg'
    }
  })

  // Crear ejemplares
  const ejemplar1 = await prisma.ejemplar.create({
    data: {
      codigoEjemplar: 'EJ-1001',
      fechaAdquisicion: new Date('2020-05-20'),
      observaciones: 'Buen estado',
      libro: { connect: { id: libro1.id } },
      estado: 'disponible'
    }
  })

  const ejemplar2 = await prisma.ejemplar.create({
    data: {
      codigoEjemplar: 'EJ-1002',
      fechaAdquisicion: new Date('2021-08-10'),
      observaciones: 'Cubierta rayada',
      libro: { connect: { id: libro1.id } },
      estado: 'no disponible'
    }
  })

  const ejemplar3 = await prisma.ejemplar.create({
    data: {
      codigoEjemplar: 'EJ-2001',
      fechaAdquisicion: new Date('2023-01-12'),
      observaciones: 'Nuevo',
      libro: { connect: { id: libro3.id } }
    }
  })

  const ejemplar4 = await prisma.ejemplar.create({
    data: {
      codigoEjemplar: 'EJ-2002',
      fechaAdquisicion: new Date('2023-01-12'),
      observaciones: 'Nuevo',
      libro: { connect: { id: libro3.id } }
    }
  })

  const ejemplar5 = await prisma.ejemplar.create({
    data: {
      codigoEjemplar: 'EJ-2003',
      fechaAdquisicion: new Date('2023-01-12'),
      observaciones: 'Nuevo',
      libro: { connect: { id: libro3.id } }
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
      monto : 2.0,
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
      monto : 2.0,
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