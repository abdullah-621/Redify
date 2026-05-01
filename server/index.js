const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { sequelize, User, Book, Review, Note, ReadingLog, Category } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Endpoints

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get book details
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [Review]
    });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit a review for a book
app.post('/api/books/:id/reviews', async (req, res) => {
  const { userName, comment, rating, avatar } = req.body;
  try {
    if (!userName || !comment || !rating) {
      return res.status(400).json({ error: 'userName, comment and rating are required' });
    }
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const review = await Review.create({
      userName,
      comment,
      rating: parseInt(rating),
      avatar: avatar || userName[0].toUpperCase(),
      BookId: req.params.id
    });

    // Update reviewsCount on book
    book.reviewsCount = (book.reviewsCount || 0) + 1;
    await book.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    // Support both bcrypt hashes and legacy plain-text passwords
    let passwordMatch = false;
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      // Legacy plain-text: compare then upgrade to hash
      passwordMatch = user.password === password;
      if (passwordMatch) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (passwordMatch) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register user
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- USER ENDPOINTS ---

app.post('/api/user/:id/read-log', async (req, res) => {
  try {
    const { date } = req.body;
    const [log, created] = await ReadingLog.findOrCreate({
      where: { UserId: req.params.id, date: date || new Date().toISOString().split('T')[0] }
    });
    res.json({ message: created ? 'Logged' : 'Already logged', log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/dashboard-stats/:id', async (req, res) => {
  try {
    const logs = await ReadingLog.findAll({
      where: { UserId: req.params.id },
      order: [['date', 'DESC']]
    });
    let streak = 0;
    if (logs.length > 0) {
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      // Check if they read today or yesterday to continue streak
      const latestLogDate = new Date(logs[0].date);
      latestLogDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate - latestLogDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) { // Read today or yesterday
        streak = 1;
        for (let i = 0; i < logs.length - 1; i++) {
          const d1 = new Date(logs[i].date);
          const d2 = new Date(logs[i+1].date);
          const diff = Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }
    
    // Calculate weekly activity (Mon-Sun)
    const weeklyActivity = [];
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sun) to 6 (Sat)
    const mondayDiff = today.getDate() - (currentDay === 0 ? 6 : currentDay - 1);
    const monday = new Date(today);
    monday.setDate(mondayDiff);
    monday.setHours(0, 0, 0, 0);

    // Use local date for comparison
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      dayDate.setHours(0, 0, 0, 0);
      
      // Format as YYYY-MM-DD in local time
      const year = dayDate.getFullYear();
      const month = String(dayDate.getMonth() + 1).padStart(2, '0');
      const day = String(dayDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const hasLog = logs.some(log => log.date === dateStr);
      const isPast = dayDate <= now;
      
      weeklyActivity.push({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        read: hasLog,
        isPast: isPast
      });
    }
    
    res.json({
      readingDays: logs.length,
      streak: streak || 0,
      booksRead: 12, // Mock or calculate if needed
      notesCount: await Note.count({ where: { UserId: req.params.id } }),
      favoriteGenres: ['Fiction', 'Literature'], // Mock
      weeklyActivity
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google Login / Register
app.post('/api/google-login', async (req, res) => {
  const { name, email, avatar } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      const hashedPassword = await bcrypt.hash('google-oauth-' + Date.now(), 10);
      user = await User.create({ name, email, password: hashedPassword, avatar });
    } else if (avatar) {
      user.avatar = avatar;
      await user.save();
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/user/:id', async (req, res) => {
  const { name, email, avatar, bio } = req.body;
  console.log('Update profile request for ID:', req.params.id, { name, email, bio: bio?.substring(0, 20) + '...' });
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      console.log('User not found in DB');
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    if (avatar) user.avatar = avatar;
    if (bio) user.bio = bio;
    
    await user.save();
    console.log('Profile updated successfully');
    res.json({ success: true, user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- NOTES ENDPOINTS ---

// Get all notes for a user
app.get('/api/notes/:userId', async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { UserId: req.params.userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save a new note
app.post('/api/notes', async (req, res) => {
  const { content, page, bookId, bookTitle, userId } = req.body;
  try {
    const note = await Note.create({
      content,
      page,
      bookId,
      bookTitle,
      UserId: userId
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    await note.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// ADMIN MIDDLEWARE
// ─────────────────────────────────────────
const isAdmin = async (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = await User.findByPk(userId);
    if (user && user.role === 'Admin') return next();
    return res.status(403).json({ error: 'Admins only' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// ─────────────────────────────────────────
// ADMIN — STATS
// ─────────────────────────────────────────
app.get('/api/admin/stats', isAdmin, async (req, res) => {
  try {
    const totalUsers    = await User.count();
    const totalBooks    = await Book.count();
    const totalCategories = await Category.count();
    const recentUsers   = await User.findAll({ order: [['createdAt', 'DESC']], limit: 5, attributes: ['id', 'name', 'email', 'role', 'createdAt'] });
    const recentBooks   = await Book.findAll({ order: [['createdAt', 'DESC']], limit: 5, attributes: ['id', 'title', 'author', 'createdAt'] });
    res.json({ totalUsers, totalBooks, totalCategories, recentUsers, recentBooks });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────
// ADMIN — USERS
// ─────────────────────────────────────────
app.get('/api/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'avatar', 'createdAt'], order: [['createdAt', 'DESC']] });
    res.json(users);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/users/:id/role', isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.role = req.body.role;
    await user.save();
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/users/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────
// ADMIN — BOOKS
// ─────────────────────────────────────────
app.get('/api/admin/books', isAdmin, async (req, res) => {
  try {
    const books = await Book.findAll({ order: [['createdAt', 'DESC']] });
    res.json(books);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/books', isAdmin, async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.json(book);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/books/:id', isAdmin, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    await book.update(req.body);
    res.json(book);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/books/:id', isAdmin, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    await book.destroy();
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────
// ADMIN — CATEGORIES
// ─────────────────────────────────────────
app.get('/api/admin/categories', isAdmin, async (req, res) => {
  try {
    const cats = await Category.findAll({ order: [['name', 'ASC']] });
    res.json(cats);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/categories', async (req, res) => {
  try {
    const cats = await Category.findAll({ order: [['name', 'ASC']] });
    res.json(cats);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/categories', isAdmin, async (req, res) => {
  try {
    const cat = await Category.create({ name: req.body.name });
    res.json(cat);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/categories/:id', isAdmin, async (req, res) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    cat.name = req.body.name;
    await cat.save();
    res.json(cat);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/categories/:id', isAdmin, async (req, res) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    await cat.destroy();
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Connect to DB and Start Server
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
