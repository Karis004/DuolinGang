'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Button from './eldoraui/button';

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

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
            <span className="hidden md:inline">你好，{session.user.name}</span>
            <Button 
              variant="white" 
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              退出登录
            </Button>
          </div>
        ) : (
          <div className="space-x-2">
            <Link href="/login">
              <Button variant="white" size="sm">登录</Button>
            </Link>
            <Link href="/register">
              <Button variant="brutal" size="sm">注册</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}