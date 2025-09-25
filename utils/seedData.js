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

    // Crear usuario admin
    const existingAdmin = await User.findOne({ email: 'admin@biblioteca.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Administrador',
        username: 'admin',
        email: 'admin@biblioteca.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Usuario admin creado');
    }

    // Crear autores
    const authorsData = [
      {
        name: 'Gabriel García Márquez',
        biography: 'Escritor colombiano, premio Nobel',
        nationality: 'Colombiano'
      },
      {
        name: 'Isabel Allende',
        biography: 'Escritora chilena',
        nationality: 'Chilena'
      }
    ];

    for (let authorData of authorsData) {
      const existing = await Author.findOne({ name: authorData.name });
      if (!existing) {
        await Author.create(authorData);
        console.log(`✅ Autor creado: ${authorData.name}`);
      }
    }

    // Crear libros
    const authors = await Author.find();
    const booksData = [
      {
        title: 'Cien años de soledad',
        author: authors[0]._id,
        isbn: '9780307474728',
        genre: 'Realismo mágico',
        totalCopies: 5,
        availableCopies: 5
      },
      {
        title: 'La casa de los espíritus',
        author: authors[1]._id,
        isbn: '9788401242144',
        genre: 'Novela',
        totalCopies: 3,
        availableCopies: 3
      }
    ];

    for (let bookData of booksData) {
      const existing = await Book.findOne({ isbn: bookData.isbn });
      if (!existing) {
        await Book.create(bookData);
        console.log(`✅ Libro creado: ${bookData.title}`);
      }
    }

    console.log('🎉 Datos creados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedData();