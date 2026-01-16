'use client';

import { useEffect } from 'react';
import { unstableSetRender } from 'antd-mobile';
import { createRoot } from 'react-dom/client';

export default function React19Compat() {
  useEffect(() => {
    unstableSetRender((node, container) => {
      container._reactRoot ||= createRoot(container);
      const root = container._reactRoot;
      root.render(node);
      return async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        root.unmount();
      };
    });
  }, []);

  return null;
}
