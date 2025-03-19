import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // 从环境变量获取 MongoDB URI
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    // 在开发环境中，使用全局变量以避免热重载时重复连接
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // 在生产环境中，直接连接
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;