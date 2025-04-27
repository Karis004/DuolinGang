'use client';

import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import Image from 'next/image';
import { cn } from '../lib/utils';

const CantoneseTTS = forwardRef(({ text, className, iconSize = 32 }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    
    // Convert text to speech using server API
    const speakCantonese = async (textToSpeak = text) => {
        if (isPlaying) return;
        
        try {
            setIsPlaying(true);
            
            // Call server API to get audio data
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToSpeak }),
            });
            
            if (!response.ok) {
                throw new Error('TTS synthesis failed');
            }
            
            // Get audio binary data and create URL
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Create or reuse audio element
            if (!audioRef.current) {
                audioRef.current = new Audio();
                audioRef.current.onended = () => setIsPlaying(false);
                audioRef.current.onerror = () => setIsPlaying(false);
            }
            
            // Set audio source and play
            audioRef.current.src = audioUrl;
            await audioRef.current.play();
        } catch (error) {
            console.error("TTS Error:", error);
            setIsPlaying(false);
        }
    };

    // Expose speak method to parent component
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