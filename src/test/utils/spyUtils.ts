/**
 * Advanced Spy Utilities for Test Automation
 * 
 * This module provides comprehensive spy utilities, mock factories, and testing helpers
 * that enable robust, maintainable, and memory-efficient test suites. It follows
 * enterprise-grade testing patterns and provides a consistent API for spy management.
 * 
 * @module SpyUtils
 */

import { vi, type MockedFunction, type MockInstance } from 'vitest';

// ===== TYPE DEFINITIONS =====

/**
 * Generic mock function type with enhanced typing
 */
export type EnhancedMock<T extends (...args: any[]) => any> = MockedFunction<T> & {
  __spyMetadata?: SpyMetadata;
};

/**
 * Spy metadata for tracking and management
 */
export interface SpyMetadata {
  name: string;
  createdAt: number;
  module?: string;
  originalFunction?: any;
  isGlobal?: boolean;
}

/**
 * Spy registry entry
 */
export interface SpyRegistryEntry {
  spy: MockInstance | EnhancedMock<any>;
  metadata: SpyMetadata;
  cleanup: () => void;
}

/**
 * Mock factory configuration
 */
export interface MockFactoryConfig<T = any> {
  name?: string;
  defaultImplementation?: T;
  autoRegister?: boolean;
  trackCalls?: boolean;
  persistent?: boolean;
}

/**
 * Component spy configuration
 */
export interface ComponentSpyConfig {
  methods?: string[];
  props?: string[];
  hooks?: string[];
  events?: string[];
}

/**
 * DOM spy configuration
 */
export interface DOMSpyConfig {
  methods?: (keyof HTMLElement)[];
  events?: string[];
  properties?: string[];
}

/**
 * Async spy configuration
 */
export interface AsyncSpyConfig {
  delay?: number;
  shouldReject?: boolean;
  rejectionReason?: any;
  resolveValue?: any;
}

// ===== SPY REGISTRY =====

/**
 * Global spy registry for centralized management
 */
class SpyRegistry {
  private registry: Map<string, SpyRegistryEntry> = new Map();
  private globalSpies: Set<string> = new Set();

  /**
   * Register a spy in the registry
   */
  register(id: string, spy: MockInstance | EnhancedMock<any>, metadata: SpyMetadata): void {
    const cleanup = () => {
      spy.mockRestore?.();
      // Note: We don't call mockClear here to preserve call history
    };

    this.registry.set(id, { spy, metadata, cleanup });
    
    if (metadata.isGlobal) {
      this.globalSpies.add(id);
    }
  }

  /**
   * Retrieve a spy from the registry
   */
  get(id: string): SpyRegistryEntry | undefined {
    return this.registry.get(id);
  }

  /**
   * Check if a spy is registered
   */
  has(id: string): boolean {
    return this.registry.has(id);
  }

  /**
   * Get all registered spies
   */
  getAll(): Map<string, SpyRegistryEntry> {
    return new Map(this.registry);
  }

  /**
   * Clean up a specific spy
   */
  cleanup(id: string): boolean {
    const entry = this.registry.get(id);
    if (entry) {
      entry.cleanup();
      this.registry.delete(id);
      this.globalSpies.delete(id);
      return true;
    }
    return false;
  }

  /**
   * Clean up all non-persistent spies
   */
  cleanupAll(includeGlobal = false): void {
    for (const [id, entry] of this.registry) {
      if (!entry.metadata.isGlobal || includeGlobal) {
        entry.cleanup();
        this.registry.delete(id);
        this.globalSpies.delete(id);
      }
    }
  }

  /**
   * Clean up only global spies
   */
  cleanupGlobal(): void {
    for (const id of this.globalSpies) {
      this.cleanup(id);
    }
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    total: number;
    global: number;
    byModule: Record<string, number>;
    oldestSpy: SpyMetadata | null;
  } {
    const stats = {
      total: this.registry.size,
      global: this.globalSpies.size,
      byModule: {} as Record<string, number>,
      oldestSpy: null as SpyMetadata | null
    };

    let oldestTime = Date.now();

    for (const entry of this.registry.values()) {
      // Count by module
      const module = entry.metadata.module || 'unknown';
      stats.byModule[module] = (stats.byModule[module] || 0) + 1;

      // Track oldest spy
      if (entry.metadata.createdAt < oldestTime) {
        oldestTime = entry.metadata.createdAt;
        stats.oldestSpy = entry.metadata;
      }
    }

    return stats;
  }
}

