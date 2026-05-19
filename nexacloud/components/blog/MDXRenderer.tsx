import { MDXRemote } from 'next-mdx-remote/rsc';
import styles from './MDXRenderer.module.css';

export default function MDXRenderer({ source }: { source: string }) {
  return (
    <div className={styles.prose}>
      <MDXRemote source={source} />
    </div>
  );
}
