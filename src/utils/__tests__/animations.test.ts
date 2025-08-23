import { describe, it, expect } from 'vitest';
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

// Helper type for accessing animation properties safely
type AnimationState = Record<string, any>;

describe('Animation Variants', () => {
  describe('fadeInUp', () => {
    it('should have correct hidden state', () => {
      expect(fadeInUp.hidden).toEqual({
        opacity: 0,
        y: 60,
      });
    });

    it('should have correct visible state', () => {
      expect(fadeInUp.visible).toEqual({
        opacity: 1,
        y: 0,
        transition: {
          duration: ANIMATION_DURATION.normal,
          ease: 'easeOut',
        },
      });
    });

    it('should use normal animation duration', () => {
      expect((fadeInUp.visible as AnimationState).transition.duration).toBe(ANIMATION_DURATION.normal);
    });
  });

  describe('fadeInDown', () => {
    it('should have correct hidden state', () => {
      expect(fadeInDown.hidden).toEqual({
        opacity: 0,
        y: -60,
      });
    });

    it('should have correct visible state', () => {
      expect(fadeInDown.visible).toEqual({
        opacity: 1,
        y: 0,
        transition: {
          duration: ANIMATION_DURATION.normal,
          ease: 'easeOut',
        },
      });
    });

    it('should move from negative y position', () => {
      expect((fadeInDown.hidden as AnimationState).y).toBe(-60);
      expect((fadeInDown.visible as AnimationState).y).toBe(0);
    });
  });

  describe('staggerContainer', () => {
    it('should have correct hidden state', () => {
      expect(staggerContainer.hidden).toEqual({
        opacity: 0,
      });
    });

    it('should have correct visible state with stagger configuration', () => {
      expect(staggerContainer.visible).toEqual({
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      });
    });

    it('should have proper stagger timing', () => {
      const visible = staggerContainer.visible as AnimationState;
      expect(visible.transition.staggerChildren).toBe(0.1);
      expect(visible.transition.delayChildren).toBe(0.2);
    });
  });

  describe('scaleIn', () => {
    it('should have correct hidden state', () => {
      expect(scaleIn.hidden).toEqual({
        scale: 0.8,
        opacity: 0,
      });
    });

    it('should have correct visible state', () => {
      expect(scaleIn.visible).toEqual({
        scale: 1,
        opacity: 1,
        transition: {
          duration: ANIMATION_DURATION.normal,
          ease: 'easeOut',
        },
      });
    });

    it('should scale from 0.8 to 1', () => {
      expect((scaleIn.hidden as AnimationState).scale).toBe(0.8);
      expect((scaleIn.visible as AnimationState).scale).toBe(1);
    });
  });

  describe('slideInLeft', () => {
    it('should have correct hidden state', () => {
      expect(slideInLeft.hidden).toEqual({
        opacity: 0,
        x: -100,
      });
    });

    it('should have correct visible state', () => {
      expect(slideInLeft.visible).toEqual({
        opacity: 1,
        x: 0,
        transition: {
          duration: ANIMATION_DURATION.normal,
          ease: 'easeOut',
        },
      });
    });

    it('should slide from left (negative x)', () => {
      expect((slideInLeft.hidden as AnimationState).x).toBe(-100);
      expect((slideInLeft.visible as AnimationState).x).toBe(0);
    });
  });

  describe('slideInRight', () => {
    it('should have correct hidden state', () => {
      expect(slideInRight.hidden).toEqual({
        opacity: 0,
        x: 100,
      });
    });

    it('should have correct visible state', () => {
      expect(slideInRight.visible).toEqual({
        opacity: 1,
        x: 0,
        transition: {
          duration: ANIMATION_DURATION.normal,
          ease: 'easeOut',
        },
      });
    });

    it('should slide from right (positive x)', () => {
      expect((slideInRight.hidden as AnimationState).x).toBe(100);
      expect((slideInRight.visible as AnimationState).x).toBe(0);
    });
  });

  describe('fadeIn', () => {
    it('should have correct hidden state', () => {
      expect(fadeIn.hidden).toEqual({
        opacity: 0,
      });
    });

    it('should have correct visible state', () => {
      expect(fadeIn.visible).toEqual({
        opacity: 1,
        transition: {
          duration: ANIMATION_DURATION.normal,
        },
      });
    });

    it('should only animate opacity', () => {
      expect(Object.keys(fadeIn.hidden as AnimationState)).toEqual(['opacity']);
      expect(Object.keys(fadeIn.visible as AnimationState)).toEqual(['opacity', 'transition']);
    });
  });

  describe('rotateIn', () => {
    it('should have correct hidden state', () => {
      expect(rotateIn.hidden).toEqual({
        opacity: 0,
        rotate: -180,
      });
    });

    it('should have correct visible state', () => {
      expect(rotateIn.visible).toEqual({
        opacity: 1,
        rotate: 0,
        transition: {
          duration: ANIMATION_DURATION.slow,
          ease: 'easeOut',
        },
      });
    });

    it('should rotate from -180 to 0 degrees', () => {
      expect((rotateIn.hidden as AnimationState).rotate).toBe(-180);
      expect((rotateIn.visible as AnimationState).rotate).toBe(0);
    });

    it('should use slow animation duration', () => {
      expect((rotateIn.visible as AnimationState).transition.duration).toBe(ANIMATION_DURATION.slow);
    });
  });
});

