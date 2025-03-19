import clientPromise from '../../lib/mongodb';

export async function POST(request) {
  const client = await clientPromise;
  const db = client.db('WordsBook');
  const collection = db.collection('Words');

  const body = await request.json();

  await collection.insertOne(body);
  
  return new Response(JSON.stringify({ message: 'Data inserted successfully' }), {
    status: 200,
  });
}