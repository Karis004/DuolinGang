'use client';

import { useState, useEffect } from 'react';

export default function WordScatter({ data }) {
  const [visibleWords, setVisibleWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);

  // 检查两个矩形是否重叠
  const checkOverlap = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  // 获取随机位置并确保不重叠
  const getRandomPosition = (existingPositions, wordWidth, wordHeight) => {
    const maxAttempts = 30;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const newPos = {
        x: Math.random() * (window.innerWidth - wordWidth),
        y: Math.random() * (window.innerHeight - wordHeight),
        width: wordWidth,
        height: wordHeight
      };

      let overlaps = false;
      for (const pos of existingPositions) {
        if (checkOverlap(newPos, pos)) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        return newPos;
      }
      attempts++;
    }
    
    // 如果多次尝试后仍重叠，返回一个默认位置
    return {
      x: Math.random() * (window.innerWidth - wordWidth),
      y: Math.random() * (window.innerHeight - wordHeight),
      width: wordWidth,
      height: wordHeight
    };
  };

  // 初始化时分割数据并设置位置
  useEffect(() => {
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    const initialWords = shuffled.slice(0, 5);
    const positions = [];
    
    const wordsWithPosition = initialWords.map(word => {
      const pos = getRandomPosition(positions, word.word.length * 20+48, 58);
      console.log(word,pos);
      positions.push(pos);
      return { ...word, position: pos };
    });

    setVisibleWords(wordsWithPosition);
    setRemainingWords(shuffled.slice(5));
  }, [data]);

  const handleWordClick = (wordObj) => {
    setSelectedWord(wordObj);
    
    setTimeout(() => {
      setSelectedWord(null);
      if (remainingWords.length > 0) {
        setVisibleWords((prev) => {
          const currentPositions = prev.map(w => w.position);
          const newVisible = prev.filter(w => w.word !== wordObj.word);
          const nextWord = remainingWords[0];
          const newPos = getRandomPosition(currentPositions);
          
          setRemainingWords(prev => prev.slice(1));
          return [...newVisible, { ...nextWord, position: newPos }];
        });
      }
    }, 2000);
  };

  return (
    <div className="relative h-screen w-screen p-10">
      {visibleWords.map((item, index) => (
        <div
          key={item.word}
          className="absolute cursor-pointer transition-all duration-300 hover:scale-110"
          style={{
            left: `${item.position.x}px`,
            top: `${item.position.y}px`,
          }}
          onClick={() => handleWordClick(item)}
        >
          <span className="text-xl font-medium text-gray-800 bg-white px-6 py-4 rounded shadow">
            {item.word}
          </span>
          {selectedWord?.word === item.word && (
            <div className="absolute mt-2 bg-gray-100 p-2 rounded animate-fade-in">
              {item.meaning}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}