describe('Hover Animations', () => {
  describe('buttonHover', () => {
    it('should have correct scale value', () => {
      expect((buttonHover as AnimationState).scale).toBe(1.05);
    });

    it('should have correct transition duration', () => {
      expect((buttonHover as AnimationState).transition).toEqual({
        duration: ANIMATION_DURATION.fast,
      });
    });

    it('should use fast animation duration', () => {
      expect((buttonHover as AnimationState).transition.duration).toBe(ANIMATION_DURATION.fast);
    });
  });

  describe('cardHover', () => {
    it('should have correct y transformation', () => {
      expect((cardHover as AnimationState).y).toBe(-8);
    });

    it('should have correct transition duration', () => {
      expect((cardHover as AnimationState).transition).toEqual({
        duration: ANIMATION_DURATION.fast,
      });
    });

    it('should use fast animation duration', () => {
      expect((cardHover as AnimationState).transition.duration).toBe(ANIMATION_DURATION.fast);
    });

    it('should move element up (negative y)', () => {
      expect((cardHover as AnimationState).y).toBeLessThan(0);
    });
  });
});

describe('Animation Properties', () => {
  describe('Easing consistency', () => {
    const easingAnimations = [fadeInUp, fadeInDown, scaleIn, slideInLeft, slideInRight, rotateIn];

    it('should use easeOut easing for most animations', () => {
      easingAnimations.forEach((animation) => {
        expect((animation.visible as AnimationState).transition.ease).toBe('easeOut');
      });
    });
  });

  describe('Duration consistency', () => {
    const normalDurationAnimations = [fadeInUp, fadeInDown, scaleIn, slideInLeft, slideInRight, fadeIn];

    it('should use normal duration for most animations', () => {
      normalDurationAnimations.forEach((animation) => {
        expect((animation.visible as AnimationState).transition.duration).toBe(ANIMATION_DURATION.normal);
      });
    });

    const fastDurationAnimations = [buttonHover, cardHover];

    it('should use fast duration for hover animations', () => {
      fastDurationAnimations.forEach((animation) => {
        expect((animation as AnimationState).transition.duration).toBe(ANIMATION_DURATION.fast);
      });
    });
  });

  describe('Opacity transitions', () => {
    const opacityAnimations = [fadeInUp, fadeInDown, scaleIn, slideInLeft, slideInRight, fadeIn, rotateIn];

    it('should start with opacity 0 and end with opacity 1', () => {
      opacityAnimations.forEach((animation) => {
        expect((animation.hidden as AnimationState).opacity).toBe(0);
        expect((animation.visible as AnimationState).opacity).toBe(1);
      });
    });
  });
});

describe('Animation Integration', () => {
  it('should import animation duration constants correctly', () => {
    expect(ANIMATION_DURATION.fast).toBeDefined();
    expect(ANIMATION_DURATION.normal).toBeDefined();
    expect(ANIMATION_DURATION.slow).toBeDefined();
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
});

describe('Animation Values', () => {
  it('should use reasonable transform values', () => {
    expect((fadeInUp.hidden as AnimationState).y).toBe(60); // Move up from bottom
    expect((fadeInDown.hidden as AnimationState).y).toBe(-60); // Move down from top
    expect((slideInLeft.hidden as AnimationState).x).toBe(-100); // Slide from left
    expect((slideInRight.hidden as AnimationState).x).toBe(100); // Slide from right
    expect((scaleIn.hidden as AnimationState).scale).toBe(0.8); // Scale from smaller
    expect((rotateIn.hidden as AnimationState).rotate).toBe(-180); // Half rotation
  });

  it('should use subtle hover effects', () => {
    expect((buttonHover as AnimationState).scale).toBe(1.05); // 5% scale increase
    expect((cardHover as AnimationState).y).toBe(-8); // 8px upward movement
  });

  it('should end all animations at neutral positions', () => {
    expect((fadeInUp.visible as AnimationState).y).toBe(0);
    expect((fadeInDown.visible as AnimationState).y).toBe(0);
    expect((slideInLeft.visible as AnimationState).x).toBe(0);
    expect((slideInRight.visible as AnimationState).x).toBe(0);
    expect((scaleIn.visible as AnimationState).scale).toBe(1);
    expect((rotateIn.visible as AnimationState).rotate).toBe(0);
  });
});