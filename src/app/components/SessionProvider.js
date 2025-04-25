'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export function SessionProvider({ children }) {
  return (
    <NextAuthSessionProvider 
      refetchInterval={5 * 60} // 每5分钟自动刷新会话
      refetchOnWindowFocus={true} // 当窗口重新获得焦点时刷新会话
    >
      {children}
    </NextAuthSessionProvider>
  );
}