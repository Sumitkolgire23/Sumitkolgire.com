'use client';

import { useEffect, useState } from 'react';

interface RailSection {
  id: string;
  label: string;
}

interface SectionRailProps {
  sections: RailSection[];
  className?: string;
}

export function SectionRail({ sections, className = '' }: SectionRailProps) {
  const [active, setActive] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (sections.length === 0) return null;

  return (
    <nav className={`section-rail ${className}`} aria-label="Page sections">
      {sections.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className={`section-rail__dot${active === id ? ' active' : ''}`}
          aria-label={`Go to ${label}`}
          title={label}
        >
          <span className="section-rail__label" aria-hidden="true">
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
