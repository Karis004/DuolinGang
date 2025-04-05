import clientPromise from '../../lib/mongodb';

export async function GET(request) {
  try {
    // 从查询参数中获取 limit 和 filter
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 5;

    const client = await clientPromise;
    const db = client.db('WordsBook');
    const collection = db.collection('Words');
    const filter = {};

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
    
    // Fisher-Yates 洗牌算法
    for (let i = randomData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomData[i], randomData[j]] = [randomData[j], randomData[i]];
    }

    return Response.json(randomData);
  } catch (error) {
    console.error("Error fetching random words:", error);
    return Response.json({ error: "Failed to fetch words" }, { status: 500 });
  }
}