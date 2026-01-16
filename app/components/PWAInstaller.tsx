'use client';

import { useEffect, useState } from 'react';
import { Button, Toast } from 'antd-mobile';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 检测 iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // 检查是否已安装（standalone 模式）
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // 如果已安装，不显示提示
    if (standalone) {
      return;
    }

    // 注册 Service Worker
    if ('serviceWorker' in navigator) {
      // 立即注册，不等待 load 事件
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker 注册成功:', registration);
          // 检查更新
          registration.update();
        })
        .catch((error) => {
          console.log('Service Worker 注册失败:', error);
        });
    }

    // 监听 beforeinstallprompt 事件（Android Chrome）
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS Safari 特殊处理
    if (isIOSDevice && !standalone) {
      // 检查是否在 Safari 中
      const isInStandaloneMode = (window.navigator as any).standalone === false;
      if (isInStandaloneMode || window.navigator.standalone === false) {
        setIsInstallable(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    // iOS Safari
    if (isIOS) {
      Toast.show({
        icon: 'success',
        content: '请点击浏览器底部的"分享"按钮，然后选择"添加到主屏幕"',
        duration: 5000,
      });
      setIsInstallable(false);
      return;
    }

    // Android Chrome
    if (!deferredPrompt) {
      Toast.show({
        icon: 'fail',
        content: '安装提示不可用，请使用浏览器菜单添加',
      });
      return;
    }

    try {
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
    } catch (error) {
      console.error('安装失败:', error);
      Toast.show({
        icon: 'fail',
        content: '安装失败，请手动添加到主屏幕',
      });
    }
  };

  if (!isInstallable || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <div className="text-sm text-gray-700 mb-3">
          {isIOS ? (
            <>
              将「晴空单向历」添加到主屏幕<br />
              <span className="text-xs text-gray-500 mt-1 block">
                点击分享按钮 → 添加到主屏幕
              </span>
            </>
          ) : (
            '将「晴空单向历」添加到主屏幕，获得更好的体验'
          )}
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
            {isIOS ? '查看说明' : '安装应用'}
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
