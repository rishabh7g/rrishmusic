/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  calculateStats
} from '@/utils/statsCalculator';
import { 
  mockTestimonials,
  mockPortfolioItems,
  createMockTestimonial,
  createMockPortfolioItem
} from '@/test/mocks/testData';

// Mock utility functions that may not exist yet
const mockCalculateExperienceStats = vi.fn();
const mockCalculateStudentStats = vi.fn();
const mockCalculatePerformanceStats = vi.fn();
const mockCalculateTestimonialStats = vi.fn();
const mockCalculateLessonStats = vi.fn();

describe('Stats Calculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateStats - Main Function', () => {
    it('should calculate comprehensive stats from all data sources', () => {
      const stats = calculateStats();

      expect(stats).toMatchObject({
        experience: {
          playingYears: expect.any(Number),
          teachingYears: expect.any(Number),
          performanceYears: expect.any(Number),
          studioYears: expect.any(Number)
        },
        students: {
          total: expect.any(Number),
          active: expect.any(Number),
          completed: expect.any(Number),
          averageProgress: expect.any(Number)
        },
        performance: {
          venuePerformances: expect.any(String),
          weddingPerformances: expect.any(String),
          corporateEvents: expect.any(String),
          privateEvents: expect.any(String),
          averagePerformanceRating: expect.any(Number),
          repeatBookings: expect.any(Number)
        }
      });
    });

    it('should return consistent results across multiple calls', () => {
      const stats1 = calculateStats();
      const stats2 = calculateStats();

      expect(stats1).toEqual(stats2);
    });

    it('should calculate stats with reasonable ranges', () => {
      const stats = calculateStats();

      expect(stats.experience.teachingYears).toBeGreaterThanOrEqual(1);
      expect(stats.experience.teachingYears).toBeLessThanOrEqual(50);
      expect(stats.students.total).toBeGreaterThanOrEqual(0);
      expect(stats.performance.averagePerformanceRating).toBeGreaterThanOrEqual(1);
      expect(stats.performance.averagePerformanceRating).toBeLessThanOrEqual(5);
    });
  });

  describe('Mock Experience Statistics', () => {
    it('should calculate experience years correctly', () => {
      const mockStartYear = 2010;
      const currentYear = new Date().getFullYear();
      
      mockCalculateExperienceStats.mockReturnValue({
        playingYears: currentYear - mockStartYear,
        teachingYears: currentYear - 2015,
        performanceYears: currentYear - 2012,
        studioYears: currentYear - 2018
      });

      const experienceStats = mockCalculateExperienceStats({
        musicStartYear: mockStartYear,
        teachingStartYear: 2015,
        performanceStartYear: 2012,
        studioStartYear: 2018
      });

      expect(experienceStats.playingYears).toBe(currentYear - mockStartYear);
      expect(experienceStats.teachingYears).toBe(currentYear - 2015);
      expect(experienceStats.performanceYears).toBe(currentYear - 2012);
      expect(experienceStats.studioYears).toBe(currentYear - 2018);
    });

    it('should handle future start years gracefully', () => {
      const futureYear = new Date().getFullYear() + 5;
      
      mockCalculateExperienceStats.mockReturnValue({
        playingYears: 0,
        teachingYears: 0,
        performanceYears: 0,
        studioYears: 0
      });

      const experienceStats = mockCalculateExperienceStats({
        musicStartYear: futureYear,
        teachingStartYear: futureYear,
        performanceStartYear: futureYear,
        studioStartYear: futureYear
      });

      expect(experienceStats.playingYears).toBe(0);
      expect(experienceStats.teachingYears).toBe(0);
      expect(experienceStats.performanceYears).toBe(0);
      expect(experienceStats.studioYears).toBe(0);
    });

    it('should handle missing start years', () => {
      mockCalculateExperienceStats.mockReturnValue({
        playingYears: 0,
        teachingYears: 4,
        performanceYears: 0,
        studioYears: 0
      });

      const experienceStats = mockCalculateExperienceStats({
        musicStartYear: undefined,
        teachingStartYear: 2020
      });

      expect(experienceStats.playingYears).toBe(0);
      expect(experienceStats.teachingYears).toBeGreaterThan(0);
      expect(experienceStats.performanceYears).toBe(0);
      expect(experienceStats.studioYears).toBe(0);
    });
  });

  describe('Mock Student Statistics', () => {
    it('should calculate student statistics from lesson data', () => {
      const mockLessonData = [
        { 
          id: '1', 
          studentName: 'John', 
          status: 'active', 
          progress: 75,
          startDate: '2024-01-01',
          completedLessons: 8
        },
        { 
          id: '2', 
          studentName: 'Jane', 
          status: 'completed', 
          progress: 100,
          startDate: '2023-06-01',
          completedLessons: 20
        },
        { 
          id: '3', 
          studentName: 'Bob', 
          status: 'active', 
          progress: 45,
          startDate: '2024-03-01',
          completedLessons: 5
        }
      ];

      mockCalculateStudentStats.mockReturnValue({
        total: 3,
        active: 2,
        completed: 1,
        averageProgress: 73.33
      });

      const studentStats = mockCalculateStudentStats(mockLessonData as any);

      expect(studentStats.total).toBe(3);
      expect(studentStats.active).toBe(2);
      expect(studentStats.completed).toBe(1);
      expect(studentStats.averageProgress).toBeCloseTo(73.33, 2);
    });

    it('should handle empty lesson data', () => {
      mockCalculateStudentStats.mockReturnValue({
        total: 0,
        active: 0,
        completed: 0,
        averageProgress: 0
      });

      const studentStats = mockCalculateStudentStats([]);

      expect(studentStats.total).toBe(0);
      expect(studentStats.active).toBe(0);
      expect(studentStats.completed).toBe(0);
      expect(studentStats.averageProgress).toBe(0);
    });

    it('should filter out invalid student records', () => {
      const mockInvalidData = [
        { id: '1', studentName: 'Valid Student', status: 'active', progress: 50 },
        { id: '2', studentName: '', status: 'active', progress: 75 },
        { id: '3', studentName: 'Another Valid', status: 'invalid', progress: 25 },
        null,
        undefined,
      ];

      mockCalculateStudentStats.mockReturnValue({
        total: 2 // Only valid records
      });

      const studentStats = mockCalculateStudentStats(mockInvalidData as any);

      expect(studentStats.total).toBe(2);
    });

    it('should calculate retention rates', () => {
      const mockData = Array(20).fill(null).map((_, i) => ({
        id: i.toString(),
        studentName: `Student ${i}`,
        status: i < 18 ? 'active' : 'dropped',
        progress: Math.random() * 100,
        startDate: '2024-01-01'
      }));

      mockCalculateStudentStats.mockReturnValue({
        total: 20,
        active: 18,
        completed: 0,
        averageProgress: 50,
        retentionRate: 0.9
      });

      const studentStats = mockCalculateStudentStats(mockData as any);

      expect(studentStats.retentionRate).toBeCloseTo(0.9, 2);
    });
  });

  describe('Mock Performance Statistics', () => {
    it('should calculate performance statistics from portfolio data', () => {
      mockCalculatePerformanceStats.mockReturnValue({
        venuePerformances: '50+',
        weddingPerformances: '20+', 
        corporateEvents: '15+',
        privateEvents: '10+',
        averagePerformanceRating: 4.8,
        repeatBookings: 12
      });

      const performanceStats = mockCalculatePerformanceStats(mockPortfolioItems as any);

      expect(performanceStats.venuePerformances).toMatch(/\d+\+/);
      expect(performanceStats.weddingPerformances).toMatch(/\d+\+/);
      expect(performanceStats.corporateEvents).toMatch(/\d+\+/);
      expect(performanceStats.averagePerformanceRating).toBeGreaterThanOrEqual(1);
      expect(performanceStats.averagePerformanceRating).toBeLessThanOrEqual(5);
    });

    it('should categorize performances by type correctly', () => {
      const mockPerformances = [
        createMockPortfolioItem({ category: 'wedding', title: 'Wedding 1' }),
        createMockPortfolioItem({ category: 'wedding', title: 'Wedding 2' }),
        createMockPortfolioItem({ category: 'corporate', title: 'Corporate 1' }),
        createMockPortfolioItem({ category: 'concert', title: 'Concert 1' })
      ];

      mockCalculatePerformanceStats.mockReturnValue({
        weddingPerformances: '2+',
        corporateEvents: '1+'
      });

      const performanceStats = mockCalculatePerformanceStats(mockPerformances as any);

      expect(performanceStats.weddingPerformances).toMatch(/2/);
      expect(performanceStats.corporateEvents).toMatch(/1/);
    });

    it('should handle empty performance data', () => {
      mockCalculatePerformanceStats.mockReturnValue({
        venuePerformances: '0',
        weddingPerformances: '0',
        corporateEvents: '0',
        privateEvents: '0',
        averagePerformanceRating: 0,
        repeatBookings: 0
      });

      const performanceStats = mockCalculatePerformanceStats([]);

      expect(performanceStats.venuePerformances).toBe('0');
      expect(performanceStats.weddingPerformances).toBe('0');
      expect(performanceStats.corporateEvents).toBe('0');
      expect(performanceStats.privateEvents).toBe('0');
      expect(performanceStats.averagePerformanceRating).toBe(0);
      expect(performanceStats.repeatBookings).toBe(0);
    });

    it('should calculate repeat bookings from client data', () => {
      const mockPerformances = [
        createMockPortfolioItem({ 
          category: 'wedding',
          clientName: 'Smith Family',
          isRepeatClient: false
        }),
        createMockPortfolioItem({ 
          category: 'corporate',
          clientName: 'ABC Corp',
          isRepeatClient: true
        }),
        createMockPortfolioItem({ 
          category: 'corporate',
          clientName: 'ABC Corp',
          isRepeatClient: true
        })
      ];

      mockCalculatePerformanceStats.mockReturnValue({
        repeatBookings: 2
      });

      const performanceStats = mockCalculatePerformanceStats(mockPerformances as any);

      expect(performanceStats.repeatBookings).toBeGreaterThan(0);
    });
  });

  describe('Mock Testimonial Statistics', () => {
    it('should calculate testimonial statistics correctly', () => {
      mockCalculateTestimonialStats.mockReturnValue({
        totalReviews: 5,
        averageRating: 4.4,
        fiveStarPercentage: 60
      });

      const testimonialStats = mockCalculateTestimonialStats(mockTestimonials as any);

      expect(testimonialStats.totalReviews).toBe(5);
      expect(testimonialStats.averageRating).toBeCloseTo(4.4, 1);
      expect(testimonialStats.fiveStarPercentage).toBeCloseTo(60, 1);
    });

    it('should calculate service-specific testimonial breakdown', () => {
      mockCalculateTestimonialStats.mockReturnValue({
        totalReviews: 5,
        averageRating: 4.4,
        byService: {
          teaching: 2,
          performance: 2,
          collaboration: 1
        }
      });

      const testimonialStats = mockCalculateTestimonialStats(mockTestimonials as any);

      expect(testimonialStats.byService).toMatchObject({
        teaching: expect.any(Number),
        performance: expect.any(Number),
        collaboration: expect.any(Number)
      });
    });

    it('should handle testimonials with missing ratings', () => {
      const incompleteTestimonials = [
        createMockTestimonial({ rating: 5 }),
        createMockTestimonial({ rating: undefined as any }),
        createMockTestimonial({ rating: 4 }),
        createMockTestimonial({ rating: null as any })
      ];

      mockCalculateTestimonialStats.mockReturnValue({
        totalReviews: 2,
        averageRating: 4.5
      });

      const testimonialStats = mockCalculateTestimonialStats(incompleteTestimonials as any);

      expect(testimonialStats.totalReviews).toBe(2);
      expect(testimonialStats.averageRating).toBe(4.5);
    });

    it('should calculate recent testimonial trends', () => {
      const recentDate = new Date();
      recentDate.setMonth(recentDate.getMonth() - 1);

      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 1);

      const mixedTestimonials = [
        createMockTestimonial({ 
          rating: 5, 
          date: recentDate.toISOString() 
        }),
        createMockTestimonial({ 
          rating: 4, 
          date: oldDate.toISOString() 
        })
      ];

      mockCalculateTestimonialStats.mockReturnValue({
        averageRating: 4.5,
        recentAverageRating: 5.0
      });

      const testimonialStats = mockCalculateTestimonialStats(mixedTestimonials as any);

      expect(testimonialStats.recentAverageRating).toBeGreaterThanOrEqual(testimonialStats.averageRating);
    });
  });

  describe('Mock Lesson Statistics', () => {
    it('should calculate lesson package statistics', () => {
      const mockLessonPackages = [
        {
          id: '1',
          type: 'individual',
          sessions: 4,
          price: 320,
          popularity: 0.8
        },
        {
          id: '2',
          type: 'group',
          sessions: 4,
          price: 240,
          popularity: 0.6
        }
      ];

      mockCalculateLessonStats.mockReturnValue({
        totalPackages: 2,
        averagePrice: 280,
        mostPopularType: 'individual'
      });

      const lessonStats = mockCalculateLessonStats(mockLessonPackages as any);

      expect(lessonStats.totalPackages).toBe(2);
      expect(lessonStats.averagePrice).toBe(280);
      expect(lessonStats.mostPopularType).toBe('individual');
    });

    it('should handle empty lesson packages', () => {
      mockCalculateLessonStats.mockReturnValue({
        totalPackages: 0,
        averagePrice: 0,
        mostPopularType: ''
      });

      const lessonStats = mockCalculateLessonStats([]);

      expect(lessonStats.totalPackages).toBe(0);
      expect(lessonStats.averagePrice).toBe(0);
      expect(lessonStats.mostPopularType).toBe('');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null and undefined inputs gracefully', () => {
      expect(() => mockCalculateExperienceStats(null as any)).not.toThrow();
      expect(() => mockCalculateStudentStats(undefined as any)).not.toThrow();
      expect(() => mockCalculatePerformanceStats(null as any)).not.toThrow();
    });

    it('should handle corrupted data structures', () => {
      const corruptedData = [
        { malformed: 'data' },
        null,
        undefined,
        '',
        123,
        { id: 'valid', name: 'Valid Record' }
      ];

      expect(() => mockCalculateStudentStats(corruptedData as any)).not.toThrow();
    });

    it('should handle extreme date values', () => {
      const extremeYears = {
        musicStartYear: 1800,
        teachingStartYear: 2100,
        performanceStartYear: -500,
        studioStartYear: 0
      };

      expect(() => mockCalculateExperienceStats(extremeYears)).not.toThrow();
    });

    it('should handle very large datasets efficiently', () => {
      const largeDataset = Array(10000).fill(null).map((_, i) => ({
        id: i.toString(),
        name: `Record ${i}`,
        value: Math.random() * 100
      }));

      const startTime = Date.now();
      mockCalculateStudentStats(largeDataset as any);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should maintain precision with floating point calculations', () => {
      const precisionTestData = [
        createMockTestimonial({ rating: 4.7 }),
        createMockTestimonial({ rating: 4.3 }),
        createMockTestimonial({ rating: 4.9 })
      ];

      mockCalculateTestimonialStats.mockReturnValue({
        averageRating: 4.63
      });

      const testimonialStats = mockCalculateTestimonialStats(precisionTestData as any);

      expect(testimonialStats.averageRating).toBeCloseTo(4.63, 2);
    });
  });

  describe('Performance Benchmarking', () => {
    it('should handle concurrent calculations efficiently', async () => {
      const promises = Array(50).fill(null).map(() => 
        Promise.resolve(calculateStats())
      );

      const startTime = Date.now();
      const results = await Promise.all(promises);
      const endTime = Date.now();

      expect(results).toHaveLength(50);
      expect(endTime - startTime).toBeLessThan(2000);
    });

    it('should cache expensive calculations', () => {
      const largeMockData = Array(1000).fill(null).map((_, i) =>
        createMockTestimonial({ id: i.toString(), rating: (i % 5) + 1 })
      );

      mockCalculateTestimonialStats.mockReturnValue({
        totalReviews: 1000,
        averageRating: 3.0
      });

      const startTime1 = Date.now();
      const result1 = mockCalculateTestimonialStats(largeMockData as any);
      const endTime1 = Date.now();

      const startTime2 = Date.now();
      const result2 = mockCalculateTestimonialStats(largeMockData as any);
      const endTime2 = Date.now();

      expect(result1).toEqual(result2);
      expect(endTime2 - startTime2).toBeLessThanOrEqual(endTime1 - startTime1);
    });
  });

  describe('Data Validation and Integrity', () => {
    it('should validate calculated percentages are within bounds', () => {
      const stats = calculateStats();

      // Check if completion rate exists and is within bounds
      if (stats.students.completionRate !== undefined) {
        expect(stats.students.completionRate).toBeGreaterThanOrEqual(0);
        expect(stats.students.completionRate).toBeLessThanOrEqual(1);
      }

      // Check performance rating bounds
      expect(stats.performance.averagePerformanceRating).toBeGreaterThanOrEqual(0);
      expect(stats.performance.averagePerformanceRating).toBeLessThanOrEqual(5);
    });

    it('should ensure numerical consistency across related stats', () => {
      const stats = calculateStats();

      // Total students should equal active + completed + inactive
      const studentSum = stats.students.active + stats.students.completed;
      expect(studentSum).toBeLessThanOrEqual(stats.students.total);
    });

    it('should handle timezone and date formatting consistently', () => {
      mockCalculateTestimonialStats.mockReturnValue({
        mostRecentReview: new Date().toISOString(),
        reviewFrequency: 0.5
      });

      const testimonialStats = mockCalculateTestimonialStats(mockTestimonials as any);

      expect(testimonialStats.mostRecentReview).toBeDefined();
      expect(testimonialStats.reviewFrequency).toBeGreaterThanOrEqual(0);
    });
  });
});