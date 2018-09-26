'use strict'

const api = require('../api')
const co = require('co')
const log = require('kth-node-log')
const { safeGet } = require('safe-utils')

module.exports = {
  getIndex: co.wrap(getIndex)
}

function * getIndex (req, res, next) {
  try {
   
    const client = api.nodeApi.client
    const paths = api.nodeApi.paths
    const resp = yield client.getAsync(client.resolve(paths.getDataById.uri, { id: '123' }), { useCache: true })
    const koppsTestRes =  yield koppsTestClient.getAsync('course/SF1624')
   
   console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!test",koppsTestRes.body )
    res.render('sample/index', {
      debug: 'debug' in req.query,
      data: resp.statusCode === 200 ? safeGet(() => { return resp.body.name }) : '',
      koppstest: koppsTestRes.body,
      //error: resp.statusCode !== 200 ? safeGet(() => { return resp.body.message }) : ''
    })
  } catch (err) {
    log.error('Error in getIndex', { error: err })
    next(err)
  }
}


///TEST -- DELETE!
const config = require('../configuration').server
const BasicAPI = require('kth-node-api-call').BasicAPI

let koppsTestClient= new BasicAPI({
  hostname: config.kopps.host,
  basePath: config.kopps.basePath,
  https: false,//config.kopps.https,
  json: true,
  // Kopps is a public API and needs no API-key
  defaultTimeout: config.kopps.defaultTimeout
})

function koppsTestFunction(){
 // console.log("!!!!!!!!!!! koppsTestClient", koppsTestClient)
  koppsTestClient.getAsync('course/SF1624')
    .then((res) => { //console.log("!!!!!!!!!!! res", res)
      if (res.statusCode === 200) {
        console.log(res.body)
        return res.body
      }
      return undefined
    })
  }

