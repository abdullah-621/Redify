import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Trash2, Edit, Book, 
  Upload, X, Loader2, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    title: '', author: '', category: '', description: '',
    coverUrl: '', publishedYear: '', pages: ''
  });

  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = () => {
    fetch('http://localhost:5000/api/books')
      .then(res => res.json())
      .then(data => { setBooks(data); setLoading(false); });
  };

  const fetchCategories = () => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingBook 
      ? `http://localhost:5000/api/admin/books/${editingBook.id}`
      : 'http://localhost:5000/api/admin/books';
    
    fetch(url, {
      method: editingBook ? 'PUT' : 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'user-id': user.id 
      },
      body: JSON.stringify(formData)
    }).then(() => {
      setIsModalOpen(false);
      setEditingBook(null);
      setFormData({ title: '', author: '', category: '', description: '', coverUrl: '', publishedYear: '', pages: '' });
      fetchBooks();
    });
  };

  const deleteBook = (id) => {
    if (!window.confirm('Delete this book?')) return;
    fetch(`http://localhost:5000/api/admin/books/${id}`, {
      method: 'DELETE',
      headers: { 'user-id': user.id }
    }).then(() => fetchBooks());
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Book Inventory</h1>
          <p className="text-neutral-500 text-sm">Manage your library's content and metadata.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${theme === 'dark' ? 'bg-[#111111] border-white/5' : 'bg-white border-neutral-200'}`}>
            <Search size={18} className="text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search books..." 
              className="bg-transparent border-none outline-none text-sm w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setEditingBook(null); setIsModalOpen(true); }}
            className="primary-button"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Book</span>
          </button>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBooks.map(b => (
          <div key={b.id} className={`group relative rounded-2xl border overflow-hidden transition-all hover:shadow-xl ${theme === 'dark' ? 'bg-[#111111] border-white/5' : 'bg-white border-neutral-200'}`}>
            <div className="aspect-[3/4] overflow-hidden">
              <img src={b.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  onClick={() => { setEditingBook(b); setFormData(b); setIsModalOpen(true); }}
                  className="p-3 bg-white text-black rounded-xl hover:scale-110 transition-transform"
                >
                  <Edit size={20} />
                </button>
                <button 
                  onClick={() => deleteBook(b.id)}
                  className="p-3 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold truncate">{b.title}</h3>
              <p className="text-xs text-neutral-500 mt-1">{b.author}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                  {b.category}
                </span>
                <span className="text-xs text-neutral-500">{b.publishedYear}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 ${theme === 'dark' ? 'bg-[#111111] text-white' : 'bg-white text-neutral-900'}`}>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-8">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-400">Title</label>
                  <input 
                    required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full p-3 rounded-xl border focus:ring-2 ring-green-500 outline-none ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-neutral-200'}`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-400">Author</label>
                  <input 
                    required type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })}
                    className={`w-full p-3 rounded-xl border focus:ring-2 ring-green-500 outline-none ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-neutral-200'}`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-400">Category</label>
                  <select 
                    required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full p-3 rounded-xl border focus:ring-2 ring-green-500 outline-none ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-neutral-200'}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-400">Published Year</label>
                  <input 
                    type="text" value={formData.publishedYear} onChange={e => setFormData({ ...formData, publishedYear: e.target.value })}
                    className={`w-full p-3 rounded-xl border focus:ring-2 ring-green-500 outline-none ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-neutral-200'}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-400">Description</label>
                <textarea 
                  rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full p-3 rounded-xl border focus:ring-2 ring-green-500 outline-none resize-none ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-neutral-200'}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-400">Cover Image</label>
                <div className={`relative w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden ${theme === 'dark' ? 'border-white/10 hover:border-green-500/50' : 'border-neutral-300 hover:border-green-500'}`}>
                  {formData.coverUrl ? (
                    <>
                      <img src={formData.coverUrl} className="w-full h-full object-cover" />
                      <button 
                        type="button" onClick={() => setFormData({ ...formData, coverUrl: '' })}
                        className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={48} className="text-neutral-600 mb-2" />
                      <p className="text-sm text-neutral-500">Drag & drop or click to upload</p>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </>
                  )}
                </div>
              </div>

              <button type="submit" className="primary-button w-full py-4 text-lg">
                {editingBook ? 'Save Changes' : 'Create Book Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
