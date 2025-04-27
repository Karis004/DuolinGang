'use client';

import { Base, RedDiv, BlackDiv } from './eldoraui/panel';
import CantoneseTTS from './CantoneseTTS';
import DictDiv from './DictDiv';
import { useRef, forwardRef, useImperativeHandle } from 'react';

// Component wrapped with forwardRef so parent can access the TTS functionality
const Flashcard = forwardRef(({ currentWord }, ref) => {
    const ttsRef = useRef(null);
    
    // Expose speak method to parent component
    useImperativeHandle(ref, () => ({
        speak: (text) => {
            if (ttsRef.current) {
                ttsRef.current.speak(text || currentWord.word);
            }
        }
    }));

    if (!currentWord) {
        return <div>Loading...</div>;
    }
    
    return (
        <Base>
            <RedDiv>
                <p className="word text-3xl font-bold text-black p-1">
                    {currentWord.word}
                </p>
                <p className="pinyin text-xl text-gray-500 p-1">
                    {currentWord.pinyin}
                </p>
            </RedDiv>
            <p className="meaning text-lg pt-5">{currentWord.meaning}</p>
            <CantoneseTTS
                ref={ttsRef}
                text={currentWord.word}
                className="m-5"
            />
            <BlackDiv>
                <DictDiv currentWord={currentWord} />
            </BlackDiv>
        </Base>
    );
});

Flashcard.displayName = 'Flashcard';

export default Flashcard;