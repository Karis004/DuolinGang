'use client';

import Button from '../components/eldoraui/button';
import { Base, RedDiv, BlackDiv } from '../components/eldoraui/panel';
import DictDiv from '../components/DictDiv';
import { useState, useEffect, useRef } from 'react';
import Flashcard from '../components/Flashcard';

export default function StudyPage() {
  const [wordsData, setWordsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const flashcardRef = useRef(null); // 改为引用Flashcard组件

  useEffect(() => {
    const fetchRandomWords = async () => {
      try {
        const limit = 5;
        const response = await fetch(`/api/randomwords?limit=${limit}`);

        if (!response.ok) {
          throw new Error('Failed to fetch words');
        }

        const data = await response.json();
        setWordsData(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomWords();
  }, []);

  // 监听当前单词和showAnswer变化，自动触发发音
  const currentWord = wordsData[currentIndex];
  useEffect(() => {
    if (showAnswer && flashcardRef.current && currentWord?.word) {
      // 使用短暂延迟确保组件已完全渲染
      const timer = setTimeout(() => {
        flashcardRef.current.speak();
      }, 10);
      
      return () => clearTimeout(timer);
    }
  }, [currentWord, showAnswer]);

  const handleCardClick = () => {
    if (!showAnswer) {
      setTimeout(() => setShowAnswer(true), 100);
    } else {
      setTimeout(() => {
        setShowAnswer(false);
        setCurrentIndex((prevIndex) =>
          prevIndex === wordsData.length - 1 ? 0 : prevIndex + 1
        );
      }, 100);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!wordsData.length) {
    return <div>No words found</div>;
  }

  return (
    <div className="word-card-container">
      {!showAnswer ? (
        <Button
          className="word-card"
          onClick={handleCardClick}
          variant="brutal"
        >
          <div className="meaning">
            <p>{currentWord.meaning}</p>
          </div>
        </Button>
      ) : (
        <div className="answer">
          <Flashcard ref={flashcardRef} currentWord={currentWord} />
          <Button
            onClick={handleCardClick}
            variant="white"
            className="w-[85vw] max-w-[450px]"
          >
            Next
          </Button>
        </div>
      )}

      <div className="progress mt-4">
        {currentIndex + 1} / {wordsData.length}
      </div>
    </div>
  );
}