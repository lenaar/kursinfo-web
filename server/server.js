const server = require('kth-node-server')
const { safeGet } = require('safe-utils')
// Load .env file in development mode
const nodeEnv = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()
if (nodeEnv === 'development' || nodeEnv === 'dev' || !nodeEnv) {
  require('dotenv').config()
}
// Now read the server config etc.
const config = require('./init/configuration').server
const paths = require('./init/routing/paths')

// What is this used for?
server.locals.secret = new Map()

server.start({
  useSsl: config.useSsl,
  pfx: config.ssl.pfx,
  passphrase: config.ssl.passphrase,
  key: config.ssl.key,
  ca: config.ssl.ca,
  cert: config.ssl.cert,
  port: config.port,
  logger: log
})

module.exports = server

/* **************************
 * ******* TEMPLATING *******
 * **************************
 */
const path = require('path')
server.set('views', path.join(__dirname, '/views'))
server.set('layouts', path.join(__dirname, '/views/layouts'))
server.set('partials', path.join(__dirname, '/views/partials'))
server.engine('handlebars', exphbs({
  defaultLayout: 'publicLayout',
  layoutsDir: server.settings.layouts,
  partialsDir: server.settings.partials,
}))
server.set('view engine', 'handlebars')
// Register handlebar helpers
require('./views/helpers')

/* ***********************
 * ******* LOGGING *******
 * ***********************
 */
const log = require('kth-node-log')
const packageFile = require('../package.json')

let logConfiguration = {
  name: packageFile.name,
  app: packageFile.name,
  env: process.env.NODE_ENV,
  level: config.logging.log.level,
  console: config.logging.console,
  stdout: config.logging.stdout,
  src: config.logging.src
}
log.init(logConfiguration)

/* ******************************
 * ******* ACCESS LOGGING *******
 * ******************************
 */
const accessLog = require('kth-node-access-log')
server.use(accessLog(config.logging.accessLog))

/* ****************************
 * ******* STATIC FILES *******
 * ****************************
 */
const browserConfig = require('./init/configuration').browser
const browserConfigHandler = require('kth-node-configuration').getHandler(browserConfig, paths)
const express = require('express')

// helper
function setCustomCacheControl (res, path) {
  if (express.static.mime.lookup(path) === 'text/html') {
    // Custom Cache-Control for HTML files
    res.setHeader('Cache-Control', 'no-cache')
  }
}

// Files/statics routes--
// Map components HTML files as static content, but set custom cache control header, currently no-cache to force If-modified-since/Etag check.
server.use(config.proxyPrefixPath.uri + '/static/js/components', express.static('./dist/js/components', { setHeaders: setCustomCacheControl }))
// Expose browser configurations
server.use(config.proxyPrefixPath.uri + '/static/browserConfig', browserConfigHandler)
// Map static content like images, css and js.
server.use(config.proxyPrefixPath.uri + '/static', express.static('./dist'))
// Return 404 if static file isn't found so we don't go through the rest of the pipeline
server.use(config.proxyPrefixPath.uri + '/static', function (req, res, next) {
  var error = new Error('File not found: ' + req.originalUrl)
  error.statusCode = 404
  next(error)
})

// QUESTION: Should this really be set here?
// http://expressjs.com/en/api.html#app.set
server.set('case sensitive routing', true)

/* ******************************
 * ******* AUTHENTICATION *******
 * ******************************
 */
const passport = require('passport')
const { loginHandler, gatewayHandler, logoutHandler, pgtCallbackHandler, serverLogin, serverGatewayLogin } = require('kth-node-passport-cas').routeHandlers({
  casLoginUri: paths.cas.login.uri,
  casGatewayUri: paths.cas.gateway.uri,
  ldapConfig: config.ldap,
  server: server
})
require('./init/authentication')
server.use(passport.initialize())
server.use(passport.session())
server.use(paths.cas.login.uri, loginHandler)
server.get(paths.cas.gateway.uri, gatewayHandler)
server.get(paths.cas.logout.uri, logoutHandler)
// setup handler for pgtCallback if paths.cas.pgtCallback is specified
safeGet(() => paths.cas.pgtCallback.uri) && server.get(paths.cas.pgtCallback.uri, pgtCallbackHandler)
server.login = serverLogin
server.gatewayLogin = serverGatewayLogin

// TODO: Figure out what server.login and server.gatewayLogin are used for
// TODO: Move server.login and server.gatewayLogin to kth-node-passport-cas
// TODO: Move handlers to kth-node-passport-cas




/* ******************************
 * ******* CORTINA BLOCKS *******
 * ******************************
 */
server.use(config.proxyPrefixPath.uri, require('kth-node-web-common/lib/web/cortina')({
  blockUrl: config.blockApi.blockUrl,
  proxyPrefixPath: config.proxyPrefixPath.uri,
  hostUrl: config.hostUrl,
  redisConfig: config.cache.cortinaBlock.redis
}))

/* ********************************
 * ******* CRAWLER REDIRECT *******
 * ********************************
 */
const excludePath = proxyPrefixPath + '(?!/static).*'
const excludeExpression = new RegExp(excludePath)
server.use(excludeExpression, require('kth-node-web-common/lib/web/crawlerRedirect')({
  hostUrl: config.hostUrl,
}))

/* ************************
 * ******* LANGUAGE *******
 * ************************
 */
const { languageHandler } = require('kth-node-web-common/lib/language')
server.use(config.proxyPrefixPath.uri, languageHandler)
