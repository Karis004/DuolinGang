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

// 从 MongoDB 的 Dict 集合中搜索词语
async function searchAndFormatWord(word, db) {
    const dictCollection = db.collection('Dict');
    // 使用 $exists 查询文档中是否存在以词语为字段名的键
    const dictEntry = await dictCollection.findOne({ [word]: { $exists: true } });

    if (dictEntry && dictEntry[word]) {
        const wordData = dictEntry[word];
        return {
            pinyin: wordData.pinyin || '', // 发音
            meaning: wordData.meanings || [], // 粤语含义（字符串数组）
            examples: wordData.examples || [] // 例句（包含 yue 和 pinyin）
        };
    }
    return null; // 未找到
}

// 插入词语数据到 MongoDB
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
            word: wordData.word,
            pinyin: dictData.pinyin, // 使用 Dict 的发音
            meaning: wordData.meaning,
            meanings: dictData.meaning,
            examples: dictData.examples, // 添加例句
            times: wordData.times || 0,
        };
    }

    // 插入到数据库
    const result = await collection.insertOne(dataToInsert);
    return result; // 返回插入结果
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
    const client = await clientPromise;
    const db = client.db('WordsBook');
    const collection = db.collection('Words');

    const data = await collection.findOne({ word: word }, {
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