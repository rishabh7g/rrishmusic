module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173'],
      startServerCommand: 'npm run preview',
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.5 }],
        'categories:accessibility': ['warn', { minScore: 0.7 }],
        'categories:best-practices': ['warn', { minScore: 0.6 }],
        'categories:seo': ['warn', { minScore: 0.7 }],
        'categories:pwa': ['warn', { minScore: 0.3 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};