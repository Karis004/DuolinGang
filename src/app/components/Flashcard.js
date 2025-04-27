'use client';

import { Base, RedDiv, BlackDiv } from './eldoraui/panel';
import CantoneseTTS from './CantoneseTTS';
import DictDiv from './DictDiv';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

// 使用forwardRef包装组件，这样父组件可以获取对TTS组件的引用
const Flashcard = forwardRef(({ currentWord }, ref) => {
    const ttsRef = useRef(null);
    
    // 将tts的speak方法暴露给父组件
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