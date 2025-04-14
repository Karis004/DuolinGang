'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../components/eldoraui/button';
import Input from '../components/eldoraui/input';
import { Panel } from '../components/eldoraui/panel';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // 简单验证
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '注册失败');
      }
      
      // 注册成功，跳转到登录页
      router.push('/login?registered=true');
    } catch (err) {
      setError(err.message);
      console.error('注册错误:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Panel>
        <h1 className="text-2xl font-bold mb-6 text-center">注册账号</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              用户名
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入用户名"
              required
              className="w-full"
            />
          </div>
          
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
              minLength={6}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              确认密码
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full"
            />
          </div>
          
          <Button 
            variant="brutal" 
            className="w-full" 
            type="submit"
            disabled={loading}
          >
            {loading ? '注册中...' : '注册'}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p>
            已有账号？{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              登录
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