import Flashcard from '../../components/Flashcard';
import Button from '../../components/eldoraui/button';
import { searchOneWord } from '../../lib/dbUtils';

export default async function FlashcardPage({ params }) {
    const { word } = await params;
    const currentWord = await searchOneWord(word);

    if (!currentWord) {
        return <div>Word not found</div>;
    }

    return (
        <div>
            <Flashcard currentWord={currentWord} />
            <Button
                className="fixed bottom-12 left-3 m-4"
                variant="brutal"
                size="sm"
                href="/"
            >
                Back
            </Button>
        </div>
    );
}