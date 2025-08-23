/**
 * Comprehensive Test Suite for Advanced Spy Utilities
 * 
 * This test suite demonstrates enterprise-grade spy testing patterns and validates
 * the spy utility framework. It covers all aspects of spy lifecycle management,
 * mock factories, assertion helpers, and memory leak prevention.
 * 
 * @jest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import {
  createSpy,
  createMethodSpy,
  createMultipleSpies,
  spyRegistry,
  SpyAssertions,
  SpyLifecycle,
  MemoryLeakPrevention,
  DOMSpyFactory,
  AsyncSpyFactory,
  ComponentSpyFactory,
  spy,
  factories,
  testUtils,
  type EnhancedMock,
  type SpyMetadata,
  type MockFactoryConfig,
  type ComponentSpyConfig,
  type DOMSpyConfig,
  type AsyncSpyConfig
} from '../utils/spyUtils';

// ===== TEST HELPERS =====

/**
 * Helper class for creating test objects
 */
class TestTarget {
  value = 'initial';
  
  getValue(): string {
    return this.value;
  }
  
  setValue(newValue: string): void {
    this.value = newValue;
  }
  
  async asyncMethod(delay = 10): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => resolve(`async-${this.value}`), delay);
    });
  }
  
  throwingMethod(): never {
    throw new Error('Test error');
  }
}

/**
 * Mock React-like component for testing
 */
const MockComponent = {
  render: (props: any) => props,
  componentDidMount: () => {},
  componentWillUnmount: () => {},
  onClick: () => {},
  onSubmit: () => {}
};

// ===== CORE SPY UTILITIES TESTS =====

