import { useState, useEffect, useRef } from 'react';

export function useIntersection(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      // Optional: unobserve after first intersection for one-time animations
      if (entry.isIntersecting && options.triggerOnce) {
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options.root, options.rootMargin, options.threshold, options.triggerOnce]);

  return [elementRef, isIntersecting];
}
