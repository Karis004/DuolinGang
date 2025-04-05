'use client';

import Button from "../components/eldoraui/button";
import { useState, useEffect } from 'react';

export default function StudyPage() {
    const [wordsData, setWordsData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
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
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchRandomWords();
    }, []);
  
    const handleCardClick = () => {
      if (!showAnswer) {
        setShowAnswer(true);
      } else {
        setShowAnswer(false);
        setCurrentIndex((prevIndex) => 
          prevIndex === wordsData.length - 1 ? 0 : prevIndex + 1
        );
      }
    };
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (!wordsData.length) {
      return <div>No words found</div>;
    }
  
    const currentWord = wordsData[currentIndex];
  
    return (
      <div className="word-card-container">
        <Button className="word-card" onClick={handleCardClick}  variant="brutal" >
          {!showAnswer ? (
            <div className="meaning">
              <p>{currentWord.meaning}</p>
              <p>Click to show answer</p>
            </div>
          ) : (
            <div className="answer">
              <p className="word">{currentWord.word}</p>
              <p className="pinyin">{currentWord.pinyin}</p>
              <p>Click for next word</p>
            </div>
          )}
        </Button>
        <div className="progress">
          {currentIndex + 1} / {wordsData.length}
        </div>
      </div>
    );
  }