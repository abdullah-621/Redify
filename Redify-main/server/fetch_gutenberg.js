/**
 * Project Gutenberg Book Fetcher
 * Fetches real public domain books and stores them in BoiPori database
 */

const { sequelize, Book, Category } = require('./db');
const https = require('https');
const http = require('http');

// Famous public domain books with their Gutenberg IDs
const GUTENBERG_BOOKS = [
  {
    id: 1342,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Fiction",
    category: "Fiction",
    rating: 4.9,
    reviewsCount: 18000,
    pages: 432,
    publisher: "T. Egerton",
    language: "English",
    publishedYear: "1813",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    description: "A romantic novel of manners set in early 19th century England. It follows the character development of Elizabeth Bennet, the dynamic protagonist, who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness."
  },
  {
    id: 11,
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    genre: "Fiction",
    category: "Fiction",
    rating: 4.8,
    reviewsCount: 14500,
    pages: 128,
    publisher: "Macmillan",
    language: "English",
    publishedYear: "1865",
    coverUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop",
    description: "Alice falls through a rabbit hole into a fantasy world populated by peculiar, anthropomorphic creatures. The tale plays with logic and has made the story of lasting popularity with adults as well as with children."
  },
  {
    id: 84,
    title: "Frankenstein",
    author: "Mary Shelley",
    genre: "Sci-Fi",
    category: "Sci-Fi",
    rating: 4.7,
    reviewsCount: 9800,
    pages: 280,
    publisher: "Lackington, Hughes, Harding, Mavor & Jones",
    language: "English",
    publishedYear: "1818",
    coverUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800&auto=format&fit=crop",
    description: "Frankenstein tells the story of Victor Frankenstein, a young scientist who creates a sapient creature in an unorthodox scientific experiment. The book is the first true science fiction novel."
  },
  {
    id: 1661,
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
    category: "Mystery",
    rating: 4.9,
    reviewsCount: 21000,
    pages: 307,
    publisher: "George Newnes",
    language: "English",
    publishedYear: "1892",
    coverUrl: "https://images.unsplash.com/photo-1587876947003-51d727bb9ca2?q=80&w=800&auto=format&fit=crop",
    description: "A collection of twelve short stories featuring Sherlock Holmes, the brilliant detective, and his trusted companion Dr. Watson. Each story presents a unique mystery that challenges Holmes's remarkable intellect."
  },
  {
    id: 174,
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    genre: "Fiction",
    category: "Fiction",
    rating: 4.8,
    reviewsCount: 11200,
    pages: 254,
    publisher: "Ward, Lock, and Company",
    language: "English",
    publishedYear: "1890",
    coverUrl: "https://images.unsplash.com/photo-1474932430478-3a7fbaf50827?q=80&w=800&auto=format&fit=crop",
    description: "The story of a young man named Dorian Gray who sells his soul for eternal youth and beauty while a portrait of him grows old and corrupt in his place."
  },
  {
    id: 345,
    title: "Dracula",
    author: "Bram Stoker",
    genre: "Mystery",
    category: "Mystery",
    rating: 4.7,
    reviewsCount: 8900,
    pages: 418,
    publisher: "Archibald Constable and Company",
    language: "English",
    publishedYear: "1897",
    coverUrl: "https://images.unsplash.com/photo-1514593259533-373090683a2c?q=80&w=800&auto=format&fit=crop",
    description: "The classic vampire novel told through journal entries, letters, and a ship's log. Jonathan Harker travels to Transylvania and discovers Count Dracula's terrible secret."
  },
  {
    id: 1497,
    title: "The Republic",
    author: "Plato",
    genre: "Philosophy",
    category: "Philosophy",
    rating: 4.7,
    reviewsCount: 5600,
    pages: 514,
    publisher: "Penguin Classics",
    language: "English",
    publishedYear: "380 BC",
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop",
    description: "Plato's greatest work discusses justice, order, and character of the just city-state and the just man. It is the founding work of Western political philosophy and the theory of forms."
  },
  {
    id: 4300,
    title: "Ulysses",
    author: "James Joyce",
    genre: "Fiction",
    category: "Fiction",
    rating: 4.5,
    reviewsCount: 6700,
    pages: 730,
    publisher: "Sylvia Beach",
    language: "English",
    publishedYear: "1922",
    coverUrl: "https://images.unsplash.com/photo-1532012197367-2836fb3ee3f2?q=80&w=800&auto=format&fit=crop",
    description: "A modernist novel that parallels Homer's Odyssey, following Leopold Bloom through Dublin on a single day. Considered one of the most important works in modernist literature."
  }
];

