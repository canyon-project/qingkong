'use client';
import { usePathname, useRouter } from 'next/navigation';
import { TabBar } from 'antd-mobile';
import { AppOutline, AddOutline, UserOutline } from 'antd-mobile-icons';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    {
      key: '/',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/create',
      title: '创建',
      icon: <AddOutline />,
    },
    {
      key: '/me',
      title: '我',
      icon: <UserOutline />,
    },
  ];

  // 处理路由匹配，note 详情页也显示首页选中
  const activeKey = pathname === '/' || pathname.startsWith('/note') ? '/' : pathname;

  return (
    <TabBar
      activeKey={activeKey}
      onChange={(key) => router.push(key)}
      className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white"
      style={{
        '--adm-color-primary': '#FF2442',
      } as React.CSSProperties}
    >
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
}
