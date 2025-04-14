import Flashcard from '../../components/Flashcard';
import Button from '../../components/eldoraui/button';
import { searchOneWord } from '../../lib/dbUtils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { redirect } from 'next/navigation';

export default async function FlashcardPage({ params }) {
    // 获取当前会话信息
    const session = await getServerSession(authOptions);
    
    // 如果用户未登录，重定向到登录页面
    if (!session) {
        redirect('/login?callbackUrl=/flashcard/' + params.word);
    }
    
    const { word } = params;
    // 传递用户ID，只查找当前用户的单词
    const currentWord = await searchOneWord(word, session.user.id);

    if (!currentWord) {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-4">
                    单词未找到或不属于当前用户
                </div>
                <Button 
                    variant="brutal"
                    size="sm"
                    href="/list"
                >
                    返回单词列表
                </Button>
            </div>
        );
    }

    return (
        <div>
            <Flashcard currentWord={currentWord} />
            <Button
                className="fixed bottom-12 left-3 m-4"
                variant="brutal"
                size="sm"
                href="/list"
            >
                Back
            </Button>
        </div>
    );
}