import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, FlaskConical, Landmark, Heart, 
  Zap, Brain, Search, Rocket, 
  Globe, Scroll, Music, Users, Tag,
  Star, Coffee, Feather, Layers, Sun, Shield
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Icon + color map for known categories
const CATEGORY_STYLES = {
  'fiction':    { icon: BookOpen,    color: 'text-blue-500',    bg: 'bg-blue-500/10' },
  'science':    { icon: FlaskConical,color: 'text-green-500',   bg: 'bg-green-500/10' },
  'history':    { icon: Landmark,    color: 'text-orange-500',  bg: 'bg-orange-500/10' },
  'self-help':  { icon: Zap,         color: 'text-yellow-500',  bg: 'bg-yellow-500/10' },
  'mystery':    { icon: Search,      color: 'text-purple-500',  bg: 'bg-purple-500/10' },
  'sci-fi':     { icon: Rocket,      color: 'text-cyan-500',    bg: 'bg-cyan-500/10' },
  'romance':    { icon: Heart,       color: 'text-pink-500',    bg: 'bg-pink-500/10' },
  'philosophy': { icon: Brain,       color: 'text-indigo-500',  bg: 'bg-indigo-500/10' },
  'islamic':    { icon: Scroll,      color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  'travel':     { icon: Globe,       color: 'text-teal-500',    bg: 'bg-teal-500/10' },
  'arts':       { icon: Music,       color: 'text-rose-500',    bg: 'bg-rose-500/10' },
  'biography':  { icon: Users,       color: 'text-amber-500',   bg: 'bg-amber-500/10' },
  'thriller':   { icon: Shield,      color: 'text-red-500',     bg: 'bg-red-500/10' },
  'poetry':     { icon: Feather,     color: 'text-violet-500',  bg: 'bg-violet-500/10' },
  'comedy':     { icon: Sun,         color: 'text-lime-500',    bg: 'bg-lime-500/10' },
  'drama':      { icon: Star,        color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
  'cooking':    { icon: Coffee,      color: 'text-yellow-600',  bg: 'bg-yellow-600/10' },
  'technology': { icon: Layers,      color: 'text-sky-500',     bg: 'bg-sky-500/10' },
};

const FALLBACK = { icon: Tag, color: 'text-green-500', bg: 'bg-green-500/10' };

function getStyle(name) {
  return CATEGORY_STYLES[name.toLowerCase()] || FALLBACK;
}

export default function CategorySection() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleClick = (catName) => {
    navigate(`/?category=${catName.toLowerCase()}`);
  };

  if (loading) return null; // Don't flash empty section

  if (categories.length === 0) return null;

  return (
    <section id="category-section" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
            Browse by <span className="text-green-500 italic">Category</span>
          </h2>
          <p className="text-neutral-500 max-w-2xl">
            Explore {categories.length} genres across our entire library. Find your next favorite story.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const style = getStyle(cat.name);
            const IconComp = style.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleClick(cat.name)}
                className={`group p-6 rounded-2xl border transition-all duration-300 text-left hover:scale-[1.03] cursor-pointer ${
                  theme === 'dark' 
                  ? 'bg-[#111111] border-white/5 hover:border-green-500/40 hover:bg-white/5' 
                  : 'bg-neutral-50 border-neutral-200 hover:border-green-500 hover:shadow-lg hover:bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${style.bg}`}>
                  <IconComp className={style.color} size={20} />
                </div>
                <h3 className={`text-sm font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-500">Browse books</p>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
