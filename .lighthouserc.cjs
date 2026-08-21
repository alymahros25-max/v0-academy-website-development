module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/saudi-arabia',
        'http://localhost:3000/united-arab-emirates',
        'http://localhost:3000/united-states',
      ],
      numberOfRuns: 1,
      startServerCommand: 'pnpm start',
      startServerReadyPattern: 'Ready in|started server on|Ready on',
      startServerReadyTimeout: 120000,
      settings: {
        chromeFlags: '--headless=new --no-sandbox --disable-dev-shm-usage --disable-gpu --disable-software-rasterizer',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0 }],
        'metrics:cls': ['error', { maxNumericValue: 0.1 }],
        'metrics:total-blocking-time': ['error', { maxNumericValue: 300 }],
      },
    },
  },
}
