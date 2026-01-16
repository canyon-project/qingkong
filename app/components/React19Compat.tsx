'use client';

import { useEffect } from 'react';
import { unstableSetRender } from 'antd-mobile';
import { createRoot, Root } from 'react-dom/client';

// 扩展类型定义，添加 _reactRoot 属性
interface ContainerWithReactRoot extends Element {
  _reactRoot?: Root;
}

interface DocumentFragmentWithReactRoot extends DocumentFragment {
  _reactRoot?: Root;
}

type Container = ContainerWithReactRoot | DocumentFragmentWithReactRoot;

export default function React19Compat() {
  useEffect(() => {
    unstableSetRender((node, container) => {
      const containerWithRoot = container as Container;
      containerWithRoot._reactRoot ||= createRoot(container);
      const root = containerWithRoot._reactRoot!;
      root.render(node);
      return async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        root.unmount();
      };
    });
  }, []);

  return null;
}
