'use client';

import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import Image from 'next/image';
import { cn } from '../lib/utils';

const CantoneseTTS = forwardRef(({ text, className, iconSize = 32 }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    
    // 使用服务器API进行文本转语音
    const speakCantonese = async (textToSpeak = text) => {
        if (isPlaying) return;
        
        try {
            setIsPlaying(true);
            
            // 调用服务器API获取音频数据
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: textToSpeak }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '语音合成失败');
            }
            
            // 获取音频二进制数据
            const audioBlob = await response.blob();
            
            // 创建一个音频URL
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // 创建或重用音频元素
            if (!audioRef.current) {
                audioRef.current = new Audio();
                
                // 音频播放结束后的处理
                audioRef.current.onended = () => {
                    setIsPlaying(false);
                };
                
                // 音频播放错误处理
                audioRef.current.onerror = (e) => {
                    console.error("音频播放错误:", e);
                    setIsPlaying(false);
                };
            }
            
            // 设置音频来源并播放
            audioRef.current.src = audioUrl;
            
            // 播放音频
            await audioRef.current.play();
            
            console.log("TTS 播放开始");
        } catch (error) {
            console.error("TTS 错误:", error);
            setIsPlaying(false);
        }
    };

    // 向父组件暴露 speak 方法
    useImperativeHandle(ref, () => ({
        speak: speakCantonese,
    }));

    return (
        <div className={cn('flex justify-center items-center', className)}>
            <Image
                src='/images/sound.png'
                alt='Play Cantonese'
                width={iconSize}
                height={iconSize}
                onClick={() => speakCantonese()}
                style={{ 
                    cursor: isPlaying ? 'default' : 'pointer',
                    opacity: isPlaying ? 0.6 : 1 
                }}
            />
        </div>
    );
});

CantoneseTTS.displayName = 'CantoneseTTS';

export default CantoneseTTS;