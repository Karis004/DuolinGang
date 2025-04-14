import clientPromise from './mongodb';

// get all
export async function getWordsData({ limit = 500, filter = {} } = {}) {
    const client = await clientPromise;
    const db = client.db('WordsBook');
    const collection = db.collection('Words');

    const data = await collection.find(filter, {
        projection: {
            _id: 0,
            pinyin: 1,
            word: 1,
            meaning: 1,
        }
    }).limit(limit).toArray();

    return data;
}

const { Converter } = require('opencc-js');
const toTraditional = new Converter({ from: 'cn', to: 'hk' });
async function searchAndFormatWord(word, db) {
    const dictCollection = db.collection('Dict');
    const traditionalWord = toTraditional(word);
    const dictEntry = await dictCollection.findOne({ [traditionalWord]: { $exists: true } });

    if (dictEntry && dictEntry[traditionalWord]) {
        const wordData = dictEntry[traditionalWord];
        return {
            pinyin: wordData.pinyin || '',
            meaning: wordData.meanings || [],
            examples: wordData.examples || [], 
            word: traditionalWord,
        };
    }
    return null;
}

export async function insertWordData(wordData) {
    const client = await clientPromise;
    const db = client.db('WordsBook');
    const collection = db.collection('Words');

    // 尝试从 Dict 集合中搜索
    const dictData = await searchAndFormatWord(wordData.word, db);

    // 准备插入的数据
    let dataToInsert = {
        word: wordData.word,
        pinyin: wordData.pinyin,
        meaning: wordData.meaning,
        meanings: "",
        examples: [],
        times: wordData.times || 0,
    };

    // 如果在 Dict 集合中找到，覆盖 pinyin 和 meaning，添加 examples
    if (dictData) {
        dataToInsert = {
            word: dictData.word,
            pinyin: dictData.pinyin,
            meaning: wordData.meaning,
            meanings: dictData.meaning,
            examples: dictData.examples,
            times: wordData.times || 0,
        };
    }

    const result = await collection.insertOne(dataToInsert);
    return result; 
}


// get random
export async function getRandomData({ limit = 5, filter = {} } = {}) {
    const client = await clientPromise;
    const db = client.db('WordsBook');
    const collection = db.collection('Words');

    const data = await collection.find(filter, {
        projection: {
            _id: 0,
            pinyin: 1,
            word: 1,
            meaning: 1,
            meanings: 1,
            examples: 1,
            times: 1
        }
    }).toArray();
    data.sort((a, b) => a.times - b.times);
    const totalTimes = data.reduce((sum, item) => sum + item.times, 0);
    const randomData = data.filter(item => Math.random() * totalTimes >= item.times).slice(0, limit);
    for (let i = randomData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomData[i], randomData[j]] = [randomData[j], randomData[i]];
    }
    return randomData;
}

// search one word
export async function searchOneWord(word) {
    const decodedWord = decodeURIComponent(word);
    const client = await clientPromise;
    const db = client.db('WordsBook');
    const collection = db.collection('Words');

    const data = await collection.findOne({ word: decodedWord }, {
        projection: {
            _id: 0,
            pinyin: 1,
            word: 1,
            meaning: 1,
            meanings: 1,
            examples: 1,
            times: 1
        }
    });

    return data;
}