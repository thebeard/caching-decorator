const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: '**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    env: {
      // list the files and file patterns to watch
      'cypress-watch-and-reload': {
        watch: ['src/*', 'tests/*']
      }
    },
    setupNodeEvents(on, config) {
      require('cypress-watch-and-reload/plugins')(on, config);

      return config;
    }
  }
});
