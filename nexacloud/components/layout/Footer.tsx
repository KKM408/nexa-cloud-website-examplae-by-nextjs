import Link from 'next/link';
import styles from './Footer.module.css';

const columns = [
  {
    title: 'Blog',
    links: [
      { href: '/', label: 'Home' },
      { href: '/posts', label: 'All Posts' },
      { href: '/about', label: 'About' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { href: 'https://github.com', label: 'GitHub' },
      { href: 'https://twitter.com', label: 'Twitter' },
      { href: 'mailto:admin@blog.com', label: 'Email' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>Zhang.dev</div>
            <p className={styles.brandDesc}>
              Thoughts on full-stack development, open source, and building things.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div className={styles.colTitle}>{col.title}</div>
              <ul className={styles.colLinks}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.bottom}>
          <span>© 2026 Zhang. All rights reserved.</span>
          <span>Built with Next.js</span>
        </div>
      </div>
    </footer>
  );
}
