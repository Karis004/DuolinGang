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
    // Get current session information
    const session = await getServerSession(authOptions);
    
    // If user is not logged in, redirect to login page
    if (!session) {
        redirect('/login?callbackUrl=/list');
    }
    
    // Get word list for current user
    const data = await getWordsData({ userId: session.user.id });

    return (
        <main>
            {data.length > 0 ? (
                <>
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
                    <p className="mb-4">You haven&apos;t added any words yet</p>
                    <Button href="/import" variant="brutal">Add New Words</Button>
                </div>
            )}
            {/* <Button
                className="fixed bottom-12 left-8 m-4"
                variant="brutal"
                size="sm"
                href="/"
            >
                Back
            </Button> */}
        </main>
    );
}