'use client';

import Flashcard from '../../components/Flashcard';
import Button from '../../components/eldoraui/button';
import { useEffect, useRef } from 'react';

// 客户端组件来包装服务端获取的数据
export default function FlashcardClient({ currentWord }) {
    const flashcardRef = useRef(null);
    
    // 当组件挂载或单词变化时播放语音
    useEffect(() => {
        if (flashcardRef.current && currentWord) {
            console.log('1');
            // 短暂延迟，确保组件完全渲染
            const timer = setTimeout(() => {
                console.log('2');
                flashcardRef.current.speak();
            }, 10);
            
            return () => clearTimeout(timer);
        }
    }, [currentWord]);
    
    if (!currentWord) {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-4">
                    Word not found or does not belong to current user
                </div>
                <Button 
                    variant="brutal"
                    size="sm"
                    href="/list"
                >
                    Back to Word List
                </Button>
            </div>
        );
    }

    return (
        <div>
            <Flashcard ref={flashcardRef} currentWord={currentWord} />
        </div>
    );
}