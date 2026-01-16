'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Input, TextArea, Button, Toast, ImageUploader, NavBar } from 'antd-mobile';
import { getNoteById, updateNote, deleteNote } from '../../note-actions';
import NoteCard from '../../components/NoteCard';
import type { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import { compressImage } from '@/lib/image-compress';

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState<any>(null);

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    setLoading(true);
    const result = await getNoteById(id);
    if (result.success && result.data) {
      const noteData = result.data;
      setNote(noteData);
      setTitle(noteData.title);
      setContent(noteData.content);
      setSource(noteData.source || '');
      setAuthor(noteData.author || '');
      setDate(new Date(noteData.date));
      
      // 加载图片
      if (noteData.image) {
        setFileList([{ url: noteData.image, thumbnailUrl: noteData.image }]);
      } else {
        setFileList([]);
      }
    } else {
      Toast.show({
        icon: 'fail',
        content: result.error || '加载失败',
      });
      router.push('/');
    }
    setLoading(false);
  };

  const handleImageChange = (items: ImageUploadItem[]) => {
    setFileList(items);
  };

  const handleImageUpload = async (file: File): Promise<ImageUploadItem> => {
    try {
      // 压缩图片到 50KB 以内
      const compressedBase64 = await compressImage(file, {
        maxSizeKB: 50,
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.8,
      });

      return {
        url: compressedBase64,
        thumbnailUrl: compressedBase64,
      };
    } catch (error) {
      console.error('图片压缩失败:', error);
      Toast.show({
        icon: 'fail',
        content: '图片压缩失败，请重试',
      });
      throw error;
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      Toast.show({
        icon: 'fail',
        content: '标题不能为空',
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('source', source);
    formData.append('author', author);
    
    // 如果有图片，添加第一张图片的 base64
    if (fileList.length > 0 && fileList[0].url) {
      formData.append('image', fileList[0].url);
    } else {
      formData.append('image', '');
    }

    const result = await updateNote(id, formData);
    if (result.success) {
      Toast.show({
        icon: 'success',
        content: '更新成功',
      });
      setIsEditing(false);
      await loadNote();
    } else {
      Toast.show({
        icon: 'fail',
        content: result.error || '更新失败',
      });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这条笔记吗？')) {
      return;
    }

    setLoading(true);
    const result = await deleteNote(id);
    if (result.success) {
      Toast.show({
        icon: 'success',
        content: '删除成功',
      });
      router.push('/');
    } else {
      Toast.show({
        icon: 'fail',
        content: result.error || '删除失败',
      });
    }
    setLoading(false);
  };

  if (loading && !note) {
    return (
      <div className="p-4 pb-20 min-h-screen bg-gray-50">
        <Card>加载中...</Card>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <NavBar
        onBack={() => {
          if (isEditing) {
            setIsEditing(false);
            loadNote();
          } else {
            router.back();
          }
        }}
        className="bg-white"
      >
        {isEditing ? '编辑笔记' : '笔记详情'}
      </NavBar>
      <div className="p-4">
        {isEditing ? (
          <Card>
          <div className="mb-4">
            <div className="mb-2 text-sm text-gray-600">标题 *</div>
            <Input
              placeholder="请输入笔记标题"
              value={title}
              onChange={(val) => setTitle(val)}
              clearable
              className="h-11"
            />
          </div>

          <div className="mb-4">
            <div className="mb-2 text-sm text-gray-600">内容</div>
            <TextArea
              placeholder="请输入笔记内容"
              value={content}
              onChange={(val) => setContent(val)}
              rows={8}
              showCount
              maxLength={5000}
            />
          </div>

          <div className="mb-4">
            <div className="mb-2 text-sm text-gray-600">出自</div>
            <Input
              placeholder="请输入出处（可选）"
              value={source}
              onChange={(val) => setSource(val)}
              clearable
              className="h-11"
            />
          </div>

          <div className="mb-4">
            <div className="mb-2 text-sm text-gray-600">作者</div>
            <Input
              placeholder="请输入作者（可选）"
              value={author}
              onChange={(val) => setAuthor(val)}
              clearable
              className="h-11"
            />
          </div>

          <div className="mb-4">
            <div className="mb-2 text-sm text-gray-600">图片</div>
            <ImageUploader
              value={fileList}
              onChange={handleImageChange}
              upload={handleImageUpload}
              maxCount={1}
              showUpload={fileList.length === 0}
            />
          </div>

          <div className="flex gap-2">
            <Button
              block
              color="primary"
              onClick={handleUpdate}
              loading={loading}
              style={{
                backgroundColor: '#FF2442',
                borderColor: '#FF2442',
              }}
            >
              保存
            </Button>
            <Button
              block
              onClick={() => {
                setIsEditing(false);
                loadNote();
              }}
            >
              取消
            </Button>
          </div>
        </Card>
        ) : (
          <>
            <NoteCard note={note} />
            <Card>
              <div className="flex gap-2">
                <Button
                  block
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  style={{
                    backgroundColor: '#FF2442',
                    borderColor: '#FF2442',
                  }}
                >
                  编辑
                </Button>
                <Button
                  block
                  color="danger"
                  onClick={handleDelete}
                  loading={loading}
                >
                  删除
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
