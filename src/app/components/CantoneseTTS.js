'use client';

import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import { cn } from '../lib/utils';

const CantoneseTTS = forwardRef(({ text, className, iconSize = 32 }, ref) => {
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setIsSupported(true);
        }
    }, []);

    const speakCantonese = (textToSpeak = text) => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            console.error('Web Speech API not supported');
            return;
        }
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'zh-HK';
        synth.speak(utterance);
    };

    // 暴露 speak 方法给父组件
    useImperativeHandle(ref, () => ({
        speak: speakCantonese,
    }));

    return (
        <div className={cn('flex justify-center items-center', className)}>
            {isSupported ? (
                <Image
                    src='/images/sound.png'
                    alt='Play Cantonese'
                    width={iconSize}
                    height={iconSize}
                    onClick={() => speakCantonese()}
                    style={{ cursor: 'pointer' }}
                />
            ) : (
                <p>x</p>
            )}
        </div>
    );
});

CantoneseTTS.displayName = 'CantoneseTTS';

export default CantoneseTTS;