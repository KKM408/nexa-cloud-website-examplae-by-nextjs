// components/blog/MDXRenderer.tsx
'use client';

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import styles from './MDXRenderer.module.css';

interface MDXRendererProps {
  source: MDXRemoteSerializeResult;
}

export default function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <div className={styles.prose}>
      <MDXRemote {...source} />
    </div>
  );
}
