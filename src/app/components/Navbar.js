'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Button from './eldoraui/button';

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  // 获取用户名首字母的函数
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <nav className="flex justify-between items-center px-4 py-3 bg-white shadow-md">
      <div>
        <Link href="/" className="font-bold text-xl">
          DuolinGang
        </Link>
      </div>
      
      <div>
        {isLoading ? (
          <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
        ) : session ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                {getInitial(session.user.name)}
              </div>
              <span className="ml-2 hidden md:inline">{session.user.name}</span>
            </div>
            <Button 
              variant="white" 
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Sign Out
            </Button>
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