describe('SpyUtils - Core Utilities', () => {
  let testTarget: TestTarget;

  beforeEach(() => {
    testTarget = new TestTarget();
    spyRegistry.cleanupAll(true); // Clean up everything including globals
  });

  afterEach(() => {
    spyRegistry.cleanupAll();
  });

  describe('createSpy', () => {
    it('creates basic spy function with metadata', () => {
      const testSpy = createSpy('testFunction');
      
      expect(testSpy).toBeDefined();
      expect(typeof testSpy).toBe('function');
      expect(testSpy.__spyMetadata).toBeDefined();
      expect(testSpy.__spyMetadata?.name).toBe('testFunction');
      expect(testSpy.__spyMetadata?.createdAt).toBeTypeOf('number');
    });

    it('creates spy with default implementation', () => {
      const defaultImpl = (x: number) => x * 2;
      const testSpy = createSpy('multiplier', {
        defaultImplementation: defaultImpl
      });
      
      const result = testSpy(5);
      
      expect(result).toBe(10);
      expect(testSpy).toHaveBeenCalledWith(5);
      expect(testSpy).toHaveBeenCalledTimes(1);
    });

    it('auto-registers spy when autoRegister is not disabled', () => {
      const testSpy = createSpy('autoRegistered');
      
      // Check that spy is registered
      const registryEntries = spyRegistry.getAll();
      const spyEntry = Array.from(registryEntries.values())
        .find(entry => entry.metadata.name === 'autoRegistered');
      
      expect(spyEntry).toBeDefined();
      expect(spyEntry?.spy).toBe(testSpy);
    });

    it('skips registration when autoRegister is false', () => {
      const testSpy = createSpy('notRegistered', {
        autoRegister: false
      });
      
      const registryEntries = spyRegistry.getAll();
      const spyEntry = Array.from(registryEntries.values())
        .find(entry => entry.metadata.name === 'notRegistered');
      
      expect(spyEntry).toBeUndefined();
    });

    it('handles persistent spies correctly', () => {
      const persistentSpy = createSpy('persistent', {
        persistent: true
      });
      
      expect(persistentSpy.__spyMetadata?.isGlobal).toBe(true);
      
      // Cleanup non-global spies
      spyRegistry.cleanupAll(false);
      
      // Persistent spy should still be registered
      const registryEntries = spyRegistry.getAll();
      const spyEntry = Array.from(registryEntries.values())
        .find(entry => entry.metadata.name === 'persistent');
      
      expect(spyEntry).toBeDefined();
    });
  });

  describe('createMethodSpy', () => {
    it('creates spy on existing method', () => {
      const methodSpy = createMethodSpy(testTarget, 'getValue');
      
      // Original method should be replaced with spy
      const result = testTarget.getValue();
      
      expect(methodSpy).toHaveBeenCalled();
      expect(methodSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe('initial'); // Original behavior preserved
    });

    it('preserves original method behavior by default', () => {
      createMethodSpy(testTarget, 'setValue');
      
      testTarget.setValue('modified');
      
      expect(testTarget.value).toBe('modified');
    });

    it('allows method implementation override', () => {
      const methodSpy = createMethodSpy(testTarget, 'getValue');
      methodSpy.mockReturnValue('mocked');
      
      const result = testTarget.getValue();
      
      expect(result).toBe('mocked');
      expect(methodSpy).toHaveBeenCalledTimes(1);
    });

    it('handles async methods correctly', async () => {
      const asyncSpy = createMethodSpy(testTarget, 'asyncMethod');
      
      const promise = testTarget.asyncMethod(50);
      const result = await promise;
      
      expect(asyncSpy).toHaveBeenCalledWith(50);
      expect(result).toBe('async-initial');
    });

    it('handles throwing methods', () => {
      const throwingSpy = createMethodSpy(testTarget, 'throwingMethod');
      
      expect(() => testTarget.throwingMethod()).toThrow('Test error');
      expect(throwingSpy).toHaveBeenCalledTimes(1);
    });

    it('handles non-existent methods gracefully', () => {
      const target = {} as any;
      
      // This should create the method and spy it
      const spy = createMethodSpy(target, 'nonExistent');
      
      expect(spy).toBeDefined();
      expect(target.nonExistent).toBe(spy);
      
      // Should be callable
      target.nonExistent('test');
      expect(spy).toHaveBeenCalledWith('test');
    });
  });

  describe('createMultipleSpies', () => {
    it('creates spies for multiple methods', () => {
      const spies = createMultipleSpies(testTarget, ['getValue', 'setValue', 'asyncMethod']);
      
      expect(Object.keys(spies)).toEqual(['getValue', 'setValue', 'asyncMethod']);
      expect(spies.getValue).toBeDefined();
      expect(spies.setValue).toBeDefined();
      expect(spies.asyncMethod).toBeDefined();
    });

    it('all created spies function correctly', () => {
      const spies = createMultipleSpies(testTarget, ['getValue', 'setValue']);
      
      testTarget.getValue();
      testTarget.setValue('test');
      
      expect(spies.getValue).toHaveBeenCalledTimes(1);
      expect(spies.setValue).toHaveBeenCalledWith('test');
    });

    it('applies configuration to all spies', () => {
      const spies = createMultipleSpies(testTarget, ['getValue', 'setValue'], {
        name: 'MultiSpyTest'
      });
      
      // Check that spies are registered with correct module name
      const registryEntries = spyRegistry.getAll();
      const multiSpyEntries = Array.from(registryEntries.values())
        .filter(entry => entry.metadata.module?.includes('MultiSpyTest'));
      
      expect(multiSpyEntries.length).toBe(2);
    });
  });
});

// ===== SPY REGISTRY TESTS =====

describe('SpyUtils - Spy Registry', () => {
  beforeEach(() => {
    spyRegistry.cleanupAll(true);
  });

  afterEach(() => {
    spyRegistry.cleanupAll(true);
  });

  describe('Registry Management', () => {
    it('registers and retrieves spies correctly', () => {
      const testSpy = createSpy('registryTest');
      const registryId = `registryTest-${testSpy.__spyMetadata?.createdAt}`;
      
      expect(spyRegistry.has(registryId)).toBe(true);
      
      const entry = spyRegistry.get(registryId);
      expect(entry).toBeDefined();
      expect(entry?.spy).toBe(testSpy);
      expect(entry?.metadata.name).toBe('registryTest');
    });

    it('cleans up individual spies', () => {
      const testSpy = createSpy('cleanupTest');
      const registryId = `cleanupTest-${testSpy.__spyMetadata?.createdAt}`;
      
      expect(spyRegistry.has(registryId)).toBe(true);
      
      const cleaned = spyRegistry.cleanup(registryId);
      
      expect(cleaned).toBe(true);
      expect(spyRegistry.has(registryId)).toBe(false);
    });

    it('handles cleanup of non-existent spies', () => {
      const cleaned = spyRegistry.cleanup('non-existent-id');
      expect(cleaned).toBe(false);
    });

    it('cleans up all non-global spies', () => {
      createSpy('regular1');
      createSpy('regular2');
      createSpy('global1', { persistent: true });
      
      expect(spyRegistry.getAll().size).toBe(3);
      
      spyRegistry.cleanupAll(false);
      
      expect(spyRegistry.getAll().size).toBe(1);
      
      // Verify the remaining spy is global
      const remaining = Array.from(spyRegistry.getAll().values())[0];
      expect(remaining.metadata.isGlobal).toBe(true);
    });

    it('provides accurate registry statistics', () => {
      createSpy('module1Spy', { name: 'Module1' });
      createSpy('module1SpyB', { name: 'Module1' });
      createSpy('module2Spy', { name: 'Module2' });
      createSpy('globalSpy', { persistent: true });
      
      const stats = spyRegistry.getStats();
      
      expect(stats.total).toBe(4);
      expect(stats.global).toBe(1);
      expect(stats.byModule.Module1).toBe(2);
      expect(stats.byModule.Module2).toBe(1);
      expect(stats.oldestSpy).toBeDefined();
    });
  });
});

// ===== MOCK FACTORIES TESTS =====

describe('SpyUtils - Mock Factories', () => {
  beforeEach(() => {
    spyRegistry.cleanupAll(true);
  });

  afterEach(() => {
    spyRegistry.cleanupAll(true);
  });

  describe('DOMSpyFactory', () => {
    it('creates element with default DOM method spies', () => {
      const element = DOMSpyFactory.createElement();
      
      expect(element.addEventListener).toBeDefined();
      expect(element.removeEventListener).toBeDefined();
      expect(element.click).toBeDefined();
      expect(element.focus).toBeDefined();
      expect(element.blur).toBeDefined();
      expect(element.scrollIntoView).toBeDefined();
      expect(element.getBoundingClientRect).toBeDefined();
    });

    it('creates element with custom method configuration', () => {
      const config: DOMSpyConfig = {
        methods: ['click', 'focus']
      };
      
      const element = DOMSpyFactory.createElement(config);
      
      expect(element.click).toBeDefined();
      expect(element.focus).toBeDefined();
      expect(element.addEventListener).toBeUndefined();
    });

    it('element spies track method calls correctly', () => {
      const element = DOMSpyFactory.createElement();
      
      element.click();
      element.focus();
      
      expect(element.click).toHaveBeenCalledTimes(1);
      expect(element.focus).toHaveBeenCalledTimes(1);
    });

    it('getBoundingClientRect returns mock rect', () => {
      const element = DOMSpyFactory.createElement();
      
      const rect = element.getBoundingClientRect();
      
      expect(rect).toEqual({
        top: 0, left: 0, bottom: 100, right: 100,
        width: 100, height: 100, x: 0, y: 0
      });
    });

    it('creates window spies correctly', () => {
      const windowSpies = DOMSpyFactory.createWindowSpies();
      
      expect(windowSpies.scrollTo).toBeDefined();
      expect(window.scrollTo).toBe(windowSpies.scrollTo);
      
      window.scrollTo({ top: 100, behavior: 'smooth' });
      
      expect(windowSpies.scrollTo).toHaveBeenCalledWith({
        top: 100,
        behavior: 'smooth'
      });
    });

    it('creates document spies correctly', () => {
      const documentSpies = DOMSpyFactory.createDocumentSpies();
      
      expect(documentSpies.getElementById).toBeDefined();
      expect(document.getElementById).toBe(documentSpies.getElementById);
      
      document.getElementById('test-id');
      
      expect(documentSpies.getElementById).toHaveBeenCalledWith('test-id');
    });
  });

  describe('AsyncSpyFactory', () => {
    it('creates async spy with default behavior', async () => {
      const asyncSpy = AsyncSpyFactory.createAsyncSpy('testAsync');
      
      const result = await asyncSpy('test');
      
      expect(asyncSpy).toHaveBeenCalledWith('test');
      expect(result).toBeUndefined(); // Default resolve value
    });

    it('creates async spy with custom resolve value', async () => {
      const asyncSpy = AsyncSpyFactory.createAsyncSpy('testAsync', {
        resolveValue: 'success'
      });
      
      const result = await asyncSpy();
      
      expect(result).toBe('success');
    });

    it('creates async spy with delay', async () => {
      const asyncSpy = AsyncSpyFactory.createAsyncSpy('delayedAsync', {
        delay: 50,
        resolveValue: 'delayed-result'
      });
      
      const startTime = Date.now();
      const result = await asyncSpy();
      const endTime = Date.now();
      
      expect(result).toBe('delayed-result');
      expect(endTime - startTime).toBeGreaterThanOrEqual(45); // Allow some tolerance
    });

    it('creates rejecting async spy', async () => {
      const asyncSpy = AsyncSpyFactory.createAsyncSpy('rejectingAsync', {
        shouldReject: true,
        rejectionReason: new Error('Custom rejection')
      });
      
      await expect(asyncSpy()).rejects.toThrow('Custom rejection');
      expect(asyncSpy).toHaveBeenCalledTimes(1);
    });

    it('creates fetch spy with custom responses', async () => {
      const responses = {
        '/api/users': { status: 200, data: { users: [] } },
        '/api/error': { status: 500, data: { error: 'Server Error' } }
      };
      
      const fetchSpy = AsyncSpyFactory.createFetchSpy(responses);
      
      // Test successful response
      const successResponse = await fetch('/api/users');
      const successData = await successResponse.json();
      
      expect(fetchSpy).toHaveBeenCalledWith('/api/users');
      expect(successResponse.ok).toBe(true);
      expect(successData).toEqual({ users: [] });
      
      // Test error response
      const errorResponse = await fetch('/api/error');
      
      expect(errorResponse.ok).toBe(false);
      expect(errorResponse.status).toBe(500);
    });
  });

  describe('ComponentSpyFactory', () => {
    it('creates component method spies', () => {
      const config: ComponentSpyConfig = {
        methods: ['render', 'componentDidMount']
      };
      
      const spies = ComponentSpyFactory.createComponentSpies(config);
      
      expect(spies.render).toBeDefined();
      expect(spies.componentDidMount).toBeDefined();
      
      // Test spy functionality
      spies.render({ prop: 'value' });
      spies.componentDidMount();
      
      expect(spies.render).toHaveBeenCalledWith({ prop: 'value' });
      expect(spies.componentDidMount).toHaveBeenCalledTimes(1);
    });

    it('creates prop function spies', () => {
      const config: ComponentSpyConfig = {
        props: ['onClick', 'onSubmit']
      };
      
      const spies = ComponentSpyFactory.createComponentSpies(config);
      
      expect(spies.onClick).toBeDefined();
      expect(spies.onSubmit).toBeDefined();
      
      // Simulate prop calls
      spies.onClick({ target: 'button' });
      spies.onSubmit({ preventDefault: vi.fn() });
      
      expect(spies.onClick).toHaveBeenCalledWith({ target: 'button' });
      expect(spies.onSubmit).toHaveBeenCalledWith({ preventDefault: expect.any(Function) });
    });

    it('creates event handler spies with correct naming', () => {
      const config: ComponentSpyConfig = {
        events: ['click', 'submit', 'change']
      };
      
      const spies = ComponentSpyFactory.createComponentSpies(config);
      
      expect(spies.onClick).toBeDefined();
      expect(spies.onSubmit).toBeDefined();
      expect(spies.onChange).toBeDefined();
      
      // Test event handlers
      spies.onClick();
      spies.onSubmit();
      spies.onChange();
      
      expect(spies.onClick).toHaveBeenCalledTimes(1);
      expect(spies.onSubmit).toHaveBeenCalledTimes(1);
      expect(spies.onChange).toHaveBeenCalledTimes(1);
    });

    it('creates module mock with function spies', () => {
      const moduleExports = {
        utilFunction: (x: number) => x * 2,
        constValue: 'constant',
        asyncFunction: async () => 'async-result'
      };
      
      const mockModule = ComponentSpyFactory.createModuleMock('TestModule', moduleExports);
      
      expect(mockModule.utilFunction).toBeDefined();
      expect(mockModule.constValue).toBe('constant');
      expect(mockModule.asyncFunction).toBeDefined();
      
      // Test function spy
      const result = mockModule.utilFunction(5);
      expect(result).toBe(10);
      expect(mockModule.utilFunction).toHaveBeenCalledWith(5);
    });
  });
});

// ===== SPY ASSERTIONS TESTS =====

describe('SpyUtils - Spy Assertions', () => {
  let testSpy: EnhancedMock<(...args: any[]) => any>;

  beforeEach(() => {
    testSpy = createSpy('assertionTest', { autoRegister: false });
    spyRegistry.cleanupAll(true);
  });

  describe('SpyAssertions', () => {
    it('validates call order with calledWithInOrder', () => {
      testSpy('first', 'call');
      testSpy('second', 'call');
      testSpy('third', 'call');
      
      expect(() => {
        SpyAssertions.calledWithInOrder(testSpy, [
          ['first', 'call'],
          ['second', 'call'],
          ['third', 'call']
        ]);
      }).not.toThrow();
    });

    it('throws error for incorrect call order', () => {
      testSpy('first');
      testSpy('second');
      
      expect(() => {
        SpyAssertions.calledWithInOrder(testSpy, [
          ['first'],
          ['wrong']
        ]);
      }).toThrow();
    });

    it('throws error for missing calls', () => {
      testSpy('only-call');
      
      expect(() => {
        SpyAssertions.calledWithInOrder(testSpy, [
          ['only-call'],
          ['missing-call']
        ]);
      }).toThrow('Expected call 2 but spy was only called 1 times');
    });

    it('validates call patterns with hasCallPattern', () => {
      testSpy('arg1', { nested: 'object' });
      testSpy('arg2', { nested: 'object' });
      
      // Test with valid pattern
      expect(() => {
        SpyAssertions.hasCallPattern(testSpy, {
          times: 2,
          withObjectContaining: { nested: 'object' }
        });
      }).not.toThrow();
    });

    it('validates minimum call count', () => {
      testSpy();
      testSpy();
      testSpy();
      
      expect(() => {
        SpyAssertions.hasCallPattern(testSpy, {
          atLeast: 2
        });
      }).not.toThrow();
      
      expect(() => {
        SpyAssertions.hasCallPattern(testSpy, {
          atLeast: 5
        });
      }).toThrow();
    });

    it('validates maximum call count', () => {
      testSpy();
      testSpy();
      
      expect(() => {
        SpyAssertions.hasCallPattern(testSpy, {
          atMost: 5
        });
      }).not.toThrow();
      
      expect(() => {
        SpyAssertions.hasCallPattern(testSpy, {
          atMost: 1
        });
      }).toThrow();
    });

    it('validates against invalid arguments', () => {
      const validator = (args: any[]) => args.length > 0 && typeof args[0] === 'string';
      
      testSpy('valid');
      testSpy('also-valid');
      
      expect(() => {
        SpyAssertions.neverCalledWithInvalidArgs(testSpy, validator);
      }).not.toThrow();
      
      testSpy(123); // Invalid call
      
      expect(() => {
        SpyAssertions.neverCalledWithInvalidArgs(testSpy, validator, 'Number not allowed');
      }).toThrow('Number not allowed');
    });
  });
});

// ===== LIFECYCLE MANAGEMENT TESTS =====

describe('SpyUtils - Lifecycle Management', () => {
  let testTarget: TestTarget;

  beforeEach(() => {
    testTarget = new TestTarget();
    spyRegistry.cleanupAll(true);
  });

  afterEach(() => {
    SpyLifecycle.cleanupTest();
    spyRegistry.cleanupAll(true);
  });

  describe('SpyLifecycle', () => {
    it('sets up test spies correctly', () => {
      const spyConfigs = [
        { name: 'standalone', implementation: () => 'mocked' },
        { name: 'getValue', target: testTarget, method: 'getValue' }
      ];
      
      const spies = SpyLifecycle.setupTest(spyConfigs);
      
      expect(spies.standalone).toBeDefined();
      expect(spies.getValue).toBeDefined();
      
      const standaloneResult = spies.standalone();
      const getValueResult = testTarget.getValue();
      
      expect(standaloneResult).toBe('mocked');
      expect(spies.getValue).toHaveBeenCalledTimes(1);
    });

    it('cleans up test spies', () => {
      const spyConfigs = [
        { name: 'testSpy1' },
        { name: 'testSpy2' }
      ];
      
      const spies = SpyLifecycle.setupTest(spyConfigs);
      
      expect(Object.keys(spies)).toEqual(['testSpy1', 'testSpy2']);
      
      SpyLifecycle.cleanupTest();
      
      // Verify spies are cleaned from registry
      const registrySpies = Array.from(spyRegistry.getAll().values())
        .filter(entry => entry.metadata.name.startsWith('testSpy'));
      
      expect(registrySpies).toHaveLength(0);
    });

    it('resets spies without removing them', () => {
      const testSpy = createSpy('resetTest');
      testSpy('call1');
      testSpy('call2');
      
      expect(testSpy).toHaveBeenCalledTimes(2);
      
      SpyLifecycle.resetSpies();
      
      expect(testSpy).toHaveBeenCalledTimes(0);
      
      // Spy should still be callable
      testSpy('call3');
      expect(testSpy).toHaveBeenCalledTimes(1);
      expect(testSpy).toHaveBeenCalledWith('call3');
    });

    it('restores spies to original implementation', () => {
      const originalValue = testTarget.getValue();
      const methodSpy = createMethodSpy(testTarget, 'getValue');
      methodSpy.mockReturnValue('mocked');
      
      expect(testTarget.getValue()).toBe('mocked');
      
      SpyLifecycle.restoreSpies();
      
      expect(testTarget.getValue()).toBe(originalValue);
    });
  });
});

// ===== MEMORY LEAK PREVENTION TESTS =====

describe('SpyUtils - Memory Leak Prevention', () => {
  beforeEach(() => {
    spyRegistry.cleanupAll(true);
  });

  afterEach(() => {
    spyRegistry.cleanupAll(true);
  });

  describe('MemoryLeakPrevention', () => {
    it('detects no leaks with normal usage', () => {
      createSpy('normal1');
      createSpy('normal2');
      
      const leakCheck = MemoryLeakPrevention.checkForLeaks();
      
      expect(leakCheck.hasLeaks).toBe(false);
      expect(leakCheck.issues).toHaveLength(0);
    });

    it('detects old spies as potential leaks', async () => {
      // Create a spy and artificially age it
      const oldSpy = createSpy('oldSpy');
      if (oldSpy.__spyMetadata) {
        oldSpy.__spyMetadata.createdAt = Date.now() - (6 * 60 * 1000); // 6 minutes old
      }
      
      const leakCheck = MemoryLeakPrevention.checkForLeaks();
      
      expect(leakCheck.hasLeaks).toBe(true);
      expect(leakCheck.issues.some(issue => issue.includes('Old spy detected'))).toBe(true);
    });

    it('detects modules with suspicious spy counts', () => {
      // Create many spies for the same module
      for (let i = 0; i < 60; i++) {
        createSpy(`suspiciousSpy${i}`, { name: 'SuspiciousModule' });
      }
      
      const leakCheck = MemoryLeakPrevention.checkForLeaks();
      
      expect(leakCheck.hasLeaks).toBe(true);
      expect(leakCheck.issues.some(issue => 
        issue.includes('Modules with many spies') && 
        issue.includes('SuspiciousModule')
      )).toBe(true);
    });

    it('auto-cleans old spies', () => {
      // Create some normal spies
      createSpy('recent1');
      createSpy('recent2');
      
      // Create old spies by manipulating metadata
      const oldSpy1 = createSpy('old1');
      const oldSpy2 = createSpy('old2');
      const globalOldSpy = createSpy('globalOld', { persistent: true });
      
      if (oldSpy1.__spyMetadata) {
        oldSpy1.__spyMetadata.createdAt = Date.now() - (6 * 60 * 1000);
      }
      if (oldSpy2.__spyMetadata) {
        oldSpy2.__spyMetadata.createdAt = Date.now() - (6 * 60 * 1000);
      }
      if (globalOldSpy.__spyMetadata) {
        globalOldSpy.__spyMetadata.createdAt = Date.now() - (6 * 60 * 1000);
      }
      
      const initialCount = spyRegistry.getAll().size;
      expect(initialCount).toBe(5);
      
      const cleanedCount = MemoryLeakPrevention.autoCleanup(5 * 60 * 1000); // 5 minutes
      
      expect(cleanedCount).toBe(2); // Only non-global old spies cleaned
      expect(spyRegistry.getAll().size).toBe(3); // recent1, recent2, globalOld
    });
  });
});

// ===== INTEGRATION TESTS =====

describe('SpyUtils - Integration Patterns', () => {
  beforeEach(() => {
    spyRegistry.cleanupAll(true);
  });

  afterEach(() => {
    spyRegistry.cleanupAll(true);
  });

  describe('Cross-Component Spy Coordination', () => {
    it('coordinates spies across multiple components', () => {
      // Set up component spies
      const navSpies = ComponentSpyFactory.createComponentSpies({
        methods: ['render'],
        events: ['click']
      });
      
      const formSpies = ComponentSpyFactory.createComponentSpies({
        methods: ['validate'],
        events: ['submit']
      });
      
      // Set up DOM spies
      const element = DOMSpyFactory.createElement();
      
      // Simulate component interaction
      navSpies.onClick({ target: element });
      formSpies.onSubmit({ preventDefault: vi.fn() });
      element.focus();
      
      // Assert coordinated behavior
      expect(navSpies.onClick).toHaveBeenCalledWith({ target: element });
      expect(formSpies.onSubmit).toHaveBeenCalledTimes(1);
      expect(element.focus).toHaveBeenCalledTimes(1);
      
      // Verify spy sequence using assertions
      SpyAssertions.hasCallPattern(navSpies.onClick, {
        times: 1,
        with: [{ target: element }]
      });
      
      SpyAssertions.hasCallPattern(formSpies.onSubmit, {
        times: 1
      });
    });

    it('handles complex async spy interactions', async () => {
      // Set up async spies with different behaviors
      const apiSpy = AsyncSpyFactory.createAsyncSpy('apiCall', {
        delay: 10,
        resolveValue: { data: 'success' }
      });
      
      const errorApiSpy = AsyncSpyFactory.createAsyncSpy('errorApiCall', {
        delay: 5,
        shouldReject: true,
        rejectionReason: new Error('API Error')
      });
      
      const callbackSpy = createSpy('callback');
      
      // Simulate async workflow
      try {
        const result1 = await apiSpy('param1');
        callbackSpy('success', result1);
        
        await errorApiSpy('param2');
      } catch (error) {
        callbackSpy('error', error);
      }
      
      // Assert async interaction patterns
      expect(apiSpy).toHaveBeenCalledWith('param1');
      expect(errorApiSpy).toHaveBeenCalledWith('param2');
      
      expect(callbackSpy).toHaveBeenCalledTimes(2);
      expect(callbackSpy).toHaveBeenNthCalledWith(1, 'success', { data: 'success' });
      expect(callbackSpy).toHaveBeenNthCalledWith(2, 'error', expect.any(Error));
    });
  });

  describe('Event Handling Spy Patterns', () => {
    it('tracks complex event propagation', () => {
      // Set up event handling spies
      const parentHandlerSpy = createSpy('parentHandler');
      const childHandlerSpy = createSpy('childHandler');
      const documentHandlerSpy = createSpy('documentHandler');
      
      // Simulate event propagation
      const mockEvent = {
        target: 'child',
        currentTarget: 'parent',
        bubbles: true,
        preventDefault: createSpy('preventDefault'),
        stopPropagation: createSpy('stopPropagation')
      };
      
      // Child handler (called first)
      childHandlerSpy(mockEvent);
      
      // Parent handler (bubbling)
      parentHandlerSpy(mockEvent);
      
      // Document handler (final bubble)
      documentHandlerSpy(mockEvent);
      
      // Assert event handling sequence
      SpyAssertions.calledWithInOrder(childHandlerSpy, [[mockEvent]]);
      SpyAssertions.calledWithInOrder(parentHandlerSpy, [[mockEvent]]);
      SpyAssertions.calledWithInOrder(documentHandlerSpy, [[mockEvent]]);
      
      // Verify all handlers received the same event object
      expect(childHandlerSpy).toHaveBeenCalledWith(mockEvent);
      expect(parentHandlerSpy).toHaveBeenCalledWith(mockEvent);
      expect(documentHandlerSpy).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('Hook Integration Patterns', () => {
    it('simulates React hook spy integration', () => {
      // Mock React hooks
      const useStateSpy = createSpy('useState', {
        defaultImplementation: (initial: any) => [initial, createSpy(`setState-${Date.now()}`)]
      });
      
      const useEffectSpy = createSpy('useEffect');
      const useCallbackSpy = createSpy('useCallback', {
        defaultImplementation: (callback: Function) => callback
      });
      
      // Simulate component using hooks
      const [state, setState] = useStateSpy('initial-state');
      
      useEffectSpy(() => {
        // Effect logic
      }, [state]);
      
      const memoizedCallback = useCallbackSpy(() => {
        setState('updated-state');
      }, []);
      
      // Trigger callback
      memoizedCallback();
      
      // Assert hook interactions
      expect(useStateSpy).toHaveBeenCalledWith('initial-state');
      expect(useEffectSpy).toHaveBeenCalledWith(expect.any(Function), ['initial-state']);
      expect(useCallbackSpy).toHaveBeenCalledWith(expect.any(Function), []);
      expect(setState).toHaveBeenCalledWith('updated-state');
      
      // Verify hook call patterns
      SpyAssertions.hasCallPattern(useStateSpy, { times: 1 });
      SpyAssertions.hasCallPattern(useEffectSpy, { times: 1 });
    });
  });
});

// ===== CONVENIENCE API TESTS =====

describe('SpyUtils - Convenience APIs', () => {
  beforeEach(() => {
    spyRegistry.cleanupAll(true);
  });

  afterEach(() => {
    spyRegistry.cleanupAll(true);
  });

  describe('Shortcut APIs', () => {
    it('provides spy shortcut API', () => {
      const testSpy = spy.create('shortcutTest');
      
      expect(testSpy).toBeDefined();
      expect(spy.registry).toBe(spyRegistry);
      
      testSpy('test-call');
      
      spy.assertions.hasCallPattern(testSpy, {
        times: 1,
        with: ['test-call']
      });
    });

    it('provides factory shortcuts', () => {
      expect(factories.dom).toBe(DOMSpyFactory);
      expect(factories.async).toBe(AsyncSpyFactory);
      expect(factories.component).toBe(ComponentSpyFactory);
      
      const asyncSpy = factories.async.createAsyncSpy('shortcutAsync');
      expect(asyncSpy).toBeDefined();
    });

    it('provides test utility shortcuts', () => {
      expect(testUtils.setupSpies).toBe(SpyLifecycle.setupTest);
      expect(testUtils.cleanupSpies).toBe(SpyLifecycle.cleanupTest);
      expect(testUtils.resetSpies).toBe(SpyLifecycle.resetSpies);
      expect(testUtils.restoreSpies).toBe(SpyLifecycle.restoreSpies);
    });
  });
});

// ===== PERFORMANCE & EDGE CASES =====

describe('SpyUtils - Performance & Edge Cases', () => {
  beforeEach(() => {
    spyRegistry.cleanupAll(true);
  });

  afterEach(() => {
    spyRegistry.cleanupAll(true);
  });

  describe('Performance Considerations', () => {
    it('handles large numbers of spies efficiently', () => {
      const startTime = Date.now();
      const spies: EnhancedMock<any>[] = [];
      
      // Create 100 spies
      for (let i = 0; i < 100; i++) {
        spies.push(createSpy(`performanceSpy${i}`));
      }
      
      const creationTime = Date.now() - startTime;
      
      // Call each spy
      const callStartTime = Date.now();
      spies.forEach((spy, index) => {
        spy(`call-${index}`);
      });
      const callTime = Date.now() - callStartTime;
      
      // Clean up
      const cleanupStartTime = Date.now();
      spyRegistry.cleanupAll();
      const cleanupTime = Date.now() - cleanupStartTime;
      
      // Assert reasonable performance (these are generous limits)
      expect(creationTime).toBeLessThan(1000); // < 1 second for 100 spies
      expect(callTime).toBeLessThan(100); // < 100ms for 100 calls
      expect(cleanupTime).toBeLessThan(500); // < 500ms for cleanup
      
      console.log(`Performance metrics:
        Creation: ${creationTime}ms
        Calls: ${callTime}ms  
        Cleanup: ${cleanupTime}ms`);
    });
  });

  describe('Edge Cases', () => {
    it('handles spy on non-existent method gracefully', () => {
      const target = {} as any;
      
      // This should create the method and spy it
      const spy = createMethodSpy(target, 'nonExistent');
      
      expect(spy).toBeDefined();
      expect(target.nonExistent).toBe(spy);
      
      // Should be callable
      target.nonExistent('test');
      expect(spy).toHaveBeenCalledWith('test');
    });

    it('handles circular references in spy arguments', () => {
      const testSpy = createSpy('circularTest');
      const circular: any = { prop: 'value' };
      circular.self = circular;
      
      expect(() => {
        testSpy(circular);
      }).not.toThrow();
      
      expect(testSpy).toHaveBeenCalledWith(circular);
    });

    it('demonstrates spy registry tracking and cleanup', () => {
      const testSpy = createSpy('trackingDemo');
      const registryId = `trackingDemo-${testSpy.__spyMetadata?.createdAt}`;
      
      // Verify spy is tracked by the registry
      expect(spyRegistry.has(registryId)).toBe(true);
      
      const entry = spyRegistry.get(registryId);
      expect(entry).toBeDefined();
      expect(entry?.spy).toBe(testSpy);
      
      // Test that cleanup removes from registry
      const cleaned = spyRegistry.cleanup(registryId);
      expect(cleaned).toBe(true);
      expect(spyRegistry.has(registryId)).toBe(false);
      
      // Demonstrate that the spy itself continues to work
      testSpy('still-functional');
      expect(testSpy).toHaveBeenCalledWith('still-functional');
    });

    it('handles memory leak prevention with rapid spy creation', () => {
      // Rapidly create and age spies
      for (let i = 0; i < 50; i++) {
        const spy = createSpy(`rapid${i}`);
        if (spy.__spyMetadata) {
          spy.__spyMetadata.createdAt = Date.now() - (i * 10000); // Age them differently
        }
      }
      
      const initialCount = spyRegistry.getAll().size;
      expect(initialCount).toBe(50);
      
      // Auto cleanup should handle aged spies
      const cleanedCount = MemoryLeakPrevention.autoCleanup(30000); // 30 seconds
      
      expect(cleanedCount).toBeGreaterThan(0);
      expect(spyRegistry.getAll().size).toBeLessThan(initialCount);
    });
  });
});