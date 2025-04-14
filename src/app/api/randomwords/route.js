import clientPromise from '../../lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';

export async function GET(request) {
  try {
    // 获取当前登录用户会话
    const session = await getServerSession(authOptions);
    
    // 如果用户未登录，返回401错误
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 从查询参数中获取 limit 和 filter
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 5;

    const client = await clientPromise;
    const db = client.db('WordsBook');
    const collection = db.collection('Words');
    
    // 设置过滤条件，只获取当前登录用户的单词
    const filter = { userId: session.user.id };

    const data = await collection.find(filter, {
      projection: {
        _id: 1,
        pinyin: 1,
        word: 1,
        meaning: 1,
        meanings: 1,
        examples: 1,
        times: 1
      }
    }).toArray();

    // 如果该用户没有单词，返回空数组
    if (data.length === 0) {
      return Response.json([]);
    }

    data.sort((a, b) => a.times - b.times);
    const totalTimes = data.reduce((sum, item) => sum + item.times, 0);
    const randomData = data.filter(item => Math.random() * totalTimes >= item.times).slice(0, limit);

    // Fisher-Yates 洗牌算法
    for (let i = randomData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomData[i], randomData[j]] = [randomData[j], randomData[i]];
    }

    const updatePromises = randomData.map(item =>
      collection.updateOne(
        { _id: item._id },
        { $inc: { times: 1 } }, // times属性加1
        { upsert: false }
      )
    );
    await Promise.all(updatePromises);

    return Response.json(randomData);
  } catch (error) {
    console.error("Error fetching random words:", error);
    return Response.json({ error: "Failed to fetch words" }, { status: 500 });
  }
}