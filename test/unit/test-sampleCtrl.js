/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

process.env['LDAP_URI'] = 'ldaps://mockuser@mockdomain.com@mockldapdomain.com'
process.env['LDAP_PASSWORD'] = 'mockldappassword'
const expect = require('chai').expect
const mockery = require('mockery')
const httpMocks = require('node-mocks-http')

const mockLogger = {}
mockLogger.debug = mockLogger.info = mockLogger.error = mockLogger.warn = console.log
mockLogger.init = () => {}

mockery.registerMock('kth-node-log', mockLogger)
mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
})

describe('Index page', function () {
  it('should get the index page', done => {
    const ctrl = require('../../server/controllers/sampleCtrl')
    const { req, res } = httpMocks.createMocks()
    res.render = function (view, data) {
      console.log(data)
      expect(data).to.be.not.undefined
      done()
    }
    ctrl.getIndex(req, res, console.log)
  })
})
