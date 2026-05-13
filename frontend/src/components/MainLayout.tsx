import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BeeBotChat } from './BeeBotChat';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-beered selection:text-white">
      <Navbar />
      
      <main className="grow">
        <Outlet />
      </main>

      <Footer />

      {/* BeeBot AI Chatbot */}
      <BeeBotChat />
    </div>
  );
}
