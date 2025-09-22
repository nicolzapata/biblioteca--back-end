const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Author = require('../models/Author');
const Book = require('../models/Book');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Limpiar datos existentes (opcional)
    // await User.deleteMany({});
    // await Author.deleteMany({});
    // await Book.deleteMany({});

    // Crear usuario administrador
    const existingAdmin = await User.findOne({ email: 'admin@biblioteca.com' });
    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Administrador',
        email: 'admin@biblioteca.com',
        password: adminPassword,
        role: 'admin',
        phone: '123456789'
      });
      console.log('✅ Usuario administrador creado');
    }

    // Crear autores de ejemplo
    const authorsData = [
      {
        name: 'Gabriel García Márquez',
        biography: 'Escritor colombiano, premio Nobel de Literatura 1982',
        nationality: 'Colombiano',
        birthDate: new Date('1927-03-06')
      },
      {
        name: 'Isabel Allende',
        biography: 'Escritora chilena de renombre internacional',
        nationality: 'Chilena',
        birthDate: new Date('1942-08-02')
      },
      {
        name: 'Mario Vargas Llosa',
        biography: 'Escritor peruano, premio Nobel de Literatura 2010',
        nationality: 'Peruano',
        birthDate: new Date('1936-03-28')
      }
    ];

    for (let authorData of authorsData) {
      const existing = await Author.findOne({ name: authorData.name });
      if (!existing) {
        await Author.create(authorData);
        console.log(`✅ Autor creado: ${authorData.name}`);
      }
    }

    // Crear libros de ejemplo
    const authors = await Author.find();
    const booksData = [
      {
        title: 'Cien años de soledad',
        author: authors.find(a => a.name === 'Gabriel García Márquez')._id,
        isbn: '9780307474728',
        genre: 'Realismo mágico',
        publicationDate: new Date('1967-06-05'),
        publisher: 'Editorial Sudamericana',
        pages: 471,
        description: 'La obra maestra de García Márquez que narra la historia de la familia Buendía',
        totalCopies: 5,
        availableCopies: 5
      },
      {
        title: 'La casa de los espíritus',
        author: authors.find(a => a.name === 'Isabel Allende')._id,
        isbn: '9788401242144',
        genre: 'Novela',
        publicationDate: new Date('1982-10-01'),
        publisher: 'Plaza & Janés',
        pages: 433,
        description: 'Primera novela de Isabel Allende',
        totalCopies: 3,
        availableCopies: 3
      },
      {
        title: 'La ciudad y los perros',
        author: authors.find(a => a.name === 'Mario Vargas Llosa')._id,
        isbn: '9788432217326',
        genre: 'Novela',
        publicationDate: new Date('1963-10-01'),
        publisher: 'Seix Barral',
        pages: 418,
        description: 'Primera novela publicada de Vargas Llosa',
        totalCopies: 4,
        availableCopies: 4
      }
    ];

    for (let bookData of booksData) {
      const existing = await Book.findOne({ isbn: bookData.isbn });
      if (!existing) {
        await Book.create(bookData);
        console.log(`✅ Libro creado: ${bookData.title}`);
      }
    }

    console.log('🎉 Datos de prueba creados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear datos de prueba:', error);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedData();
}

module.exports = seedData;