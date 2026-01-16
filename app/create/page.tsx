'use client';
import { useState, useCallback } from 'react';
import { Card, Input, Button, TextArea, Toast, DatePicker, ImageUploader, NavBar } from 'antd-mobile';
import { createNote } from '../note-actions';
import { useRouter } from 'next/navigation';
import { LeftOutline } from 'antd-mobile-icons';
import type { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const [loading, setLoading] = useState(false);

  const now = new Date();

  const labelRenderer = useCallback((type: string, data: number) => {
    switch (type) {
      case 'year':
        return data + '年';
      case 'month':
        return data + '月';
      case 'day':
        return data + '日';
      default:
        return data;
    }
  }, []);

  const handleImageChange = (items: ImageUploadItem[]) => {
    setFileList(items);
  };

  const handleImageUpload = async (file: File): Promise<ImageUploadItem> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve({
          url: base64,
          thumbnailUrl: base64,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Toast.show({
        icon: 'fail',
        content: '请输入标题',
      });
      return;
    }

    if (!date) {
      Toast.show({
        icon: 'fail',
        content: '请选择日期',
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('source', source);
    formData.append('author', author);
    formData.append('date', date.toISOString());
    
    // 如果有图片，添加第一张图片的 base64
    if (fileList.length > 0 && fileList[0].url) {
      formData.append('image', fileList[0].url);
    }

    const result = await createNote(formData);
    if (result.success) {
      Toast.show({
        icon: 'success',
        content: '创建成功',
      });
      setTitle('');
      setContent('');
      setSource('');
      setAuthor('');
      setDate(null);
      setFileList([]);
      router.push('/');
    } else {
      Toast.show({
        icon: 'fail',
        content: result.error || '创建失败',
      });
    }
    setLoading(false);
  };

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <NavBar
        onBack={() => router.back()}
        className="bg-white"
      >
        创建笔记
      </NavBar>
      <div className="p-4">
        <Card className="mb-4">
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
          <div className="mb-2 text-sm text-gray-600">日期 *</div>
          <Button
            onClick={() => {
              setDatePickerVisible(true);
            }}
            fill="outline"
            className="w-full justify-start h-11"
            style={{
              color: date ? '#333' : '#999',
            }}
          >
            {date
              ? new Date(date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : '选择日期（必填）'}
          </Button>
          <DatePicker
            title="选择日期"
            visible={datePickerVisible}
            value={date || now}
            onClose={() => {
              setDatePickerVisible(false);
            }}
            precision="day"
            max={now}
            renderLabel={labelRenderer}
            onConfirm={(val) => {
              setDate(val);
              setDatePickerVisible(false);
            }}
          />
        </div>

        <div className="mb-4">
          <div className="mb-2 text-sm text-gray-600">内容</div>
          <TextArea
            placeholder="请输入笔记内容（可选）"
            value={content}
            onChange={(val) => setContent(val)}
            rows={6}
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

        <Button
          block
          color="primary"
          size="large"
          onClick={handleSubmit}
          loading={loading}
          style={{
            backgroundColor: '#FF2442',
            borderColor: '#FF2442',
          }}
        >
          创建笔记
        </Button>
        </Card>
      </div>
    </div>
  );
}
