const { sequelize, Book, Category } = require('./db');

const newBooks = [
  // Fiction
  { title: "Pride and Prejudice", author: "Jane Austen", genre: "Fiction", category: "Fiction", rating: 4.9, reviewsCount: 18000, description: "A romantic novel of manners set in early 19th century England.", pages: 432, publisher: "T. Egerton", language: "English", publishedYear: "1813", coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
  { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", category: "Fiction", rating: 4.8, reviewsCount: 14000, description: "The unforgettable novel of a childhood in a sleepy Southern town.", pages: 281, publisher: "J.B. Lippincott", language: "English", publishedYear: "1960", coverUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop" },
  { title: "1984", author: "George Orwell", genre: "Fiction", category: "Fiction", rating: 4.9, reviewsCount: 22000, description: "A dystopian social science fiction novel set in a totalitarian superstate.", pages: 328, publisher: "Secker & Warburg", language: "English", publishedYear: "1949", coverUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop" },

  // Science
  { title: "A Brief History of Time", author: "Stephen Hawking", genre: "Science", category: "Science", rating: 4.7, reviewsCount: 12000, description: "Landmark volume about cosmology and the nature of time.", pages: 212, publisher: "Bantam Dell", language: "English", publishedYear: "1988", coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop" },
  { title: "The Selfish Gene", author: "Richard Dawkins", genre: "Science", category: "Science", rating: 4.6, reviewsCount: 5400, description: "A landmark science book about evolutionary biology.", pages: 360, publisher: "Oxford University Press", language: "English", publishedYear: "1976", coverUrl: "https://images.unsplash.com/photo-1532012197367-2836fb3ee3f2?q=80&w=800&auto=format&fit=crop" },
  { title: "Cosmos", author: "Carl Sagan", genre: "Science", category: "Science", rating: 4.8, reviewsCount: 9000, description: "A personal voyage through the universe.", pages: 365, publisher: "Random House", language: "English", publishedYear: "1980", coverUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&auto=format&fit=crop" },

  // History
  { title: "Guns, Germs, and Steel", author: "Jared Diamond", genre: "History", category: "History", rating: 4.6, reviewsCount: 7800, description: "Why did history unfold differently across continents?", pages: 498, publisher: "W.W. Norton", language: "English", publishedYear: "1997", coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop" },
  { title: "The Silk Roads", author: "Peter Frankopan", genre: "History", category: "History", rating: 4.7, reviewsCount: 4200, description: "A new history of the world told through the trade routes.", pages: 636, publisher: "Bloomsbury", language: "English", publishedYear: "2015", coverUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800&auto=format&fit=crop" },

  // Self-Help
  { title: "Think and Grow Rich", author: "Napoleon Hill", genre: "Self-Help", category: "Self-Help", rating: 4.7, reviewsCount: 16000, description: "Timeless classic on achieving success and wealth.", pages: 320, publisher: "The Ralston Society", language: "English", publishedYear: "1937", coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop" },
  { title: "The Power of Now", author: "Eckhart Tolle", genre: "Self-Help", category: "Self-Help", rating: 4.6, reviewsCount: 9800, description: "A guide to spiritual enlightenment.", pages: 236, publisher: "Namaste Publishing", language: "English", publishedYear: "1997", coverUrl: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=800&auto=format&fit=crop" },

  // Mystery
  { title: "And Then There Were None", author: "Agatha Christie", genre: "Mystery", category: "Mystery", rating: 4.8, reviewsCount: 11000, description: "Ten strangers are lured to a remote island — and one by one they begin to die.", pages: 264, publisher: "Collins Crime Club", language: "English", publishedYear: "1939", coverUrl: "https://images.unsplash.com/photo-1587876947003-51d727bb9ca2?q=80&w=800&auto=format&fit=crop" },
  { title: "Gone Girl", author: "Gillian Flynn", genre: "Mystery", category: "Mystery", rating: 4.5, reviewsCount: 14000, description: "On a chilly Missouri morning, Amy Dunne disappears.", pages: 422, publisher: "Crown", language: "English", publishedYear: "2012", coverUrl: "https://images.unsplash.com/photo-1474932430478-3a7fbaf50827?q=80&w=800&auto=format&fit=crop" },

  // Sci-Fi
  { title: "The Martian", author: "Andy Weir", genre: "Sci-Fi", category: "Sci-Fi", rating: 4.8, reviewsCount: 13000, description: "Astronaut Mark Watney is stranded alone on Mars.", pages: 369, publisher: "Ballantine Books", language: "English", publishedYear: "2011", coverUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800&auto=format&fit=crop" },
  { title: "Foundation", author: "Isaac Asimov", genre: "Sci-Fi", category: "Sci-Fi", rating: 4.7, reviewsCount: 7200, description: "The first novel of Asimov's classic science-fiction masterpiece.", pages: 244, publisher: "Gnome Press", language: "English", publishedYear: "1951", coverUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&auto=format&fit=crop" },

  // Romance
  { title: "Outlander", author: "Diana Gabaldon", genre: "Romance", category: "Romance", rating: 4.7, reviewsCount: 11500, description: "A time-travel romance set in 18th century Scotland.", pages: 850, publisher: "Delacorte Press", language: "English", publishedYear: "1991", coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
  { title: "Me Before You", author: "Jojo Moyes", genre: "Romance", category: "Romance", rating: 4.8, reviewsCount: 16000, description: "A heartbreaking love story about two people with very different lives.", pages: 369, publisher: "Pamela Dorman Books", language: "English", publishedYear: "2012", coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },

  // Philosophy
  { title: "The Republic", author: "Plato", genre: "Philosophy", category: "Philosophy", rating: 4.7, reviewsCount: 5600, description: "Plato's greatest work — a masterpiece of Western philosophical thought.", pages: 514, publisher: "Penguin Classics", language: "English", publishedYear: "380 BC", coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop" },
  { title: "Man's Search for Meaning", author: "Viktor Frankl", genre: "Philosophy", category: "Philosophy", rating: 4.9, reviewsCount: 14000, description: "A psychiatrist's memoir of life in Nazi death camps.", pages: 184, publisher: "Beacon Press", language: "English", publishedYear: "1946", coverUrl: "https://images.unsplash.com/photo-1532012197367-2836fb3ee3f2?q=80&w=800&auto=format&fit=crop" },

  // Islamic
  { title: "Don't Be Sad", author: "Aaidh al-Qarni", genre: "Islamic", category: "Islamic", rating: 4.9, reviewsCount: 8900, description: "A treasure chest of consolation for the troubled Muslim.", pages: 467, publisher: "International Islamic Publishing House", language: "English", publishedYear: "2003", coverUrl: "https://images.unsplash.com/photo-1454789415558-bdda08f4eabb?q=80&w=800&auto=format&fit=crop" },
  { title: "The Sealed Nectar", author: "Safiur-Rahman Mubarakpuri", genre: "Islamic", category: "Islamic", rating: 4.9, reviewsCount: 6700, description: "A biography of Prophet Muhammad (PBUH), winner of the first prize by the World Muslim League.", pages: 560, publisher: "Darussalam", language: "English", publishedYear: "1979", coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop" },

  // Biography
  { title: "Steve Jobs", author: "Walter Isaacson", genre: "Biography", category: "Biography", rating: 4.7, reviewsCount: 13200, description: "The definitive biography of one of the most fascinating minds of our time.", pages: 656, publisher: "Simon & Schuster", language: "English", publishedYear: "2011", coverUrl: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=800&auto=format&fit=crop" },
  { title: "Long Walk to Freedom", author: "Nelson Mandela", genre: "Biography", category: "Biography", rating: 4.9, reviewsCount: 8500, description: "The autobiography of Nelson Mandela, President of South Africa.", pages: 656, publisher: "Little, Brown and Company", language: "English", publishedYear: "1994", coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },

  // Travel
  { title: "Into the Wild", author: "Jon Krakauer", genre: "Travel", category: "Travel", rating: 4.6, reviewsCount: 9100, description: "The true story of Christopher McCandless who walked into Alaska wilderness alone.", pages: 224, publisher: "Villard Books", language: "English", publishedYear: "1996", coverUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800&auto=format&fit=crop" },

  // Arts
  { title: "The Artist's Way", author: "Julia Cameron", genre: "Arts", category: "Arts", rating: 4.7, reviewsCount: 7200, description: "A spiritual path to higher creativity.", pages: 256, publisher: "TarcherPerigee", language: "English", publishedYear: "1992", coverUrl: "https://images.unsplash.com/photo-1514593259533-373090683a2c?q=80&w=800&auto=format&fit=crop" },
];

async function seedNewBooks() {
  try {
    await sequelize.sync();

    // Also seed categories
    const categoryNames = [...new Set(newBooks.map(b => b.category))];
    for (const name of categoryNames) {
      await Category.findOrCreate({ where: { name } });
    }
    console.log(`✅ Seeded ${categoryNames.length} categories`);

    // Add books (skip duplicates by title)
    let added = 0;
    for (const bookData of newBooks) {
      const existing = await Book.findOne({ where: { title: bookData.title } });
      if (!existing) {
        await Book.create(bookData);
        added++;
      }
    }

    console.log(`✅ Added ${added} new books across ${categoryNames.length} categories!`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedNewBooks();
