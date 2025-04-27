import React from 'react';
import CantoneseTTS from './CantoneseTTS';

const DictDiv = ({ currentWord }) => {
  // Extract meanings and examples from currentWord
  const { meanings = [], examples = [] } = currentWord;
  
  return (
    <div className="text-left">
      {/* Dictionary definitions section */}
      <div className="p-1">
        <p>Dictionary Definition:</p>
        {meanings.length > 0 ? (
          <p className="text-base text-gray-700">
            {meanings.join('；')}
          </p>
        ) : (
          <p className="text-base text-gray-500 italic">No meanings available</p>
        )}
      </div>

      {/* Examples section */}
      <div className="p-1 mt-2">
        <p>Examples:</p>
        {examples.length > 0 ? (
          <ul className="mt-2 space-y-3">
            {examples.map((example, index) => (
              <li key={index} className="text-gray-700">
                <div className='flex'>
                  <span className="font-medium text-gray-900 flex-1">{index + 1}. {example.yue}</span>
                  <CantoneseTTS text={example.yue} className="flex-shrink-0" iconSize={24}/>
                </div>
                <p className="text-sm text-gray-600 italic mt-1">{example.pinyin}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-base text-gray-500 italic">No examples available</p>
        )}
      </div>
    </div>
  );
};

export default DictDiv;