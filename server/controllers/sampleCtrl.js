'use strict'

const api = require('../api')
const co = require('co')
const log = require('kth-node-log')
const { safeGet } = require('safe-utils')

module.exports = {
  getIndex: co.wrap(getIndex),
  postCourseCode: _postCourseCode
}

function * getIndex (req, res, next) {
  try {
   
    const client = api.nodeApi.client
    const paths = api.nodeApi.paths
    const courseId = req.body.course_code && req.body.course_code.length > 0 ? req.body.course_code : "SF1624"
    const resp = yield client.getAsync(client.resolve(paths.getDataById.uri, { id: '123' }), { useCache: true })
    const koppsTestRes =  yield koppsTestClient.getAsync('course/' + courseId)
    //const koppsTestRes_plan =  yield koppsTestClient2.getAsync('course/HS1735/plan')
   
   console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!test",koppsTestClient)
   
    res.render('sample/index', {
      debug: 'debug' in req.query,
      data: resp.statusCode === 200 ? safeGet(() => { return resp.body.name }) : '',
      koppstest: koppsTestRes.body,
      error: resp.statusCode !== 200 ? safeGet(() => { return resp.body.message }) : ''
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

let koppsTestClient2= new BasicAPI({
  hostname: config.kopps.host,
  basePath: '/api/kopps/v2/',
  https: false,//config.kopps.https,
  json: true,
  // Kopps is a public API and needs no API-key
  defaultTimeout: config.kopps.defaultTimeout
})

function _postCourseCode (req, res, next) {
  //console.log("!!**!! res", req.body)
  return co(getIndex(req, res, next))
}



