import Button from "../components/eldoraui/button";
import Input from "../components/eldoraui/input";
import { insertWordData } from '../lib/dbUtils';
import { redirect } from 'next/navigation';

// 服务器端处理表单提交
async function handleSubmit(formData) {
    'use server'; // 标记为服务器指令
    const wordData = {
        word: formData.get('word'),
        pinyin: formData.get('pinyin'),
        meaning: formData.get('meaning'),
        times: 0,
    };
    await insertWordData(wordData);
    redirect('/import'); // 提交后重定向到首页
}

export default function ImportPage() {
    return (
        <main className='space-y-2.5'>
            <form action={handleSubmit}>
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