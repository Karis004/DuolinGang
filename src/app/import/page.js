import Button from "../components/eldoraui/button";
import Input from "../components/eldoraui/input";
import { insertWordData } from '../lib/dbUtils';
import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";

// Server-side form submission handling
async function handleSubmit(formData) {
    'use server'; // Mark as server action
    
    // Get current session information
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login');
    }
    
    const wordData = {
        word: formData.get('word'),
        pinyin: formData.get('pinyin'),
        meaning: formData.get('meaning'),
        times: 0,
    };
    
    // Pass user ID to insertWordData function
    await insertWordData(wordData, session.user.id);
    redirect('/import'); // Redirect to import page after submission
}

export default function ImportPage() {
    return (
        <main className="mb-20">
            <h1 className="text-2xl font-bold mb-6 text-center">Add Word</h1>
            <form action={handleSubmit} className='space-y-3'>
                <Input type="text" name="word" placeholder="Word" required />
                <Input type="text" name="pinyin" placeholder="Pinyin" required />
                <Input type="text" name="meaning" placeholder="Meaning" required />
                <br />
                <Button type="submit" variant="brutal">Submit</Button>
                <Button className="fixed bottom-12 left-8 m-4" variant="brutal" size="sm" href="/">Back</Button>
            </form>
        </main>
    );
}