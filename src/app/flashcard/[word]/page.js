import { searchOneWord } from '../../lib/dbUtils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { redirect } from 'next/navigation';
import FlashcardClient from './client';

export default async function FlashcardPage({ params }) {
    // Get current session information
    const session = await getServerSession(authOptions);
    
    // If user is not logged in, redirect to login page
    if (!session) {
        redirect('/login?callbackUrl=/flashcard/' + params.word);
    }
    
    const { word } = params;
    // Pass user ID, only search for current user's words
    const currentWord = await searchOneWord(word, session.user.id);

    return <FlashcardClient currentWord={currentWord} />;
}