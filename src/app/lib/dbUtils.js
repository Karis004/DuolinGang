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

// insert
export async function insertWordData(wordData) {
    const client = await clientPromise;
    const db = client.db('WordsBook');
    const collection = db.collection('Words');

    const result = await collection.insertOne(wordData);
    return result; // 返回插入结果（包含 insertedId 等信息）
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