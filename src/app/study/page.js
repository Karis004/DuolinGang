'use client';

import Button from '../components/eldoraui/button';
import { Base, RedDiv, BlackDiv } from '../components/eldoraui/panel';
import CantoneseTTS from '../components/CantoneseTTS';
import DictDiv from '../components/DictDiv';
import { useState, useEffect, useRef } from 'react';
import Flashcard from '../components/Flashcard';

export default function StudyPage() {
  const [wordsData, setWordsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const ttsRef = useRef(null); // Reference to CantoneseTTS component

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

  // Listen for changes in currentWord and showAnswer, automatically trigger pronunciation
  const currentWord = wordsData[currentIndex];
  useEffect(() => {
    if (showAnswer && ttsRef.current && currentWord?.word) {
      ttsRef.current.speak();
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
          <Flashcard currentWord={currentWord} />
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
      <Button
        className="fixed bottom-10 left-3 m-4"
        variant="brutal"
        size="sm"
        href="/"
      >
        Back
      </Button>
    </div>
  );
}