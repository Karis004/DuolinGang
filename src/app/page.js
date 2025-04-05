// 'use client';

import Button from "./components/eldoraui/button";


export default function Home() {

  return (
    <main className="space-y-2.5">
      <Button variant="brutal" href="/import">Add</Button>
      <br></br>
      <Button variant="brutal" href="/list">List</Button>
      <br></br>
      <Button variant="brutal" href="/study">Study</Button>
    </main>
  );
}