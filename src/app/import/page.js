import Button from "../components/eldoraui/button";
import Input from "../components/eldoraui/input";
import { insertWordData } from '../lib/dbUtils';
import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";

// 服务器端处理表单提交
async function handleSubmit(formData) {
    'use server'; // 标记为服务器指令
    
    // 获取当前会话信息
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login');
    }
    
    const wordData = {
        word: formData.get('word'),
        pinyin: formData.get('pinyin'),
        meaning: formData.get('meaning'),
        times: 0,
    };
    
    // 传递用户ID给insertWordData函数
    await insertWordData(wordData, session.user.id);
    redirect('/import'); // 提交后重定向到导入页面
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