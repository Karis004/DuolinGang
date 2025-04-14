import React from 'react';
import CantoneseTTS from './CantoneseTTS';

const DictDiv = ({ currentWord }) => {
  return (
    <div className="text-left">
      {/* 渲染 meanings */}
      <div className="p-1">
        <p>词典释义：</p>
        {currentWord.meanings && currentWord.meanings.length > 0 ? (
          <p className="text-base text-gray-700">
            {currentWord.meanings.map((meaning, index) => `${meaning}`).join('；')}
          </p>
        ) : (
          <p className="text-base text-gray-500 italic">暂无含义</p>
        )}
      </div>

      {/* 渲染 examples */}
      <div className="p-1">
      <br></br>
      <p>例句：</p>
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
          <p className="text-base text-gray-500 italic">暂无例句</p>
        )}
      </div>
    </div>
  );
};

export default DictDiv;