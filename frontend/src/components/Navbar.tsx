import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentView = location.pathname;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                {/* Back Wing */}
                <ellipse cx="24" cy="14" rx="6" ry="10" transform="rotate(30 24 14)" className="fill-navy/20" />
                
                {/* Front Wing */}
                <ellipse cx="16" cy="14" rx="6" ry="10" transform="rotate(-30 16 14)" className="fill-navy/30" />
                
                {/* Stinger */}
                <path d="M8 24L2 24" strokeWidth="3" strokeLinecap="round" className="stroke-navy" />
                
                {/* Body */}
                <rect x="6" y="16" width="28" height="16" rx="8" className="fill-beered" />
                
                {/* Stripes */}
                <line x1="14" y1="16" x2="14" y2="32" strokeWidth="4" className="stroke-navy" />
                <line x1="22" y1="16" x2="22" y2="32" strokeWidth="4" className="stroke-navy" />
                
                {/* Eye */}
                <circle cx="28" cy="22" r="2.5" className="fill-navy" />
                <circle cx="29" cy="21" r="1" className="fill-white" />
                
                {/* Antennae */}
                <path d="M26 16 Q 28 8 32 10" strokeWidth="2.5" fill="none" strokeLinecap="round" className="stroke-navy" />
                <circle cx="32" cy="10" r="1.5" className="fill-navy" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-navy tracking-tight">Bee<span className="text-beered">Learn</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" onClick={scrollToTop} className={`font-semibold whitespace-nowrap transition-colors ${currentView === '/' ? 'text-beered' : 'text-navy hover:text-beered'}`}>Trang chủ</Link>
            <Link to="/about" onClick={scrollToTop} className={`font-semibold whitespace-nowrap transition-colors ${currentView === '/about' ? 'text-beered' : 'text-navy hover:text-beered'}`}>Giới thiệu</Link>
            <Link to="/courses" onClick={scrollToTop} className={`font-semibold whitespace-nowrap transition-colors ${currentView === '/courses' ? 'text-beered' : 'text-navy hover:text-beered'}`}>Khóa học</Link>
            <Link to="/library" onClick={scrollToTop} className={`font-semibold whitespace-nowrap transition-colors ${currentView === '/library' ? 'text-beered' : 'text-navy hover:text-beered'}`}>Thư viện</Link>
            <Link to="/achievements" onClick={scrollToTop} className={`font-semibold whitespace-nowrap transition-colors ${currentView === '/achievements' ? 'text-beered' : 'text-navy hover:text-beered'}`}>Bảng vàng</Link>
            <Link to="/careers" onClick={scrollToTop} className={`font-semibold whitespace-nowrap transition-colors ${currentView === '/careers' ? 'text-beered' : 'text-navy hover:text-beered'}`}>Tuyển dụng</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login" className="px-5 py-2.5 border-2 border-navy text-navy font-bold rounded-full hover:bg-navy hover:text-white transition-all whitespace-nowrap">Đăng nhập</Link>
            <Link to="/register" className="px-5 py-2.5 bg-navy text-white font-bold rounded-full hover:bg-opacity-90 transition-all shadow-md border-2 border-navy whitespace-nowrap">Đăng ký</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-navy p-2">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4"
        >
          <Link to="/" onClick={scrollToTop} className="block w-full text-left text-navy font-semibold py-2">Trang chủ</Link>
          <Link to="/about" onClick={scrollToTop} className="block w-full text-left text-navy font-semibold py-2">Giới thiệu</Link>
          <Link to="/courses" onClick={scrollToTop} className="block w-full text-left text-navy font-semibold py-2">Khóa học</Link>
          <Link to="/library" onClick={scrollToTop} className="block w-full text-left text-navy font-semibold py-2">Thư viện</Link>
          <Link to="/achievements" onClick={scrollToTop} className="block w-full text-left text-navy font-semibold py-2">Bảng vàng</Link>
          <Link to="/careers" onClick={scrollToTop} className="block w-full text-left text-navy font-semibold py-2">Tuyển dụng</Link>
          <div className="pt-4 flex flex-col gap-3">
            <Link to="/login" onClick={scrollToTop} className="w-full py-3 text-center text-navy font-bold border-2 border-navy rounded-xl">Đăng nhập</Link>
            <Link to="/register" onClick={scrollToTop} className="w-full py-3 text-center bg-navy text-white font-bold rounded-xl">Đăng ký</Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
