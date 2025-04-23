import clientPromise from './mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

// Modified getWordsData function, added user ID filter
export async function getWordsData({ limit = 500, filter = {}, userId = null } = {}) {
    const client = await clientPromise;
    const db = client.db('WordsBook');
    const collection = db.collection('Words');

    // If userID is provided, add it to the filter conditions
    if (userId) {
        filter.userId = userId;
    }

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

// Modified insertWordData function, added user ID
export async function insertWordData(wordData, userId = null) {
    const client = await clientPromise;
    const db = client.db('WordsBook');
    const collection = db.collection('Words');

    // Try to search from Dict collection
    const dictData = await searchAndFormatWord(wordData.word, db);

    // Prepare data to insert
    let dataToInsert = {
        word: wordData.word,
        pinyin: wordData.pinyin,
        meaning: wordData.meaning,
        meanings: "",
        examples: [],
        times: wordData.times || 0,
        // Add user ID field
        userId: userId
    };

    // If found in Dict collection, override pinyin and meaning, add examples
    if (dictData) {
        dataToInsert = {
            word: dictData.word,
            pinyin: dictData.pinyin,
            meaning: wordData.meaning,
            meanings: dictData.meaning,
            examples: dictData.examples,
            times: wordData.times || 0,
            // Add user ID field
            userId: userId
        };
    }

    const result = await collection.insertOne(dataToInsert);
    return result; 
}

// Modified function to get random words, added user ID filter
export async function getRandomData({ limit = 5, filter = {}, userId = null } = {}) {
    const client = await clientPromise;
    const db = client.db('WordsBook');
    const collection = db.collection('Words');

    // If userID is provided, add it to the filter conditions
    if (userId) {
        filter.userId = userId;
    }

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

// Modified function to search for a single word, added user ID verification
export async function searchOneWord(word, userId = null) {
    const decodedWord = decodeURIComponent(word);
    const client = await clientPromise;
    const db = client.db('WordsBook');
    const collection = db.collection('Words');

    const query = { word: decodedWord };
    if (userId) {
        query.userId = userId;
    }

    const data = await collection.findOne(query, {
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

// User-related functions
export async function createUser(userData) {
    try {
        const client = await clientPromise;
        const db = client.db("WordsBook");
        const collection = db.collection('users');

        // Check if user already exists
        const existingUser = await collection.findOne({ email: userData.email });
        if (existingUser) {
            return { error: 'User already exists' };
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // Create user object
        const newUser = {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            createdAt: new Date()
        };

        // Save user
        const result = await collection.insertOne(newUser);
        
        // Return user info without password
        const { password, ...userWithoutPassword } = newUser;
        return { user: userWithoutPassword };
    } catch (error) {
        console.error('Error creating user:', error);
        return { error: 'Failed to create user' };
    }
}

export async function getUserByEmail(email) {
    try {
        const client = await clientPromise;
        const db = client.db("WordsBook");
        const collection = db.collection('users');
        
        return await collection.findOne({ email });
    } catch (error) {
        console.error('Failed to get user information:', error);
        return null;
    }
}

export async function getUserById(id) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('users');
        
        const objectId = typeof id === 'string' ? new ObjectId(id) : id;
        const user = await collection.findOne({ _id: objectId });
        
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    } catch (error) {
        console.error('Failed to get user information:', error);
        return null;
    }
}