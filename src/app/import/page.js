'use client';

import { useState } from 'react';
import Button from "../components/eldoraui/button";
import Input from "../components/eldoraui/input"

export default function ImportPage() {

    const [loading, setLoading] = useState(false);
    const [word, setWord] = useState('');
    const [pinyin, setPinyin] = useState('');
    const [meaning, setMeaning] = useState('');

    const handleClick = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/insert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    word,
                    pinyin,
                    meaning,
                }),
            });
            const data = await response.json();
            console.log(data);
            setWord('');
            setPinyin('');
            setMeaning('');
        } catch (error) {
            console.error('Error inserting data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className='space-y-2.5'>
            <Input type="text" placeholder="Word" value={word} onChange={(e) => setWord(e.target.value)} />
            <Input type="text" placeholder="Pinyin" value={pinyin} onChange={(e) => setPinyin(e.target.value)} />
            <Input type="text" placeholder="Meaning" value={meaning} onChange={(e) => setMeaning(e.target.value)} />
            <br></br>
            <Button variant="brutal" onClick={handleClick} disabled={loading}>Submit</Button>
            <Button className="fixed bottom-12 left-8 m-4" variant="brutal" size="sm" href="/" disabled={loading}>Back</Button>
        </main>
    );
}