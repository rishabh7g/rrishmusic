import { describe, it, expect } from 'vitest';
import type { Target, Variants } from 'framer-motion';
import {
  fadeInUp,
  fadeInDown,
  staggerContainer,
  scaleIn,
  slideInLeft,
  slideInRight,
  buttonHover,
  cardHover,
  fadeIn,
  rotateIn,
} from '../animations';
import { ANIMATION_DURATION } from '../constants';

// Industry standard: Define specific types for animation targets
interface AnimationTarget extends Target {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  transition?: {
    duration?: number;
    ease?: string;
    staggerChildren?: number;
    delayChildren?: number;
  };
}

// Helper function to safely access variant properties (industry standard approach)
const getVariantTarget = (variants: Variants, key: string): AnimationTarget => {
  const variant = variants[key];
  if (typeof variant === 'function') {
    // Handle dynamic variants - call with required parameters for testing
    return variant({}, {}, {}) as AnimationTarget;
  }
  return variant as AnimationTarget;
};

describe('Animation Variants', () => {
  describe('fadeInUp', () => {
    it('should have correct hidden state', () => {
      const hidden = getVariantTarget(fadeInUp, 'hidden');
      expect(hidden).toEqual({
        opacity: 0,
        y: 60,
      });
    });

    it('should have correct visible state', () => {
      const visible = getVariantTarget(fadeInUp, 'visible');
      expect(visible).toEqual({
        opacity: 1,
        y: 0,
        transition: {
          duration: ANIMATION_DURATION.normal,
          ease: 'easeOut',
        },
      });
    });

    it('should use normal animation duration', () => {
      const visible = getVariantTarget(fadeInUp, 'visible');
      expect(visible.transition?.duration).toBe(ANIMATION_DURATION.normal);
    });
  });

  describe('fadeInDown', () => {
    it('should have correct hidden state', () => {
      const hidden = getVariantTarget(fadeInDown, 'hidden');
      expect(hidden).toEqual({
        opacity: 0,
        y: -60,
      });
    });

    it('should have correct visible state', () => {
      const visible = getVariantTarget(fadeInDown, 'visible');
      expect(visible).toEqual({
        opacity: 1,
        y: 0,
        transition: {
          duration: ANIMATION_DURATION.normal,
          ease: 'easeOut',
        },
      });
    });

    it('should move from negative y position', () => {
      const hidden = getVariantTarget(fadeInDown, 'hidden');
      const visible = getVariantTarget(fadeInDown, 'visible');
      expect(hidden.y).toBe(-60);
      expect(visible.y).toBe(0);
    });
  });

  describe('staggerContainer', () => {
    it('should have correct hidden state', () => {
      const hidden = getVariantTarget(staggerContainer, 'hidden');
      expect(hidden).toEqual({
        opacity: 0,
      });
    });

    it('should have correct visible state with stagger configuration', () => {
      const visible = getVariantTarget(staggerContainer, 'visible');
      expect(visible).toEqual({
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      });
    });

    it('should have proper stagger timing', () => {
      const visible = getVariantTarget(staggerContainer, 'visible');
      expect(visible.transition?.staggerChildren).toBe(0.1);
      expect(visible.transition?.delayChildren).toBe(0.2);
    });
  });

  describe('scaleIn', () => {
    it('should have correct hidden state', () => {
      const hidden = getVariantTarget(scaleIn, 'hidden');
      expect(hidden).toEqual({
        scale: 0.8,
        opacity: 0,
      });
    });

    it('should have correct visible state', () => {
      const visible = getVariantTarget(scaleIn, 'visible');
      expect(visible).toEqual({
        scale: 1,
        opacity: 1,
        transition: {
          duration: ANIMATION_DURATION.normal,
          ease: 'easeOut',
        },
      });
    });

    it('should scale from 0.8 to 1', () => {
      const hidden = getVariantTarget(scaleIn, 'hidden');
      const visible = getVariantTarget(scaleIn, 'visible');
      expect(hidden.scale).toBe(0.8);
      expect(visible.scale).toBe(1);
    });
  });

  describe('slideInLeft', () => {
    it('should have correct hidden state', () => {
      const hidden = getVariantTarget(slideInLeft, 'hidden');
      expect(hidden).toEqual({
        opacity: 0,
        x: -100,
      });
    });

    it('should have correct visible state', () => {
      const visible = getVariantTarget(slideInLeft, 'visible');
      expect(visible).toEqual({
        opacity: 1,
        x: 0,
        transition: {
          duration: ANIMATION_DURATION.normal,
          ease: 'easeOut',
        },
      });
    });

    it('should slide from left (negative x)', () => {
      const hidden = getVariantTarget(slideInLeft, 'hidden');
      const visible = getVariantTarget(slideInLeft, 'visible');
      expect(hidden.x).toBe(-100);
      expect(visible.x).toBe(0);
    });
  });

  describe('slideInRight', () => {
    it('should have correct hidden state', () => {
      const hidden = getVariantTarget(slideInRight, 'hidden');
      expect(hidden).toEqual({
        opacity: 0,
        x: 100,
      });
    });

    it('should have correct visible state', () => {
      const visible = getVariantTarget(slideInRight, 'visible');
      expect(visible).toEqual({
        opacity: 1,
        x: 0,
        transition: {
          duration: ANIMATION_DURATION.normal,
          ease: 'easeOut',
        },
      });
    });

    it('should slide from right (positive x)', () => {
      const hidden = getVariantTarget(slideInRight, 'hidden');
      const visible = getVariantTarget(slideInRight, 'visible');
      expect(hidden.x).toBe(100);
      expect(visible.x).toBe(0);
    });
  });

  describe('fadeIn', () => {
    it('should have correct hidden state', () => {
      const hidden = getVariantTarget(fadeIn, 'hidden');
      expect(hidden).toEqual({
        opacity: 0,
      });
    });

    it('should have correct visible state', () => {
      const visible = getVariantTarget(fadeIn, 'visible');
      expect(visible).toEqual({
        opacity: 1,
        transition: {
          duration: ANIMATION_DURATION.normal,
        },
      });
    });

    it('should only animate opacity', () => {
      const hidden = getVariantTarget(fadeIn, 'hidden');
      const visible = getVariantTarget(fadeIn, 'visible');
      expect(Object.keys(hidden)).toEqual(['opacity']);
      expect(Object.keys(visible)).toEqual(['opacity', 'transition']);
    });
  });

  describe('rotateIn', () => {
    it('should have correct hidden state', () => {
      const hidden = getVariantTarget(rotateIn, 'hidden');
      expect(hidden).toEqual({
        opacity: 0,
        rotate: -180,
      });
    });

    it('should have correct visible state', () => {
      const visible = getVariantTarget(rotateIn, 'visible');
      expect(visible).toEqual({
        opacity: 1,
        rotate: 0,
        transition: {
          duration: ANIMATION_DURATION.slow,
          ease: 'easeOut',
        },
      });
    });

    it('should rotate from -180 to 0 degrees', () => {
      const hidden = getVariantTarget(rotateIn, 'hidden');
      const visible = getVariantTarget(rotateIn, 'visible');
      expect(hidden.rotate).toBe(-180);
      expect(visible.rotate).toBe(0);
    });

    it('should use slow animation duration', () => {
      const visible = getVariantTarget(rotateIn, 'visible');
      expect(visible.transition?.duration).toBe(ANIMATION_DURATION.slow);
    });
  });
});

