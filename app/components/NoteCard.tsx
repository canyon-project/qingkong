'use client';
import { Card } from 'antd-mobile';

interface Note {
  id: number;
  title: string;
  content: string;
  source?: string | null;
  author?: string | null;
  image?: string | null;
  date: Date;
  creator?: {
    id: number;
    username: string;
  } | null;
}

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  const formatCalendarDate = (date: Date) => {
    const d = new Date(date);
    const month = d.toLocaleDateString('zh-CN', { month: 'long' }).toUpperCase();
    const day = d.getDate();
    const weekday = d.toLocaleDateString('zh-CN', { weekday: 'long' });
    return { month, day, weekday };
  };

  const { month, day, weekday } = formatCalendarDate(note.date);

  return (
    <Card
      onClick={onClick}
      className={`mb-4 rounded-none overflow-hidden ${onClick ? 'cursor-pointer' : 'cursor-default'} bg-white border-0 shadow-sm`}
      bodyStyle={{
        padding: '24px',
      }}
    >
      {/* 顶部：日期信息 */}
      <div className="flex justify-between items-start mb-5">
        {/* 左上角：月份和日期 */}
        <div>
          <div className="text-sm font-medium text-gray-800 tracking-wide mb-1">
            {month}
          </div>
          <div className="text-5xl font-bold leading-none text-black">
            {day}
          </div>
        </div>

        {/* 右上角：星期 */}
        <div className="text-right text-sm text-gray-600 leading-relaxed">
          <div>{weekday}</div>
        </div>
      </div>

      {/* 标题 */}
      <div className="text-2xl font-bold text-black mb-5 leading-snug">
        {note.title}
      </div>

      {/* 图片和内容区域 */}
      <div className="flex gap-4 mb-5">
        {/* 左侧：图片 */}
        {note.image && (
          <div className="flex-shrink-0 w-48 h-48 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={note.image}
              alt={note.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 右侧：出自（竖排） */}
        {note.source && (
          <div className="[writing-mode:vertical-rl] text-sm text-gray-600 leading-loose tracking-wider flex-shrink-0">
            {note.source}
          </div>
        )}
      </div>

      {/* 内容 */}
      {note.content && (
        <div className="text-base leading-relaxed text-gray-800 mb-5 whitespace-pre-wrap">
          {note.content}
        </div>
      )}

      {/* 底部：作者和书名 */}
      {(note.author || note.source) && (
        <div className="text-sm text-gray-600 border-t border-gray-200 pt-4">
          {note.source && (
            <div className="mb-1">
              《{note.source}》
            </div>
          )}
          {note.author && (
            <div>作者：{note.author}</div>
          )}
        </div>
      )}

      {/* 创建人 */}
      {note.creator && (
        <div className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
          创建人：{note.creator.username}
        </div>
      )}
    </Card>
  );
}
