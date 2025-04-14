import clientPromise from './mongodb';
import bcrypt from 'bcryptjs';

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

// insert one
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

// 用户相关函数
export async function createUser(userData) {
    try {
        const client = await clientPromise;
        const db = client.db("WordsBook");
        const collection = db.collection('users');

        // 检查用户是否已存在
        const existingUser = await collection.findOne({ email: userData.email });
        if (existingUser) {
            return { error: '用户已存在' };
        }

        // 加密密码
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // 创建用户对象
        const newUser = {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            createdAt: new Date()
        };

        // 保存用户
        const result = await collection.insertOne(newUser);
        
        // 返回不含密码的用户信息
        const { password, ...userWithoutPassword } = newUser;
        return { user: userWithoutPassword };
    } catch (error) {
        console.error('创建用户出错:', error);
        return { error: '创建用户失败' };
    }
}

export async function getUserByEmail(email) {
    try {
        const client = await clientPromise;
        const db = client.db("WordsBook");
        const collection = db.collection('users');
        
        return await collection.findOne({ email });
    } catch (error) {
        console.error('获取用户信息失败:', error);
        return null;
    }
}

export async function getUserById(id) {
    try {
        const client = await clientPromise;
        const db = client.db("WordsBook");
        const collection = db.collection('users');
        
        const user = await collection.findOne({ _id: id });
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    } catch (error) {
        console.error('获取用户信息失败:', error);
        return null;
    }
}