describe('Hover Animations', () => {
  describe('buttonHover', () => {
    const hoverTarget = buttonHover as AnimationTarget;

    it('should have correct scale value', () => {
      expect(hoverTarget.scale).toBe(1.05);
    });

    it('should have correct transition duration', () => {
      expect(hoverTarget.transition).toEqual({
        duration: ANIMATION_DURATION.fast,
      });
    });

    it('should use fast animation duration', () => {
      expect(hoverTarget.transition?.duration).toBe(ANIMATION_DURATION.fast);
    });
  });

  describe('cardHover', () => {
    const hoverTarget = cardHover as AnimationTarget;

    it('should have correct y transformation', () => {
      expect(hoverTarget.y).toBe(-8);
    });

    it('should have correct transition duration', () => {
      expect(hoverTarget.transition).toEqual({
        duration: ANIMATION_DURATION.fast,
      });
    });

    it('should use fast animation duration', () => {
      expect(hoverTarget.transition?.duration).toBe(ANIMATION_DURATION.fast);
    });

    it('should move element up (negative y)', () => {
      expect(hoverTarget.y).toBeLessThan(0);
    });
  });
});

describe('Animation Properties', () => {
  describe('Easing consistency', () => {
    const easingAnimations = [fadeInUp, fadeInDown, scaleIn, slideInLeft, slideInRight, rotateIn];

    it('should use easeOut easing for most animations', () => {
      easingAnimations.forEach((animation) => {
        const visible = getVariantTarget(animation, 'visible');
        expect(visible.transition?.ease).toBe('easeOut');
      });
    });
  });

  describe('Duration consistency', () => {
    const normalDurationAnimations = [fadeInUp, fadeInDown, scaleIn, slideInLeft, slideInRight, fadeIn];

    it('should use normal duration for most animations', () => {
      normalDurationAnimations.forEach((animation) => {
        const visible = getVariantTarget(animation, 'visible');
        expect(visible.transition?.duration).toBe(ANIMATION_DURATION.normal);
      });
    });

    const fastDurationAnimations = [
      { name: 'buttonHover', animation: buttonHover },
      { name: 'cardHover', animation: cardHover },
    ];

    it('should use fast duration for hover animations', () => {
      fastDurationAnimations.forEach(({ animation }) => {
        const target = animation as AnimationTarget;
        expect(target.transition?.duration).toBe(ANIMATION_DURATION.fast);
      });
    });
  });

  describe('Opacity transitions', () => {
    const opacityAnimations = [fadeInUp, fadeInDown, scaleIn, slideInLeft, slideInRight, fadeIn, rotateIn];

    it('should start with opacity 0 and end with opacity 1', () => {
      opacityAnimations.forEach((animation) => {
        const hidden = getVariantTarget(animation, 'hidden');
        const visible = getVariantTarget(animation, 'visible');
        expect(hidden.opacity).toBe(0);
        expect(visible.opacity).toBe(1);
      });
    });
  });
});