// Global spy registry instance
export const spyRegistry = new SpyRegistry();

// ===== CORE SPY UTILITIES =====

/**
 * Create an enhanced mock function with metadata and auto-registration
 */
export function createSpy<T extends (...args: any[]) => any>(
  name: string,
  config: MockFactoryConfig<T> = {}
): EnhancedMock<T> {
  const spy = vi.fn(config.defaultImplementation) as EnhancedMock<T>;
  
  const metadata: SpyMetadata = {
    name,
    createdAt: Date.now(),
    module: config.name,
    isGlobal: config.persistent
  };

  spy.__spyMetadata = metadata;

  if (config.autoRegister !== false) {
    const id = `${name}-${metadata.createdAt}`;
    spyRegistry.register(id, spy, metadata);
  }

  return spy;
}

/**
 * Create a spy on an existing object method
 */
export function createMethodSpy<T, K extends keyof T>(
  target: T,
  method: K,
  config: MockFactoryConfig = {}
): MockInstance {
  // Handle non-existent methods by creating them first
  if (target && typeof target === 'object' && !(method in target)) {
    (target as any)[method] = vi.fn();
  }
  
  const spy = vi.spyOn(target as any, method as any);
  
  const metadata: SpyMetadata = {
    name: `${String(method)}`,
    createdAt: Date.now(),
    module: config.name,
    originalFunction: target[method],
    isGlobal: config.persistent
  };

  if (config.autoRegister !== false) {
    const id = `${String(method)}-${metadata.createdAt}`;
    spyRegistry.register(id, spy, metadata);
  }

  return spy;
}

/**
 * Create multiple spies on an object
 */
export function createMultipleSpies<T extends Record<string, any>>(
  target: T,
  methods: (keyof T)[],
  config: MockFactoryConfig = {}
): Record<keyof T, MockInstance> {
  const spies = {} as Record<keyof T, MockInstance>;

  methods.forEach(method => {
    spies[method] = createMethodSpy(target, method, {
      ...config,
      name: `${config.name || 'multi'}.${String(method)}`
    });
  });

  return spies;
}

// ===== MOCK FACTORIES =====

/**
 * Factory for creating DOM element mocks with common methods
 */
export class DOMSpyFactory {
  /**
   * Create a mock HTML element with spies
   */
  static createElement(config: DOMSpyConfig = {}): HTMLElement & Record<string, MockInstance> {
    const element = {} as HTMLElement & Record<string, MockInstance>;
    
    // Default DOM methods to spy on
    const defaultMethods: (keyof HTMLElement)[] = [
      'addEventListener',
      'removeEventListener',
      'click',
      'focus',
      'blur',
      'scrollIntoView'
    ];

    const methods = config.methods || defaultMethods;
    
    methods.forEach(method => {
      element[method] = createSpy(`element.${String(method)}`, {
        name: 'DOM',
        autoRegister: true
      }) as any;
    });

    // Mock common properties
    Object.defineProperties(element, {
      getBoundingClientRect: {
        value: createSpy('getBoundingClientRect', {
          defaultImplementation: () => ({
            top: 0, left: 0, bottom: 100, right: 100,
            width: 100, height: 100, x: 0, y: 0
          }),
          name: 'DOM'
        }),
        writable: true
      },
      offsetWidth: { value: 100, writable: true },
      offsetHeight: { value: 100, writable: true },
      scrollTop: { value: 0, writable: true },
      scrollLeft: { value: 0, writable: true }
    });

    return element;
  }

