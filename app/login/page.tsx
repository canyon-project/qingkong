'use client';
import { useState } from 'react';
import { Card, Input, Button, Toast } from 'antd-mobile';
import { login } from '../auth-actions';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim()) {
      Toast.show({
        icon: 'fail',
        content: '请输入用户名',
      });
      return;
    }

    if (!password.trim()) {
      Toast.show({
        icon: 'fail',
        content: '请输入密码',
      });
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    if (result.success) {
      Toast.show({
        icon: 'success',
        content: '登录成功',
      });
      router.push('/');
      router.refresh();
    } else {
      Toast.show({
        icon: 'fail',
        content: result.error || '登录失败',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">📅</div>
          <div className="text-2xl font-bold mb-2">晴空单向历</div>
          <div className="text-sm text-gray-500">记录每一天的美好</div>
        </div>

        <div className="mb-4">
          <div className="mb-2 text-sm text-gray-600">用户名</div>
          <Input
            placeholder="请输入用户名"
            value={username}
            onChange={(val) => setUsername(val)}
            clearable
            className="h-11"
          />
        </div>

        <div className="mb-6">
          <div className="mb-2 text-sm text-gray-600">密码</div>
          <Input
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(val) => setPassword(val)}
            clearable
            className="h-11"
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
          登录
        </Button>
      </Card>
    </div>
  );
}
