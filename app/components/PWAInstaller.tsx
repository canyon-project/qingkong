'use client';

import { useEffect, useState } from 'react';
import { Button, Toast } from 'antd-mobile';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // 注册 Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker 注册成功:', registration);
          })
          .catch((error) => {
            console.log('Service Worker 注册失败:', error);
          });
      });
    }

    // 监听 beforeinstallprompt 事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 检查是否已安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      Toast.show({
        icon: 'success',
        content: '应用已添加到主屏幕',
      });
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <div className="text-sm text-gray-700 mb-3">
          将「晴空单向历」添加到主屏幕，获得更好的体验
        </div>
        <div className="flex gap-2">
          <Button
            color="primary"
            size="small"
            onClick={handleInstallClick}
            style={{
              backgroundColor: '#FF2442',
              borderColor: '#FF2442',
            }}
          >
            安装应用
          </Button>
          <Button
            size="small"
            onClick={() => setIsInstallable(false)}
          >
            稍后
          </Button>
        </div>
      </div>
    </div>
  );
}