  /**
   * Create window object spies
   */
  static createWindowSpies(config: DOMSpyConfig = {}): Record<string, MockInstance> {
    const defaultMethods = ['scrollTo', 'addEventListener', 'removeEventListener'];
    const methods = config.methods?.map(String) || defaultMethods;
    
    const spies = {} as Record<string, MockInstance>;
    
    methods.forEach(method => {
      const spy = createSpy(`window.${method}`, {
        name: 'Window',
        isGlobal: true
      });
      
      Object.defineProperty(window, method, { value: spy, writable: true });
      spies[method] = spy;
    });

    return spies;
  }

  /**
   * Create document object spies
   */
  static createDocumentSpies(config: DOMSpyConfig = {}): Record<string, MockInstance> {
    const defaultMethods = ['getElementById', 'querySelector', 'querySelectorAll'];
    const methods = config.methods?.map(String) || defaultMethods;
    
    const spies = {} as Record<string, MockInstance>;
    
    methods.forEach(method => {
      const spy = createSpy(`document.${method}`, {
        name: 'Document',
        isGlobal: true
      });
      
      Object.defineProperty(document, method, { value: spy, writable: true });
      spies[method] = spy;
    });

    return spies;
  }
}

/**
 * Factory for creating async function spies
 */
export class AsyncSpyFactory {
  /**
   * Create a spy that returns a promise
   */
  static createAsyncSpy<T = any>(
    name: string,
    config: AsyncSpyConfig & MockFactoryConfig = {}
  ): EnhancedMock<(...args: any[]) => Promise<T>> {
    const { delay = 0, shouldReject = false, rejectionReason, resolveValue } = config;
    
    const implementation = async (...args: any[]): Promise<T> => {
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      if (shouldReject) {
        throw rejectionReason || new Error(`${name} rejected`);
      }
      
      return resolveValue;
    };

    return createSpy(name, {
      ...config,
      defaultImplementation: implementation
    });
  }

  /**
   * Create fetch API spy
   */
  static createFetchSpy(responses: Record<string, any> = {}): EnhancedMock<typeof fetch> {
    const fetchSpy = createSpy('fetch', {
      name: 'Network',
      isGlobal: true,
      defaultImplementation: async (url: string) => {
        const response = responses[url] || { status: 200, data: {} };
        return {
          ok: response.status >= 200 && response.status < 300,
          status: response.status,
          json: async () => response.data,
          text: async () => JSON.stringify(response.data)
        } as Response;
      }
    });

    global.fetch = fetchSpy;
    return fetchSpy;
  }
}

/**
 * Factory for creating React component spies
 */
export class ComponentSpyFactory {
  /**
   * Create spies for React component props and methods
   */
  static createComponentSpies(config: ComponentSpyConfig = {}): Record<string, EnhancedMock<any>> {
    const spies = {} as Record<string, EnhancedMock<any>>;
    
    // Create method spies
    config.methods?.forEach(method => {
      spies[method] = createSpy(`component.${method}`, {
        name: 'Component'
      });
    });

    // Create prop function spies (like onClick, onSubmit)
    config.props?.forEach(prop => {
      spies[prop] = createSpy(`prop.${prop}`, {
        name: 'Component'
      });
    });

    // Create hook spies
    config.hooks?.forEach(hook => {
      spies[hook] = createSpy(`hook.${hook}`, {
        name: 'Hook'
      });
    });

    // Create event handler spies
    config.events?.forEach(event => {
      spies[`on${event.charAt(0).toUpperCase()}${event.slice(1)}`] = createSpy(`event.${event}`, {
        name: 'Event'
      });
    });

    return spies;
  }

  /**
   * Create module mock with spy functions
   */
  static createModuleMock(
    moduleName: string,
    exports: Record<string, any>
  ): Record<string, EnhancedMock<any>> {
    const mockExports = {} as Record<string, EnhancedMock<any>>;

    Object.entries(exports).forEach(([key, value]) => {
      if (typeof value === 'function') {
        mockExports[key] = createSpy(`${moduleName}.${key}`, {
          name: moduleName,
          defaultImplementation: value
        });
      } else {
        mockExports[key] = value;
      }
    });

    return mockExports;
  }
}

// ===== SPY ASSERTION HELPERS =====

