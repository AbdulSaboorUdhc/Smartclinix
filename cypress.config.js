const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "xkz6bc",
  e2e: {
    env: {
      MAILOSAUR_API_KEY: "vA6khN7Gvf64wPjpUDKgea9oOT7u3xYR",
      MAILSLURP_API_KEY: "8fe0ec19d5dfb71dd02c1aba08237c10b68588a9b777201213e28198872b7cb2",
      PASSWORD: 'Password1@',
    },  
    retries: {
      runMode: 1,
    },
    video: true,
    videoCompression: false,
    chromeWebSecurity: false,
    waitForAnimations: true,
    watchForFileChanges: false,
    testIsolation: false,
    // experimentalStudio: true,
    pageLoadTimeout: 60000,
    experimentalAsyncAwait: true,
    defaultCommandTimeout: 30000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    viewportWidth: 1366,
    viewportHeight: 768,
    excludeSpecPattern: [
      'cypress/e2e/05-Provider-ForgotPassword.spec.cy.js',
      'cypress/e2e/06-Patient-ForgotPassword.spec.cy.js',
    ],
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      charts: true,
      reportPageTitle: 'Smart Clinix Automation Test Report',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});
