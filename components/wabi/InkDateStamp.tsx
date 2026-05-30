'use client';

interface InkDateStampProps {
  date: Date | string;
  className?: string;
  variant?: 'seal' | 'ghost';
}

export function InkDateStamp({
  date,
  className = '',
  variant = 'ghost',
}: InkDateStampProps) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const formatted = d
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();

  return (
    <time
      dateTime={d.toISOString().split('T')[0]}
      className={`ink-date-stamp ink-date-stamp--${variant} ${className}`}
      aria-label={`Published ${formatted}`}
    >
      {formatted}
    </time>
  );
}
