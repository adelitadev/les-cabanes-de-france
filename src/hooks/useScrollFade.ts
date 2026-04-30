import { useEffect, useRef } from 'react';

/* Hook qui observe les éléments [data-fade] dans un conteneur
   scrollable et leur ajoute la classe "visible" au passage. */
export function useScrollFade(containerRef: React.RefObject<HTMLElement | null>) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { root: container, threshold: 0.1 }
    );

    const targets = container.querySelectorAll('[data-fade], [data-fade-left]');
    targets.forEach((el) => observerRef.current!.observe(el));

    return () => observerRef.current?.disconnect();
  }, [containerRef]);
}
