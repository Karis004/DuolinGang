import Flashcard from '../../components/Flashcard';
import Button from '../../components/eldoraui/button';
import { searchOneWord } from '../../lib/dbUtils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { redirect } from 'next/navigation';

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

    if (!currentWord) {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-4">
                    Word not found or does not belong to current user
                </div>
                <Button 
                    variant="brutal"
                    size="sm"
                    href="/list"
                >
                    Back to Word List
                </Button>
            </div>
        );
    }

    return (
        <div>
            <Flashcard currentWord={currentWord} />
            {/* <Button
                className="fixed bottom-12 left-8 m-4"
                variant="brutal"
                size="sm"
                href="/list"
            >
                Back
            </Button> */}
        </div>
    );
}