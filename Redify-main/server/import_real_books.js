/**
 * Full BoiPori Database Reset & Real Books Import
 * Replaces ALL dummy books with real Project Gutenberg classics
 */
const { sequelize, Book, Review, Category } = require('./db');
const https = require('https');
const http = require('http');

// ============================================================
// REAL BOOKS LIST — Public Domain from Project Gutenberg
// ============================================================
const REAL_BOOKS = [
  // ── FICTION ──────────────────────────────────────────────
  { gutId: 1342, title: "Pride and Prejudice", author: "Jane Austen", genre: "Fiction", category: "Fiction", rating: 4.9, reviewsCount: 18000, publisher: "T. Egerton", publishedYear: "1813", coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800", description: "A romantic novel of manners set in early 19th-century England, following Elizabeth Bennet as she navigates issues of manners, upbringing, morality, and marriage." },
  { gutId: 11,   title: "Alice's Adventures in Wonderland", author: "Lewis Carroll", genre: "Fiction", category: "Fiction", rating: 4.8, reviewsCount: 14500, publisher: "Macmillan", publishedYear: "1865", coverUrl: "https://images.unsplash.com/photo-1474932430478-3a7fbaf50827?q=80&w=800", description: "Alice falls through a rabbit hole into a fantasy world populated by peculiar anthropomorphic creatures. A timeless classic of children's literature." },
  { gutId: 98,   title: "A Tale of Two Cities", author: "Charles Dickens", genre: "Fiction", category: "Fiction", rating: 4.7, reviewsCount: 12000, publisher: "Chapman & Hall", publishedYear: "1859", coverUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800", description: "Set during the French Revolution, a dramatic story of love, sacrifice, and resurrection in London and Paris." },
  { gutId: 1400, title: "Great Expectations", author: "Charles Dickens", genre: "Fiction", category: "Fiction", rating: 4.7, reviewsCount: 10000, publisher: "Chapman & Hall", publishedYear: "1861", coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800", description: "The coming-of-age story of an orphan named Pip who aspires to rise above his humble origins in Victorian England." },
  { gutId: 174,  title: "The Picture of Dorian Gray", author: "Oscar Wilde", genre: "Fiction", category: "Fiction", rating: 4.8, reviewsCount: 11200, publisher: "Ward, Lock & Co", publishedYear: "1890", coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800", description: "A young man sells his soul for eternal youth and beauty, while a portrait of him grows old and corrupt in his place." },
  { gutId: 161,  title: "Sense and Sensibility", author: "Jane Austen", genre: "Romance", category: "Fiction", rating: 4.7, reviewsCount: 9800, publisher: "Thomas Egerton", publishedYear: "1811", coverUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800", description: "Follows Elinor and Marianne Dashwood as they navigate love and heartbreak in English society." },
  { gutId: 768,  title: "Wuthering Heights", author: "Emily Brontë", genre: "Romance", category: "Fiction", rating: 4.6, reviewsCount: 8700, publisher: "Thomas Newby", publishedYear: "1847", coverUrl: "https://images.unsplash.com/photo-1532012197367-2836fb3ee3f2?q=80&w=800", description: "A wild, passionate story of the intense love between Catherine Earnshaw and Heathcliff on the Yorkshire moors." },
  { gutId: 158,  title: "Emma", author: "Jane Austen", genre: "Fiction", category: "Fiction", rating: 4.6, reviewsCount: 8400, publisher: "John Murray", publishedYear: "1815", coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800", description: "The story of Emma Woodhouse, a well-meaning but meddlesome young woman who plays matchmaker for her friends." },

  // ── MYSTERY / THRILLER ───────────────────────────────────
  { gutId: 1661, title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", genre: "Mystery", category: "Mystery", rating: 4.9, reviewsCount: 21000, publisher: "George Newnes", publishedYear: "1892", coverUrl: "https://images.unsplash.com/photo-1587876947003-51d727bb9ca2?q=80&w=800", description: "Twelve classic stories featuring the brilliant detective Sherlock Holmes and his trusted companion Dr. Watson." },
  { gutId: 345,  title: "Dracula", author: "Bram Stoker", genre: "Mystery", category: "Mystery", rating: 4.7, reviewsCount: 8900, publisher: "Archibald Constable", publishedYear: "1897", coverUrl: "https://images.unsplash.com/photo-1514593259533-373090683a2c?q=80&w=800", description: "The original vampire horror story told through journal entries. Jonathan Harker travels to Transylvania and discovers Count Dracula's dark secret." },
  { gutId: 863,  title: "The Mysterious Affair at Styles", author: "Agatha Christie", genre: "Mystery", category: "Mystery", rating: 4.8, reviewsCount: 7600, publisher: "Bodley Head", publishedYear: "1920", coverUrl: "https://images.unsplash.com/photo-1474932430478-3a7fbaf50827?q=80&w=800", description: "The debut of Hercule Poirot, Christie's brilliant Belgian detective, investigating a mysterious murder in a country house." },
  { gutId: 2097, title: "The Strange Case of Dr Jekyll and Mr Hyde", author: "Robert Louis Stevenson", genre: "Mystery", category: "Mystery", rating: 4.7, reviewsCount: 9200, publisher: "Longmans, Green & Co", publishedYear: "1886", coverUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800", description: "A gripping tale of a London lawyer who investigates strange occurrences between his old friend Dr Henry Jekyll and the hideous Edward Hyde." },

  // ── SCI-FI ───────────────────────────────────────────────
  { gutId: 84,   title: "Frankenstein", author: "Mary Shelley", genre: "Sci-Fi", category: "Sci-Fi", rating: 4.7, reviewsCount: 9800, publisher: "Lackington Hughes", publishedYear: "1818", coverUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800", description: "The story of Victor Frankenstein who creates a sapient creature in an unorthodox scientific experiment — the first true science fiction novel." },
  { gutId: 35,   title: "The Time Machine", author: "H.G. Wells", genre: "Sci-Fi", category: "Sci-Fi", rating: 4.7, reviewsCount: 7200, publisher: "William Heinemann", publishedYear: "1895", coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800", description: "A scientist invents a machine to travel through time and journeys to the distant future, discovering the fate of humanity." },
  { gutId: 36,   title: "The War of the Worlds", author: "H.G. Wells", genre: "Sci-Fi", category: "Sci-Fi", rating: 4.8, reviewsCount: 10300, publisher: "William Heinemann", publishedYear: "1898", coverUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800", description: "Martians invade Earth, and one man struggles to survive as humanity faces annihilation by an unstoppable alien force." },
  { gutId: 103,  title: "Around the World in 80 Days", author: "Jules Verne", genre: "Sci-Fi", category: "Sci-Fi", rating: 4.8, reviewsCount: 11000, publisher: "Pierre-Jules Hetzel", publishedYear: "1872", coverUrl: "https://images.unsplash.com/photo-1532012197367-2836fb3ee3f2?q=80&w=800", description: "Phileas Fogg bets that he can circumnavigate the world in just 80 days in this thrilling adventure across continents and oceans." },

  // ── PHILOSOPHY ───────────────────────────────────────────
  { gutId: 1497, title: "The Republic", author: "Plato", genre: "Philosophy", category: "Philosophy", rating: 4.7, reviewsCount: 5600, publisher: "Penguin Classics", publishedYear: "380 BC", coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800", description: "Plato's greatest work discusses justice, order, and the character of the just city-state and the just man." },
  { gutId: 2680, title: "Meditations", author: "Marcus Aurelius", genre: "Philosophy", category: "Philosophy", rating: 4.9, reviewsCount: 14000, publisher: "Penguin Classics", publishedYear: "180 AD", coverUrl: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=800", description: "Private reflections of the Roman Emperor on Stoic philosophy — a timeless guide to living with virtue and purpose." },
  { gutId: 4507, title: "As a Man Thinketh", author: "James Allen", genre: "Philosophy", category: "Philosophy", rating: 4.8, reviewsCount: 8900, publisher: "Abner Dodd", publishedYear: "1903", coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800", description: "A self-help classic that explores the power of thought on character, circumstances, health, purpose, and achievement." },

  // ── HISTORY ──────────────────────────────────────────────
  { gutId: 132,  title: "The Art of War", author: "Sun Tzu", genre: "History", category: "History", rating: 4.8, reviewsCount: 17000, publisher: "Ancient Text", publishedYear: "500 BC", coverUrl: "https://images.unsplash.com/photo-1532012197367-2836fb3ee3f2?q=80&w=800", description: "An ancient Chinese military treatise that is still one of the most influential books on strategy and leadership." },
  { gutId: 1232, title: "The Prince", author: "Niccolò Machiavelli", genre: "History", category: "History", rating: 4.6, reviewsCount: 8700, publisher: "Antonio Blado", publishedYear: "1532", coverUrl: "https://images.unsplash.com/photo-1514593259533-373090683a2c?q=80&w=800", description: "A 16th-century political treatise on the acquisition, maintenance, and expansion of political power." },
  { gutId: 2500, title: "Up from Slavery", author: "Booker T. Washington", genre: "History", category: "History", rating: 4.7, reviewsCount: 4300, publisher: "Doubleday", publishedYear: "1901", coverUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800", description: "The autobiography of Booker T. Washington, who rose from slavery to become one of the most influential educators of the 19th century." },

  // ── SELF-HELP ─────────────────────────────────────────────
  { gutId: 4507, title: "As a Man Thinketh (Self-Help Ed.)", author: "James Allen", genre: "Self-Help", category: "Self-Help", rating: 4.8, reviewsCount: 8900, publisher: "Abner Dodd", publishedYear: "1903", coverUrl: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=800", description: "The power of thought in shaping character and circumstances, presented as a guide for personal development and achievement." },
  { gutId: 16119,title: "The Science of Getting Rich", author: "Wallace D. Wattles", genre: "Self-Help", category: "Self-Help", rating: 4.6, reviewsCount: 6200, publisher: "Elizabeth Towne", publishedYear: "1910", coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800", description: "A practical guide to the science of getting rich, teaching the right way to think and act to attract wealth and success." },

  // ── ROMANCE ──────────────────────────────────────────────
  { gutId: 1260, title: "Jane Eyre", author: "Charlotte Brontë", genre: "Romance", category: "Romance", rating: 4.8, reviewsCount: 13500, publisher: "Smith, Elder & Co", publishedYear: "1847", coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800", description: "The story of Jane Eyre, an orphan who overcomes hardship to find love and independence, balancing her passion and morality." },
  { gutId: 105,  title: "Persuasion", author: "Jane Austen", genre: "Romance", category: "Romance", rating: 4.8, reviewsCount: 9100, publisher: "John Murray", publishedYear: "1817", coverUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800", description: "Anne Elliot reconnects with Captain Wentworth, the man she rejected eight years earlier at the persuasion of her family." },

  // ── BIOGRAPHY ────────────────────────────────────────────
  { gutId: 20203,title: "Autobiography of Benjamin Franklin", author: "Benjamin Franklin", genre: "Biography", category: "Biography", rating: 4.7, reviewsCount: 7800, publisher: "Various", publishedYear: "1791", coverUrl: "https://images.unsplash.com/photo-1532012197367-2836fb3ee3f2?q=80&w=800", description: "The story of one of America's founding fathers, from humble origins to scientist, philosopher, and statesman." },

  // ── TRAVEL ───────────────────────────────────────────────
  { gutId: 829,  title: "Gulliver's Travels", author: "Jonathan Swift", genre: "Travel", category: "Travel", rating: 4.6, reviewsCount: 8900, publisher: "Benjamin Motte", publishedYear: "1726", coverUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800", description: "A satirical novel following Lemuel Gulliver on his travels to strange and fantastical lands, each a biting commentary on human nature." },
  { gutId: 2488, title: "Twenty Thousand Leagues Under the Sea", author: "Jules Verne", genre: "Travel", category: "Travel", rating: 4.8, reviewsCount: 9700, publisher: "Pierre-Jules Hetzel", publishedYear: "1870", coverUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800", description: "A thrilling underwater adventure aboard Captain Nemo's submarine, the Nautilus, exploring the mysterious depths of the ocean." },
];

// Deduplicate by title
const BOOKS = REAL_BOOKS.reduce((acc, b) => {
  if (!acc.find(x => x.title === b.title)) acc.push(b);
  return acc;
}, []);

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function parseGutenbergText(rawText) {
  let text = rawText;
  const startMarkers = ['*** START OF THE PROJECT GUTENBERG', '*** START OF THIS PROJECT GUTENBERG', '***START OF THE PROJECT GUTENBERG'];
  const endMarkers = ['*** END OF THE PROJECT GUTENBERG', '*** END OF THIS PROJECT GUTENBERG', 'End of the Project Gutenberg', 'End of Project Gutenberg'];

  for (const m of startMarkers) {
    const idx = text.indexOf(m);
    if (idx !== -1) { text = text.substring(text.indexOf('\n', idx) + 1); break; }
  }
  for (const m of endMarkers) {
    const idx = text.indexOf(m);
    if (idx !== -1) { text = text.substring(0, idx); break; }
  }
  text = text.trim();

  const chapterPattern = /\n(CHAPTER\s+[IVXLCDM\d]+|Chapter\s+[IVXLCDM\d]+|PART\s+[IVXLCDM\d]+|Part\s+[IVXLCDM\d]+|Chapter\s+\w+|CHAPTER\s+\w+)[^\n]*/g;
  const matches = [...text.matchAll(chapterPattern)];
  const chapters = [], pages = [];

  if (matches.length >= 2) {
    for (let i = 0; i < matches.length; i++) {
      const m = matches[i];
      const start = m.index + m[0].length;
      const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
      const chunkText = text.substring(start, end).trim();
      if (chunkText.length < 100) continue;
      chapters.push({ id: chapters.length + 1, title: m[0].trim() });
      splitIntoPages(chunkText, 1500).forEach(p => pages.push(p));
    }
  }

  if (pages.length < 5) {
    splitIntoPages(text, 1500).forEach(p => pages.push(p));
    const ppc = Math.max(5, Math.floor(pages.length / 10));
    for (let i = 0; i < pages.length; i += ppc) {
      chapters.push({ id: Math.floor(i / ppc) + 1, title: `Part ${Math.floor(i / ppc) + 1}` });
    }
  }

  return { chapters: chapters.slice(0, 25), pages: pages.slice(0, 250) };
}

function splitIntoPages(text, size) {
  const paras = text.split(/\n\n+/).map(p => p.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()).filter(p => p.length > 10);
  const pages = [];
  let cur = '';
  for (const p of paras) {
    if ((cur + ' ' + p).length > size && cur.length > 0) { pages.push(cur.trim()); cur = p; }
    else { cur += (cur ? '\n\n' : '') + p; }
  }
  if (cur.trim().length > 50) pages.push(cur.trim());
  return pages;
}

async function fetchBookContent(gutId) {
  const urls = [
    `https://www.gutenberg.org/cache/epub/${gutId}/pg${gutId}.txt`,
    `https://www.gutenberg.org/files/${gutId}/${gutId}-0.txt`,
    `https://www.gutenberg.org/files/${gutId}/${gutId}.txt`,
  ];
  for (const url of urls) {
    try {
      const raw = await fetchText(url);
      if (raw && raw.length > 5000) return raw;
    } catch (_) {}
  }
  return null;
}

async function run() {
  await sequelize.sync();
  console.log('\n🗑️  Clearing old dummy books...');
  await Book.destroy({ where: {}, truncate: true });
  console.log('✅ Old books cleared\n');

  // Seed categories
  const cats = [...new Set(BOOKS.map(b => b.category))];
  for (const name of cats) await Category.findOrCreate({ where: { name } });
  console.log(`✅ ${cats.length} categories ready\n`);
  console.log(`📚 Importing ${BOOKS.length} real books from Project Gutenberg...\n`);

  let ok = 0, fail = 0;
  for (const meta of BOOKS) {
    process.stdout.write(`📥 ${meta.title} (by ${meta.author})... `);
    const raw = await fetchBookContent(meta.gutId);
    
    let content = null;
    if (raw) {
      const parsed = parseGutenbergText(raw);
      if (parsed.pages.length >= 5) content = parsed;
    }

    if (!content) {
      // Fallback: create 3 meaningful placeholder pages from description
      content = {
        chapters: [{ id: 1, title: 'Chapter I' }, { id: 2, title: 'Chapter II' }, { id: 3, title: 'Chapter III' }],
        pages: [
          `${meta.title} by ${meta.author}\n\n${meta.description}\n\nThis is the opening of one of literature's most celebrated works. The full text is being prepared for your reading experience.`,
          `Continuing the story of "${meta.title}"...\n\nThe pages that follow contain some of the most memorable passages in ${meta.genre} literature. Written by ${meta.author} in ${meta.publishedYear}, this work has inspired generations of readers around the world.`,
          `"${meta.title}" remains a cornerstone of ${meta.genre} literature.\n\nPublished by ${meta.publisher} in ${meta.publishedYear}, it continues to be read and studied by people of all ages. The work's themes of ${meta.description.split('.')[0].toLowerCase()} resonate deeply with modern readers.`
        ]
      };
      fail++;
      process.stdout.write(`⚠️  Saved with placeholder (${fail} fallbacks)\n`);
    } else {
      ok++;
      process.stdout.write(`✅ ${content.pages.length} pages, ${content.chapters.length} chapters\n`);
    }

    await Book.create({
      title: meta.title,
      author: meta.author,
      genre: meta.genre,
      category: meta.category,
      rating: meta.rating,
      reviewsCount: meta.reviewsCount,
      description: meta.description,
      pages: meta.pages || content.pages.length * 2,
      publisher: meta.publisher,
      language: "English",
      publishedYear: meta.publishedYear,
      coverUrl: meta.coverUrl,
      content
    });

    await new Promise(r => setTimeout(r, 1200)); // Be polite to Gutenberg
  }

  console.log(`\n🎉 Done! ${ok} full books + ${fail} with placeholders`);
  console.log(`📖 Total books in library: ${ok + fail}`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
