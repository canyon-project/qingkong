'use client';
import { useState, useEffect } from 'react';
import { Card, List, Button, Toast } from 'antd-mobile';
import { UserOutline, FileOutline } from 'antd-mobile-icons';
import { getCurrentUser, logout } from '../auth-actions';
import { useRouter } from 'next/navigation';

export default function MePage() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const result = await getCurrentUser();
    if (result.success && result.data) {
      setUsername(result.data.username);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      Toast.show({
        icon: 'success',
        content: '已登出',
      });
      router.push('/login');
      router.refresh();
    } else {
      Toast.show({
        icon: 'fail',
        content: result.error || '登出失败',
      });
    }
  };

  return (
    <div className="p-4 pb-20 min-h-screen bg-gray-50">
      <Card className="mb-4">
        <div className="text-center py-5">
          <div className="text-5xl mb-4">📅</div>
          <div className="text-xl font-bold mb-2">
            晴空单向历
          </div>
          <div className="text-sm text-gray-500">
            记录每一天的美好
          </div>
          {username && (
            <div className="text-sm text-gray-400 mt-2">
              当前用户：{username}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <List>
          <List.Item
            prefix={<FileOutline />}
            onClick={() => {
              // 可以添加统计信息等功能
            }}
          >
            我的笔记
          </List.Item>
          <List.Item
            prefix={<UserOutline />}
            onClick={() => {
              // 可以添加设置等功能
            }}
          >
            关于
          </List.Item>
        </List>
      </Card>

      <Card className="mt-4">
        <Button
          block
          color="danger"
          onClick={handleLogout}
        >
          登出
        </Button>
      </Card>
    </div>
  );
}
