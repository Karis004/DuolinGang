'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Button from './eldoraui/button';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Get the initial letter of user's name
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center px-4 py-3 bg-white shadow-md">
      <Link href="/" className="font-bold text-xl">
        DuolinGang
      </Link>
      
      <div>
        {isLoading ? (
          <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
        ) : session ? (
          <div ref={menuRef} className="relative">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium shadow-md hover:shadow-lg transition-all">
                {getInitial(session.user.name)}
              </div>
              <span className="ml-2 hidden md:inline">{session.user.name}</span>
            </div>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                </div>
                
                <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Home
                </Link>
                <Link href="/import" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Add Word
                </Link>
                <Link href="/list" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Word List
                </Link>
                <Link href="/study" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Study
                </Link>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <div className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer">
                    <Link href="https://github.com/Karis004/DuolinGang">
                      Github
                    </Link>
                    <div className="text-xs text-gray-400">v1.1.0</div>
                  </div>
                </div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-x-2">
            <Link href="/login">
              <Button variant="white" size="sm">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="brutal" size="sm">Register</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}