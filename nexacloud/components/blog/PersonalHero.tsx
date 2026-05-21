import Link from 'next/link';
import styles from './PersonalHero.module.css';

export default function PersonalHero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.avatar}>Z</div>
        <h1 className={styles.name}>Zhang</h1>
        <p className={styles.role}>Full-Stack Developer</p>
        <p className={styles.bio}>
          Building things with Next.js, NestJS, and TypeScript. Writing about web development,
          open source, and the craft of software engineering.
        </p>
        <div className={styles.links}>
          <Link href="/posts" className={styles.cta}>Read the Blog</Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.social}>
            GitHub
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.social}>
            Twitter
          </a>
        </div>
      </div>
    </section>
  );
}
