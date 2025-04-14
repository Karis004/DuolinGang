import Button from "../components/eldoraui/button";
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
} from "../components/eldoraui/table";
import Link from "next/link";
import { getWordsData } from '../lib/dbUtils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function DataPage() {
    // 获取当前会话信息
    const session = await getServerSession(authOptions);
    
    // 如果用户未登录，重定向到登录页面
    if (!session) {
        redirect('/login?callbackUrl=/list');
    }
    
    // 获取当前用户的单词列表
    const data = await getWordsData({ userId: session.user.id });

    return (
        <main>
            {data.length > 0 ? (
                <>
                    <h1 className="text-2xl font-bold mb-4">我的词汇表</h1>
                    <Table>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-bold text-center">
                                        <Link href={`/flashcard/${item.word}`}>
                                            {item.word}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Link href={`/flashcard/${item.word}`}>
                                            {item.pinyin}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Link href={`/flashcard/${item.word}`}>
                                            {item.meaning}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>
            ) : (
                <div className="text-center p-6">
                    <p className="mb-4">你还没有添加任何单词</p>
                    <Button href="/import" variant="brutal">添加新单词</Button>
                </div>
            )}
            <Button
                className="fixed bottom-12 left-8 m-4"
                variant="brutal"
                size="sm"
                href="/"
            >
                Back
            </Button>
        </main>
    );
}