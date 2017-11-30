'use strict'

const co = require('co')
const log = require('kth-node-log')
const InfernoServer = require('inferno-server')
const createElement = require('inferno-create-element')
const { RouterContext, match } = require('inferno-router')
let routeFactory = require('../../dist/js/server/app.js').default

module.exports = {
  getIndex: co.wrap(getIndex),
  getData
}

function * getIndex (req, res, next) {
  if (process.env['NODE_ENV'] === 'development') {
    delete require.cache[require.resolve('../../dist/js/server/app.js')]
    routeFactory = require('../../dist/js/server/app.js').default
  }
  try {
    const routes = routeFactory(req.originalUrl)
    const renderProps = match(routes, req.originalUrl)
    if (renderProps.redirect) return res.redirect(renderProps.redirect)

    // Load browserConfig and paths
    // renderProps.matched.props.searchStore.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)

    // Resolve all async before calls and render html
    const html = InfernoServer.renderToString(createElement(RouterContext, renderProps))
    res.render('sample/index', {
      html: html
    })
  } catch (err) {
    log.error('Error in getIndex', { error: err })
    next(err)
  }
}

function getData(req, res, next) {
  res.json({
    coolMountains: [
      {id: 0, name: 'Matterhorn', height: 4478},
      {id: 1, name: 'Everest', height: 8848},
      {id: 2, name: 'Dundret', height: 825},
      {id: 3, name: 'Ryfjället', height: 1413},
    ]
  })
}
