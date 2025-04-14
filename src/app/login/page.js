'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '../components/eldoraui/button';
import Input from '../components/eldoraui/input';
import { Panel } from '../components/eldoraui/panel';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result.error) {
        setError('邮箱或密码错误');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('登录失败，请重试');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Panel>
        <h1 className="text-2xl font-bold mb-6 text-center">登录</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              邮箱
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              密码
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full"
            />
          </div>
          
          <Button 
            variant="brutal" 
            className="w-full" 
            type="submit"
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p>
            还没有账号？{' '}
            <Link href="/register" className="text-blue-500 hover:underline">
              注册
            </Link>
          </p>
        </div>
        
        <Button
          className="mt-6"
          variant="white"
          size="sm"
          href="/"
        >
          返回主页
        </Button>
      </Panel>
    </div>
  );
}