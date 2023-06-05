const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000"
  },
  env: {
    BACKEND: "http://localhost:3001/api"
  }
});