// Fetch text content from a URL
function fetchText(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// Parse Gutenberg text into chapters and pages
function parseGutenbergText(rawText, bookTitle) {
  // Remove Gutenberg header/footer
  let text = rawText;
  
  const startMarkers = [
    '*** START OF THE PROJECT GUTENBERG',
    '*** START OF THIS PROJECT GUTENBERG',
    '*END*THE SMALL PRINT',
    '***START OF THE PROJECT GUTENBERG'
  ];
  const endMarkers = [
    '*** END OF THE PROJECT GUTENBERG',
    '*** END OF THIS PROJECT GUTENBERG',
    'End of the Project Gutenberg',
    'End of Project Gutenberg'
  ];

  for (const marker of startMarkers) {
    const idx = text.indexOf(marker);
    if (idx !== -1) {
      text = text.substring(text.indexOf('\n', idx) + 1);
      break;
    }
  }

  for (const marker of endMarkers) {
    const idx = text.indexOf(marker);
    if (idx !== -1) {
      text = text.substring(0, idx);
      break;
    }
  }

  text = text.trim();

  // Try to find chapters
  const chapterPattern = /\n(CHAPTER\s+[IVXLCDM\d]+|Chapter\s+[IVXLCDM\d]+|PART\s+[IVXLCDM\d]+|Part\s+[IVXLCDM\d]+)[^\n]*/g;
  const chapterMatches = [...text.matchAll(chapterPattern)];

  const chapters = [];
  const pages = [];

  if (chapterMatches.length >= 2) {
    // Split by chapters
    for (let i = 0; i < chapterMatches.length; i++) {
      const match = chapterMatches[i];
      const chapterTitle = match[0].trim();
      const start = match.index + match[0].length;
      const end = i + 1 < chapterMatches.length ? chapterMatches[i + 1].index : text.length;
      const chapterText = text.substring(start, end).trim();

      if (chapterText.length < 100) continue; // Skip empty chapters

      chapters.push({ id: chapters.length + 1, title: chapterTitle });

      // Split chapter into pages (~1500 chars each)
      const chapterPages = splitIntoPages(chapterText, 1500);
      chapterPages.forEach(p => pages.push(p));
    }
  }

  // If no chapters found, just split the whole text into pages
  if (pages.length === 0) {
    const allPages = splitIntoPages(text, 1500);
    allPages.forEach((p, i) => pages.push(p));
    
    // Create generic chapters (every 10 pages = 1 chapter)
    const pagesPerChapter = Math.max(5, Math.floor(allPages.length / 10));
    for (let i = 0; i < allPages.length; i += pagesPerChapter) {
      chapters.push({ id: Math.floor(i / pagesPerChapter) + 1, title: `Part ${Math.floor(i / pagesPerChapter) + 1}` });
    }
  }

  // Limit to first 200 pages and 20 chapters to save DB space
  return {
    chapters: chapters.slice(0, 20),
    pages: pages.slice(0, 200)
  };
}

// Split a block of text into readable page-sized chunks
function splitIntoPages(text, charsPerPage) {
  const paragraphs = text.split(/\n\n+/).map(p => p.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()).filter(p => p.length > 10);
  
  const pages = [];
  let currentPage = '';

  for (const para of paragraphs) {
    if ((currentPage + ' ' + para).length > charsPerPage && currentPage.length > 0) {
      pages.push(currentPage.trim());
      currentPage = para;
    } else {
      currentPage += (currentPage ? '\n\n' : '') + para;
    }
  }

  if (currentPage.trim().length > 50) {
    pages.push(currentPage.trim());
  }

  return pages;
}

// Main function
async function fetchAndSeedBooks() {
  await sequelize.sync();
  console.log('📚 Starting Project Gutenberg book import...\n');

  let successCount = 0;
  let failCount = 0;

  for (const bookMeta of GUTENBERG_BOOKS) {
    try {
      // Skip if already exists with content
      const existing = await Book.findOne({ where: { title: bookMeta.title } });
      if (existing && existing.content && existing.content.pages && existing.content.pages.length > 5) {
        console.log(`⏭️  Skipped (already has content): ${bookMeta.title}`);
        continue;
      }

      process.stdout.write(`📥 Fetching: ${bookMeta.title}... `);
      
      // Try multiple URL formats for Gutenberg
      const urls = [
        `https://www.gutenberg.org/cache/epub/${bookMeta.id}/pg${bookMeta.id}.txt`,
        `https://www.gutenberg.org/files/${bookMeta.id}/${bookMeta.id}-0.txt`,
        `https://www.gutenberg.org/files/${bookMeta.id}/${bookMeta.id}.txt`,
      ];

      let rawText = null;
      for (const url of urls) {
        try {
          rawText = await fetchText(url);
          if (rawText && rawText.length > 1000) break;
        } catch (e) {
          // try next URL
        }
      }

      if (!rawText || rawText.length < 1000) {
        console.log('❌ Failed to fetch');
        failCount++;
        continue;
      }

      const { chapters, pages } = parseGutenbergText(rawText, bookMeta.title);

      if (pages.length < 5) {
        console.log(`❌ Could not parse (only ${pages.length} pages)`);
        failCount++;
        continue;
      }

      const bookData = {
        ...bookMeta,
        pages: bookMeta.pages || pages.length * 3,
        content: { chapters, pages }
      };

      delete bookData.id; // Remove Gutenberg ID, let DB auto-assign

      if (existing) {
        await existing.update(bookData);
      } else {
        await Book.create(bookData);
      }

      // Ensure category exists
      await Category.findOrCreate({ where: { name: bookMeta.category } });

      console.log(`✅ Done! (${pages.length} pages, ${chapters.length} chapters)`);
      successCount++;

      // Small delay to be respectful to Gutenberg servers
      await new Promise(r => setTimeout(r, 1500));

    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n🎉 Import complete!`);
  console.log(`   ✅ ${successCount} books imported successfully`);
  console.log(`   ❌ ${failCount} books failed`);
  console.log(`\n💡 You can now read full books in the BoiPori reader!`);
  process.exit(0);
}

fetchAndSeedBooks();