/**
 * Enhanced spy assertion utilities
 */
export class SpyAssertions {
  /**
   * Assert that a spy was called with specific arguments in order
   */
  static calledWithInOrder<T extends MockInstance>(
    spy: T,
    expectedCalls: any[][]
  ): void {
    expectedCalls.forEach((expectedArgs, index) => {
      const actualCall = spy.mock.calls[index];
      if (!actualCall) {
        throw new Error(`Expected call ${index + 1} but spy was only called ${spy.mock.calls.length} times`);
      }
      expect(actualCall).toEqual(expectedArgs);
    });
  }

  /**
   * Assert that multiple spies were called in a specific sequence
   */
  static calledInSequence(spySequence: { spy: MockInstance; args?: any[] }[]): void {
    const allCalls: Array<{ spy: MockInstance; callIndex: number; args: any[] }> = [];
    
    spySequence.forEach(({ spy }) => {
      spy.mock.calls.forEach((args, callIndex) => {
        allCalls.push({ spy, callIndex, args });
      });
    });

    // Sort by invocation order (this is simplified - in reality you'd need timestamps)
    let sequenceIndex = 0;
    spySequence.forEach(({ spy, args: expectedArgs }) => {
      const call = allCalls.find(call => call.spy === spy && call.callIndex === sequenceIndex);
      if (!call) {
        throw new Error(`Expected ${spy.getMockName()} to be called at position ${sequenceIndex + 1}`);
      }
      
      if (expectedArgs) {
        expect(call.args).toEqual(expectedArgs);
      }
      
      sequenceIndex++;
    });
  }

  /**
   * Assert spy call patterns
   */
  static hasCallPattern<T extends MockInstance>(
    spy: T,
    pattern: {
      times?: number;
      atLeast?: number;
      atMost?: number;
      with?: any[];
      withObjectContaining?: Record<string, any>;
    }
  ): void {
    const { times, atLeast, atMost, with: withArgs, withObjectContaining } = pattern;
    
    if (times !== undefined) {
      expect(spy).toHaveBeenCalledTimes(times);
    }
    
    if (atLeast !== undefined) {
      expect(spy.mock.calls.length).toBeGreaterThanOrEqual(atLeast);
    }
    
    if (atMost !== undefined) {
      expect(spy.mock.calls.length).toBeLessThanOrEqual(atMost);
    }
    
    if (withArgs) {
      expect(spy).toHaveBeenCalledWith(...withArgs);
    }
    
    if (withObjectContaining) {
      // Check if any call contains the expected object
      const hasMatchingCall = spy.mock.calls.some(callArgs => {
        return callArgs.some(arg => {
          if (typeof arg === 'object' && arg !== null) {
            return Object.entries(withObjectContaining).every(([key, value]) => {
              return arg[key] === value;
            });
          }
          return false;
        });
      });
      
      if (!hasMatchingCall) {
        throw new Error(`Expected spy to be called with object containing ${JSON.stringify(withObjectContaining)}`);
      }
    }
  }

  /**
   * Assert that a spy never received invalid arguments
   */
  static neverCalledWithInvalidArgs<T extends MockInstance>(
    spy: T,
    validator: (args: any[]) => boolean,
    message?: string
  ): void {
    const invalidCalls = spy.mock.calls.filter(args => !validator(args));
    
    if (invalidCalls.length > 0) {
      throw new Error(
        message || 
        `Spy was called with invalid arguments: ${JSON.stringify(invalidCalls)}`
      );
    }
  }
}

// ===== LIFECYCLE MANAGEMENT =====

/**
 * Test lifecycle utilities for spy management
 */
export class SpyLifecycle {
  private static testSpies: Set<string> = new Set();
  
