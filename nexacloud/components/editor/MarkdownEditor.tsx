'use client';

import { Editor } from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import remarkBreaks from 'remark-breaks';
import 'bytemd/dist/index.css';
import styles from './MarkdownEditor.module.css';

const breaksPlugin = () => ({ remarkPlugins: [remarkBreaks] });
const plugins = [gfm(), highlight(), breaksPlugin()];

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: Props) {
  return (
    <div className={styles.wrapper}>
      <Editor
        value={value}
        plugins={plugins}
        onChange={onChange}
        placeholder={placeholder ?? '输入文章内容...'}
      />
    </div>
  );
}
