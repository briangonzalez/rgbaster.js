const { setup: setupDevServer } = require('jest-dev-server')

module.exports = async function globalSetup () {
  await setupDevServer({
    command: `static-server ./tests/images --debug`,
    launchTimeout: 50000,
    port: 9080
  })
}
