import Button from "../components/eldoraui/button";
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
} from "../components/eldoraui/table";
import Link from "next/link";
import { getWordsData } from '../lib/dbUtils';

export default async function DataPage() {
    const data = await getWordsData();

    return (
        <main>
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