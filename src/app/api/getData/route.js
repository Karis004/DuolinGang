// pages/api/getData.js
import clientPromise from '../../lib/mongodb';

export async function GET(request) {
    const client = await clientPromise;
    const db = client.db('WordsBook');
    const collection = db.collection('Words');

    const data = await collection.find({}, {
        projection: {
            _id: 0,           // 不返回 _id 字段
            pinyin: 1,        // 返回 pinyin 字段
            word: 1,     // 返回 character 字段
            meaning: 1        // 返回 meaning 字段
        }
    }).toArray();

    return new Response(JSON.stringify(data), {
        status: 200,
    });
}