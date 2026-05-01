const { sequelize, Book, Review, User } = require('./db');

const seedData = async () => {
  await sequelize.sync({ force: true });

  const books = [
    {
      title: "The Midnight Library",
      author: "Matt Haig",
      genre: "Fiction",
      category: "CONTEMPORARY FICTION",
      rating: 4.8,
      reviewsCount: 2841,
      description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
      pages: 304,
      publisher: "Canongate Books",
      language: "English",
      publishedYear: "2020",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
      content: { 4: { pages: ["The library was endless...", "She pulled down a green book.", "It wasn't as happy as she imagined."] } }
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-help",
      category: "PERSONAL DEVELOPMENT",
      rating: 4.9,
      reviewsCount: 15200,
      description: "No matter your goals, Atomic Habits offers a proven framework for improving—every day.",
      pages: 320,
      publisher: "Avery",
      language: "English",
      publishedYear: "2018",
      coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      genre: "Fiction",
      category: "ADVENTURE",
      rating: 4.7,
      reviewsCount: 9500,
      description: "A fable about following your dream.",
      pages: 208,
      publisher: "HarperOne",
      language: "English",
      publishedYear: "1988",
      coverUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      genre: "Sci-Fi",
      category: "SCIENCE FICTION",
      rating: 4.9,
      reviewsCount: 4200,
      description: "Ryland Grace is the sole survivor on a desperate, last-chance mission.",
      pages: 476,
      publisher: "Ballantine Books",
      language: "English",
      publishedYear: "2021",
      coverUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Educated",
      author: "Tara Westover",
      genre: "Memoir",
      category: "BIOGRAPHY",
      rating: 4.6,
      reviewsCount: 7800,
      description: "A memoir about a woman who leaves her survivalist family to pursue an education.",
      pages: 352,
      publisher: "Random House",
      language: "English",
      publishedYear: "2018",
      coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      genre: "Thriller",
      category: "MYSTERY",
      rating: 4.5,
      reviewsCount: 11000,
      description: "Alicia Berenson’s life is seemingly perfect until she shoots her husband five times in the face.",
      pages: 336,
      publisher: "Celadon Books",
      language: "English",
      publishedYear: "2019",
      coverUrl: "https://images.unsplash.com/photo-1587876947003-51d727bb9ca2?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Circe",
      author: "Madeline Miller",
      genre: "Fantasy",
      category: "MYTHOLOGY",
      rating: 4.7,
      reviewsCount: 5600,
      description: "In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born.",
      pages: 393,
      publisher: "Little, Brown and Company",
      language: "English",
      publishedYear: "2018",
      coverUrl: "https://images.unsplash.com/photo-1474932430478-3a7fbaf50827?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      genre: "Fiction",
      category: "LITERATURE",
      rating: 4.8,
      reviewsCount: 12400,
      description: "For years, rumors of the 'Marsh Girl' have haunted Barkley Cove.",
      pages: 384,
      publisher: "G.P. Putnam's Sons",
      language: "English",
      publishedYear: "2018",
      coverUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      genre: "History",
      category: "NON-FICTION",
      rating: 4.7,
      reviewsCount: 22000,
      description: "A Brief History of Humankind.",
      pages: 443,
      publisher: "Harper",
      language: "English",
      publishedYear: "2011",
      coverUrl: "https://images.unsplash.com/photo-1532012197367-2836fb3ee3f2?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      genre: "Sci-Fi",
      category: "CLASSIC SCIFI",
      rating: 4.8,
      reviewsCount: 8900,
      description: "A stunning blend of adventure and mysticism.",
      pages: 617,
      publisher: "Chilton Books",
      language: "English",
      publishedYear: "1965",
      coverUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "The Psychology of Money",
      author: "Morgan Housel",
      genre: "Finance",
      category: "BUSINESS",
      rating: 4.8,
      reviewsCount: 6500,
      description: "Timeless lessons on wealth, greed, and happiness.",
      pages: 252,
      publisher: "Harriman House",
      language: "English",
      publishedYear: "2020",
      coverUrl: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Fourth Wing",
      author: "Rebecca Yarros",
      genre: "Fantasy",
      category: "ROMANTASY",
      rating: 4.9,
      reviewsCount: 18000,
      description: "Enter the brutal and elite world of a dragon rider academy.",
      pages: 528,
      publisher: "Red Tower Books",
      language: "English",
      publishedYear: "2023",
      coverUrl: "https://images.unsplash.com/photo-1514593259533-373090683a2c?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Tomorrow, and Tomorrow, and Tomorrow",
      author: "Gabrielle Zevin",
      genre: "Fiction",
      category: "CONTEMPORARY",
      rating: 4.7,
      reviewsCount: 5200,
      description: "In this exhilarating novel, two friends—often in love, but never lovers—become creative partners.",
      pages: 416,
      publisher: "Knopf",
      language: "English",
      publishedYear: "2022",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "The Guest List",
      author: "Lucy Foley",
      genre: "Mystery",
      category: "THRILLER",
      rating: 4.4,
      reviewsCount: 6800,
      description: "A wedding celebration turns dark and deadly.",
      pages: 330,
      publisher: "William Morrow",
      language: "English",
      publishedYear: "2020",
      coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Lessons in Chemistry",
      author: "Bonnie Garmus",
      genre: "Fiction",
      category: "HISTORICAL FICTION",
      rating: 4.8,
      reviewsCount: 9200,
      description: "Chemist Elizabeth Zott is not your average woman.",
      pages: 400,
      publisher: "Doubleday",
      language: "English",
      publishedYear: "2022",
      coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "The Big Picture",
      author: "Sean Carroll",
      genre: "Science",
      category: "NON-FICTION",
      rating: 4.7,
      reviewsCount: 1200,
      description: "On the origins of life, meaning, and the universe itself.",
      pages: 480,
      publisher: "Dutton",
      language: "English",
      publishedYear: "2016",
      coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Meditations",
      author: "Marcus Aurelius",
      genre: "Philosophy",
      category: "CLASSIC",
      rating: 4.9,
      reviewsCount: 8500,
      description: "The private reflections of the Roman Emperor on Stoic philosophy.",
      pages: 256,
      publisher: "Modern Library",
      language: "English",
      publishedYear: "180",
      coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      genre: "Romance",
      category: "CONTEMPORARY",
      rating: 4.8,
      reviewsCount: 15000,
      description: "Aging Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.",
      pages: 389,
      publisher: "Atria Books",
      language: "English",
      publishedYear: "2017",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"
    }
  ];

  for (const bookData of books) {
    const book = await Book.create(bookData);
    if (book.title === "The Midnight Library") {
      await Review.create({ BookId: book.id, userName: "Sophia R.", rating: 5, comment: "Absolutely mesmerizing.", avatar: "S" });
      await Review.create({ BookId: book.id, userName: "James K.", rating: 5, comment: "One of the best novels I've read this decade.", avatar: "J" });
    }
  }

  await User.create({
    name: "Eleanor Whitmore",
    email: "eleanor@example.com",
    password: "password123",
    avatar: "EW"
  });

  console.log('Database seeded successfully with ' + books.length + ' books!');
  process.exit();
};

seedData();
