import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, List, Tag, 
  AlertCircle, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => { setCategories(data); setLoading(false); });
  };

  const addCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    fetch('http://localhost:5000/api/admin/categories', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'user-id': user.id 
      },
      body: JSON.stringify({ name: newCategory })
    }).then(() => {
      setNewCategory('');
      fetchCategories();
    });
  };

  const deleteCategory = (id) => {
    if (!window.confirm('Delete this category? This might affect books in this category.')) return;
    fetch(`http://localhost:5000/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: { 'user-id': user.id }
    }).then(() => fetchCategories());
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Category Management</h1>
        <p className="text-neutral-500 text-sm">Organize your library by creating and managing genres.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Add Category Form */}
        <div className="md:col-span-1">
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#111111] border-white/5' : 'bg-white border-neutral-200'}`}>
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Plus size={18} className="text-green-500" />
              New Category
            </h2>
            <form onSubmit={addCategory} className="space-y-4">
              <input 
                type="text" 
                placeholder="Category Name" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className={`w-full p-3 rounded-xl border outline-none focus:ring-2 ring-green-500 ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-neutral-200'}`}
              />
              <button type="submit" className="primary-button w-full">
                Add Category
              </button>
            </form>
          </div>
          
          <div className="mt-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-3">
            <AlertCircle className="text-orange-500 shrink-0" size={20} />
            <p className="text-xs text-orange-200/80 leading-relaxed">
              Deletions are permanent. Ensure no books are actively assigned to a category before removing it.
            </p>
          </div>
        </div>

        {/* Categories List */}
        <div className="md:col-span-2">
          <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-[#111111] border-white/5' : 'bg-white border-neutral-200'}`}>
            <div className="p-4 border-b border-white/5 bg-white/5">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Active Categories ({categories.length})</p>
            </div>
            <div className="divide-y divide-white/5">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                      <Tag size={16} />
                    </div>
                    <span className="font-semibold">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => deleteCategory(c.id)}
                      className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                    <ChevronRight size={16} className="text-neutral-700" />
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="p-12 text-center text-neutral-500">
                  <List size={48} className="mx-auto mb-4 opacity-10" />
                  <p>No categories created yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
