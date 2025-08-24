import { useState, useEffect, useCallback, useMemo } from "react";

interface UseScrollSpyOptions {
  offset?: number;
  throttle?: number;
  rootMargin?: string;
}

/**
 * Optimized scroll spy hook with performance improvements
 * Uses Intersection Observer API for better performance
 */
export const useScrollSpy = (
  sectionIds: string[], 
  options: UseScrollSpyOptions = {}
): string => {
  const { offset = 100, throttle = 100, rootMargin = '-10% 0px -85% 0px' } = options;
  const [activeSection, setActiveSection] = useState<string>("");

  // Memoize section elements to avoid repeated DOM queries
  const sectionElements = useMemo(() => {
    return sectionIds
      .map(id => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
  }, [sectionIds]);

  // Throttled scroll handler as fallback
  const throttledScrollHandler = useCallback(() => {
    let timeoutId: number;
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = window.setTimeout(() => {
        const scrollPosition = window.scrollY + offset;

        for (const element of sectionElements) {
          const { offsetTop, offsetHeight } = element;
          
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(element.id);
            break;
          }
        }
      }, throttle);
    };
  }, [sectionElements, offset, throttle]);

  useEffect(() => {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback to scroll event listener
      const handleScroll = throttledScrollHandler();
      
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll(); // Initial call
      
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }

    // Use Intersection Observer for better performance
    const observerOptions: IntersectionObserverInit = {
      rootMargin,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Find the section with the highest intersection ratio
      const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleSections.length > 0) {
        const mostVisible = visibleSections[0];
        setActiveSection(mostVisible.target.id);
      } else {
        // If no sections are intersecting, determine active section by scroll position
        const scrollPosition = window.scrollY + offset;
        
        for (const element of sectionElements) {
          const { offsetTop, offsetHeight } = element;
          
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(element.id);
            break;
          }
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all section elements
    sectionElements.forEach(element => {
      observer.observe(element);
    });

    // Initial check for active section
    const initialCheck = () => {
      const scrollPosition = window.scrollY + offset;
      
      for (const element of sectionElements) {
        const { offsetTop, offsetHeight } = element;
        
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveSection(element.id);
          break;
        }
      }
    };

    // Use requestAnimationFrame for smooth initial check
    requestAnimationFrame(initialCheck);

    return () => {
      observer.disconnect();
    };
  }, [sectionElements, rootMargin, offset, throttledScrollHandler]);

  return activeSection;
};

/**
 * Hook for scroll progress within sections
 */
export const useScrollProgress = (sectionId: string): number => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const updateProgress = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      
      // Calculate progress based on element visibility
      const visibleTop = Math.max(0, -rect.top);
      const visibleBottom = Math.min(elementHeight, windowHeight - rect.top);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      
      const progressValue = elementHeight > 0 ? visibleHeight / elementHeight : 0;
      setProgress(Math.min(1, Math.max(0, progressValue)));
    };

    const throttledUpdate = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', throttledUpdate, { passive: true });
    window.addEventListener('resize', throttledUpdate, { passive: true });
    
    // Initial calculation
    updateProgress();

    return () => {
      window.removeEventListener('scroll', throttledUpdate);
      window.removeEventListener('resize', throttledUpdate);
    };
  }, [sectionId]);

  return progress;
};

/**
 * Hook for smooth scrolling to sections
 */
export const useSmoothScroll = () => {
  const scrollToSection = useCallback((sectionId: string, offset = 0) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementTop - offset;

    // Use native smooth scrolling if supported
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback smooth scroll implementation
      const startPosition = window.pageYOffset;
      const distance = offsetPosition - startPosition;
      const duration = Math.abs(distance) / 2; // Adjust speed as needed
      let startTime: number;

      const animation = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        window.scrollTo(0, startPosition + (distance * easeOut));
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  }, []);

  const smoothScrollTo = useCallback((sectionId: string, offset = 0) => {
    return scrollToSection(sectionId, offset);
  }, [scrollToSection]);

  return { scrollToSection, smoothScrollTo };
};

export default useScrollSpy;