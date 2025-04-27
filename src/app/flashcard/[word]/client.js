'use client';

import Flashcard from '../../components/Flashcard';
import Button from '../../components/eldoraui/button';
import { useEffect, useRef } from 'react';

// Client component to wrap server-fetched data
export default function FlashcardClient({ currentWord }) {
    const flashcardRef = useRef(null);
    
    // Play audio when component mounts or word changes
    useEffect(() => {
        if (flashcardRef.current && currentWord) {
            // Short delay to ensure component is fully rendered
            const timer = setTimeout(() => {
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