describe('Animation Integration', () => {
  it('should import animation duration constants correctly', () => {
    expect(ANIMATION_DURATION.fast).toBeDefined();
    expect(ANIMATION_DURATION.normal).toBeDefined();
    expect(ANIMATION_DURATION.slow).toBeDefined();
    expect(typeof ANIMATION_DURATION.fast).toBe('number');
    expect(typeof ANIMATION_DURATION.normal).toBe('number');
    expect(typeof ANIMATION_DURATION.slow).toBe('number');
  });

  it('should have consistent naming patterns', () => {
    // Entry animations should have hidden/visible states
    const entryAnimations = [fadeInUp, fadeInDown, scaleIn, slideInLeft, slideInRight, fadeIn, rotateIn];
    
    entryAnimations.forEach((animation) => {
      expect(animation).toHaveProperty('hidden');
      expect(animation).toHaveProperty('visible');
    });
  });

  it('should have hover animations without hidden/visible states', () => {
    const hoverAnimations = [buttonHover, cardHover];
    
    hoverAnimations.forEach((animation) => {
      expect(animation).not.toHaveProperty('hidden');
      expect(animation).not.toHaveProperty('visible');
      expect(animation).toHaveProperty('transition');
    });
  });

  it('should export valid Variants objects', () => {
    const variants = [fadeInUp, fadeInDown, scaleIn, slideInLeft, slideInRight, fadeIn, rotateIn];
    
    variants.forEach((variant) => {
      expect(typeof variant).toBe('object');
      expect(variant).not.toBeNull();
    });
  });
});

describe('Animation Values', () => {
  it('should use reasonable transform values', () => {
    expect(getVariantTarget(fadeInUp, 'hidden').y).toBe(60); // Move up from bottom
    expect(getVariantTarget(fadeInDown, 'hidden').y).toBe(-60); // Move down from top
    expect(getVariantTarget(slideInLeft, 'hidden').x).toBe(-100); // Slide from left
    expect(getVariantTarget(slideInRight, 'hidden').x).toBe(100); // Slide from right
    expect(getVariantTarget(scaleIn, 'hidden').scale).toBe(0.8); // Scale from smaller
    expect(getVariantTarget(rotateIn, 'hidden').rotate).toBe(-180); // Half rotation
  });

  it('should use subtle hover effects', () => {
    const buttonTarget = buttonHover as AnimationTarget;
    const cardTarget = cardHover as AnimationTarget;
    expect(buttonTarget.scale).toBe(1.05); // 5% scale increase
    expect(cardTarget.y).toBe(-8); // 8px upward movement
  });

  it('should end all animations at neutral positions', () => {
    expect(getVariantTarget(fadeInUp, 'visible').y).toBe(0);
    expect(getVariantTarget(fadeInDown, 'visible').y).toBe(0);
    expect(getVariantTarget(slideInLeft, 'visible').x).toBe(0);
    expect(getVariantTarget(slideInRight, 'visible').x).toBe(0);
    expect(getVariantTarget(scaleIn, 'visible').scale).toBe(1);
    expect(getVariantTarget(rotateIn, 'visible').rotate).toBe(0);
  });

  it('should have valid transition configurations', () => {
    const transitionAnimations = [fadeInUp, fadeInDown, scaleIn, slideInLeft, slideInRight, fadeIn, rotateIn];
    
    transitionAnimations.forEach((animation) => {
      const visible = getVariantTarget(animation, 'visible');
      expect(visible.transition).toBeDefined();
      expect(typeof visible.transition?.duration).toBe('number');
      expect(visible.transition?.duration).toBeGreaterThan(0);
    });
  });
});