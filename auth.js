const auth = require('basic-auth');
const config = require('config');
const admin = config.get('authentication');

module.exports = function (request, response, next) {
  var user = auth(request)
  if (!user || !admin.name || admin.password !== user.pass) {
    response.set('WWW-Authenticate', 'Basic realm="This is a private server. Authentication is required!"')
    return response.status(401).send()
  }
  return next()
}
