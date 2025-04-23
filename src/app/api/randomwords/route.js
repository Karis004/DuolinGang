import clientPromise from '../../lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';

export async function GET(request) {
  try {
    // Get current logged-in user session
    const session = await getServerSession(authOptions);
    
    // If user is not logged in, return 401 error
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get limit and filter from query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 5;

    const client = await clientPromise;
    const db = client.db('WordsBook');
    const collection = db.collection('Words');
    
    // Set filter conditions, only get words for the current logged-in user
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

    // If the user has no words, return an empty array
    if (data.length === 0) {
      return Response.json([]);
    }

    data.sort((a, b) => a.times - b.times);
    const totalTimes = data.reduce((sum, item) => sum + item.times, 0);
    const randomData = data.filter(item => Math.random() * totalTimes >= item.times).slice(0, limit);

    // Fisher-Yates shuffle algorithm
    for (let i = randomData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomData[i], randomData[j]] = [randomData[j], randomData[i]];
    }

    const updatePromises = randomData.map(item =>
      collection.updateOne(
        { _id: item._id },
        { $inc: { times: 1 } }, // Increment times property by 1
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