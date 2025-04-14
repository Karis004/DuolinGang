'use client';

import { Base, RedDiv, BlackDiv } from './eldoraui/panel';
import CantoneseTTS from './CantoneseTTS';
import DictDiv from './DictDiv';
import { useEffect, useRef } from 'react';

export default function Flashcard({ currentWord }) {
    const ttsRef = useRef(null);

    useEffect(() => {
        if (currentWord && ttsRef.current) {
            ttsRef.current.speak(currentWord.word);
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