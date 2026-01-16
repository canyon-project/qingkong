'use client';
import { useState, useEffect } from 'react';
import { Tabs, Empty } from 'antd-mobile';
import { getTodayNote, getNotes } from './note-actions';
import { useRouter } from 'next/navigation';
import BottomNav from './components/BottomNav';
import NoteCard from './components/NoteCard';
import AuthGuard from './components/AuthGuard';

interface Note {
  id: number;
  title: string;
  content: string;
  source?: string | null;
  author?: string | null;
  image?: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  creator?: {
    id: number;
    username: string;
  } | null;
}

export default function Page() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}

function HomeContent() {
  const router = useRouter();
  const [todayNote, setTodayNote] = useState<Note | null>(null);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTodayNote = async () => {
    setLoading(true);
    const result = await getTodayNote();
    if (result.success && result.data) {
      setTodayNote(result.data);
    }
    setLoading(false);
  };

  const loadAllNotes = async () => {
    setLoading(true);
    const result = await getNotes();
    if (result.success && result.data) {
      setAllNotes(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTodayNote();
    loadAllNotes();
  }, []);

  return (
    <>
      <div className="pb-16 min-h-screen bg-gray-50">
        <Tabs defaultActiveKey="today">
          <Tabs.Tab title="今日" key="today">
            <div className="p-4">
              {todayNote ? (
                <NoteCard
                  note={todayNote}
                  onClick={() => router.push(`/note/${todayNote.id}`)}
                />
              ) : (
                <Empty description="今天还没有笔记，点击底部 + 号创建" />
              )}
            </div>
          </Tabs.Tab>

          <Tabs.Tab title="发现" key="discover">
            <div className="p-4">
              {allNotes.length === 0 ? (
                <Empty description="还没有笔记，点击底部 + 号创建" />
              ) : (
                <>
                  {allNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onClick={() => router.push(`/note/${note.id}`)}
                    />
                  ))}
                </>
              )}
            </div>
          </Tabs.Tab>
        </Tabs>
      </div>
      <BottomNav />
    </>
  );
}
