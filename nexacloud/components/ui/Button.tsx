// components/ui/Button.tsx
import Link from 'next/link';
import styles from './Button.module.css';

interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Button({
  href,
  variant = 'primary',
  size = 'default',
  children,
  onClick,
}: ButtonProps) {
  const className = [
    styles.button,
    styles[variant],
    size === 'large' ? styles.large : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
