'use client';

import React, { useEffect, useState } from 'react';
import Button from "../components/eldoraui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/eldoraui/table";

export default function DataPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/getData');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <main>
            <Table>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-bold text-center">{item.word}</TableCell>
                            <TableCell className="text-center">{item.pinyin}</TableCell>
                            <TableCell className="text-center">{item.meaning}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button className="fixed bottom-12 left-8 m-4" variant="brutal" size="sm" href="/" disabled={loading}>Back</Button>
        </main>

    );
}