const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  role: { type: DataTypes.STRING, defaultValue: 'Reader' }
});

const Book = sequelize.define('Book', {
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  coverUrl: { type: DataTypes.STRING },
  genre: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  reviewsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  pages: { type: DataTypes.INTEGER },
  publisher: { type: DataTypes.STRING },
  language: { type: DataTypes.STRING, defaultValue: 'English' },
  publishedYear: { type: DataTypes.STRING },
  content: { type: DataTypes.JSON } // Storing chapters/pages as JSON for simplicity
});

const Review = sequelize.define('Review', {
  userName: { type: DataTypes.STRING },
  comment: { type: DataTypes.TEXT },
  rating: { type: DataTypes.INTEGER },
  avatar: { type: DataTypes.STRING }
});

const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING, unique: true, allowNull: false }
});

const ReadingLog = sequelize.define('ReadingLog', {
  date: { type: DataTypes.DATEONLY, allowNull: false }
});

const Note = sequelize.define('Note', {
  content: { type: DataTypes.TEXT, allowNull: false },
  page: { type: DataTypes.INTEGER },
  bookId: { type: DataTypes.INTEGER },
  bookTitle: { type: DataTypes.STRING }
});

// Relationships
User.hasMany(ReadingLog);
ReadingLog.belongsTo(User);

User.hasMany(Note);
Note.belongsTo(User);

Book.hasMany(Review);
Review.belongsTo(Book);

module.exports = { sequelize, User, Book, Review, ReadingLog, Category, Note };
