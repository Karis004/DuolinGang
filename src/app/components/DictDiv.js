import React from 'react';
import CantoneseTTS from './CantoneseTTS';

const DictDiv = ({ currentWord }) => {
  return (
    <div className="text-left">
      {/* Render meanings */}
      <div className="p-1">
        <p>Dictionary Definition:</p>
        {currentWord.meanings && currentWord.meanings.length > 0 ? (
          <p className="text-base text-gray-700">
            {currentWord.meanings.map((meaning, index) => `${meaning}`).join('；')}
          </p>
        ) : (
          <p className="text-base text-gray-500 italic">No meanings available</p>
        )}
      </div>

      {/* Render examples */}
      <div className="p-1">
      <br></br>
      <p>Examples:</p>
        {currentWord.examples && currentWord.examples.length > 0 ? (
          <ul className="mt-2 space-y-3">
            {currentWord.examples.map((example, index) => (
              <li key={index} className="text-gray-700">
                <div className='flex'>
                <span className="font-medium text-gray-900 flex-1">{index + 1}.{" "}{example.yue}</span>
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