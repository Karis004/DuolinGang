'use client';

import { Base, RedDiv, BlackDiv } from './eldoraui/panel';
import CantoneseTTS from './CantoneseTTS';
import DictDiv from './DictDiv';
import { useEffect, useRef } from 'react';

export default function Flashcard({ currentWord }) {
    const ttsRef = useRef(null);
    const hasSpeakenRef = useRef({});
    
    useEffect(() => {
        if (currentWord && ttsRef.current && !hasSpeakenRef.current[currentWord.word]) {
            // 使用 setTimeout 防止多次调用
            setTimeout(() => {
                ttsRef.current.speak(currentWord.word);
                hasSpeakenRef.current[currentWord.word] = true;
            }, 0);
        }
    }, [currentWord]);

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
}