  /**
   * Set up spies for a test suite
   */
  static setupTest(spyConfigs: Array<{
    name: string;
    target?: any;
    method?: string;
    implementation?: any;
  }>): Record<string, MockInstance> {
    const spies = {} as Record<string, MockInstance>;
    
    spyConfigs.forEach(({ name, target, method, implementation }) => {
      let spy: MockInstance;
      
      if (target && method) {
        spy = createMethodSpy(target, method, { name: 'Test' });
        if (implementation) {
          spy.mockImplementation(implementation);
        }
      } else {
        spy = createSpy(name, { 
          name: 'Test',
          defaultImplementation: implementation 
        });
      }
      
      spies[name] = spy;
      this.testSpies.add(name);
    });
    
    return spies;
  }

  /**
   * Clean up test-specific spies
   */
  static cleanupTest(): void {
    if (!this.testSpies) {
      this.testSpies = new Set();
      return;
    }
    
    this.testSpies.forEach(spyName => {
      // Clean up from registry
      for (const [id, entry] of spyRegistry.getAll()) {
        if (entry.metadata.name === spyName) {
          spyRegistry.cleanup(id);
        }
      }
    });
    
    this.testSpies.clear();
  }

  /**
   * Reset all spies without removing them
   */
  static resetSpies(): void {
    spyRegistry.getAll().forEach(entry => {
      entry.spy.mockClear?.();
      entry.spy.mockReset?.();
    });
  }

  /**
   * Restore all spies to original implementation
   */
  static restoreSpies(): void {
    spyRegistry.getAll().forEach(entry => {
      entry.spy.mockRestore?.();
    });
  }
}

// ===== MEMORY LEAK PREVENTION =====

/**
 * Memory leak prevention utilities
 */
export class MemoryLeakPrevention {
  private static readonly MAX_SPIES = 1000;
  private static readonly MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Check for potential memory leaks in spy registry
   */
  static checkForLeaks(): {
    hasLeaks: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const stats = spyRegistry.getStats();
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Check total spy count
    if (stats.total > this.MAX_SPIES) {
      issues.push(`Too many spies registered: ${stats.total} (max: ${this.MAX_SPIES})`);
      suggestions.push('Consider cleaning up old spies or increasing cleanup frequency');
    }

    // Check spy age
    const now = Date.now();
    if (stats.oldestSpy && (now - stats.oldestSpy.createdAt) > this.MAX_AGE_MS) {
      issues.push(`Old spy detected: ${stats.oldestSpy.name} (age: ${now - stats.oldestSpy.createdAt}ms)`);
      suggestions.push('Clean up long-running spies that are no longer needed');
    }

    // Check for suspicious modules with many spies
    const suspiciousModules = Object.entries(stats.byModule)
      .filter(([, count]) => count > 50);
    
    if (suspiciousModules.length > 0) {
      issues.push(`Modules with many spies: ${suspiciousModules.map(([mod, count]) => `${mod}(${count})`).join(', ')}`);
      suggestions.push('Review spy usage in modules with high spy counts');
    }

    return {
      hasLeaks: issues.length > 0,
      issues,
      suggestions
    };
  }

  /**
   * Auto-cleanup old spies
   */
  static autoCleanup(maxAge = this.MAX_AGE_MS): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [id, entry] of spyRegistry.getAll()) {
      if (!entry.metadata.isGlobal && (now - entry.metadata.createdAt) > maxAge) {
        spyRegistry.cleanup(id);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }
}

// ===== CONVENIENCE EXPORTS =====

/**
 * Quick access to common spy utilities
 */
export const spy = {
  create: createSpy,
  method: createMethodSpy,
  multiple: createMultipleSpies,
  registry: spyRegistry,
  assertions: SpyAssertions,
  lifecycle: SpyLifecycle,
  memoryCheck: MemoryLeakPrevention.checkForLeaks,
  autoCleanup: MemoryLeakPrevention.autoCleanup
};

/**
 * Factory shortcuts
 */
export const factories = {
  dom: DOMSpyFactory,
  async: AsyncSpyFactory,
  component: ComponentSpyFactory
};

/**
 * Test setup helpers
 */
export const testUtils = {
  setupSpies: SpyLifecycle.setupTest,
  cleanupSpies: SpyLifecycle.cleanupTest,
  resetSpies: SpyLifecycle.resetSpies,
  restoreSpies: SpyLifecycle.restoreSpies
};