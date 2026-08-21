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
