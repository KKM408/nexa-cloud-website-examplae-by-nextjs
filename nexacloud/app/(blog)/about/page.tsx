import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About',
  description: 'Full-stack developer building things with Next.js and NestJS.',
};

const skills = ['TypeScript', 'Next.js', 'NestJS', 'React', 'PostgreSQL', 'Docker', 'Prisma', 'Node.js'];

const timeline = [
  { year: '2024–present', role: 'Full-Stack Developer', desc: 'Building modern web applications with Next.js and NestJS.' },
  { year: '2022–2024', role: 'Frontend Developer', desc: 'Focused on React ecosystems and UI engineering.' },
  { year: '2020–2022', role: 'Software Engineer', desc: 'Backend APIs and database design.' },
];

export default function AboutPage() {
  return (
    <main className={`section container ${styles.page}`}>
      <div className={styles.header}>
        <div className={styles.avatar}>Z</div>
        <div>
          <h1 className={styles.name}>Zhang</h1>
          <p className={styles.role}>Full-Stack Developer</p>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>About me</h2>
        <p className={styles.bio}>
          I&apos;m a full-stack developer who enjoys building clean, performant web applications.
          I work primarily with TypeScript, Next.js on the frontend, and NestJS + PostgreSQL on the backend.
        </p>
        <p className={styles.bio}>
          I write about the tools and patterns I find interesting — from React Server Components to
          database design. When I&apos;m not coding, I&apos;m probably reading about distributed systems or
          contributing to open source.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Skills</h2>
        <div className={styles.skills}>
          {skills.map((skill) => (
            <span key={skill} className={styles.skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Experience</h2>
        <div className={styles.timeline}>
          {timeline.map(({ year, role, desc }) => (
            <div key={year} className={styles.entry}>
              <div className={styles.entryYear}>{year}</div>
              <div>
                <div className={styles.entryRole}>{role}</div>
                <p className={styles.entryDesc}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
