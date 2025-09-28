const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Author = require('../models/Author');
const Book = require('../models/Book');
const Loan = require('../models/Loan');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');


    // Crear usuario Nicol admin
    const existingNicol = await User.findOne({ email: 'nicol@admin.com' });
    if (!existingNicol) {
      await User.create({
        name: 'Nicol',
        username: 'nicol',
        email: 'nicol@admin.com',
        password: 'nicol123',
        role: 'admin'
      });
      console.log('✅ Usuario admin Nicol creado');
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

    // Crear préstamos de prueba
    const users = await User.find();
    const books = await Book.find();
    const loansData = [
      {
        user: users[0]._id,
        book: books[0]._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      },
      {
        user: users[0]._id,
        book: books[1]._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días
        returnDate: new Date(),
        status: 'returned'
      }
    ];

    for (let loanData of loansData) {
      const existing = await Loan.findOne({ user: loanData.user, book: loanData.book });
      if (!existing) {
        await Loan.create(loanData);
        console.log(`✅ Préstamo creado para usuario ${users[0].name}`);
      }
    }

    console.log('🎉 Datos creados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

module.exports = seedData;