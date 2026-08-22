const { auth } = require('express-oauth2-jwt-bearer');

const auth0Middleware = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  audience: process.env.AUTH0_AUDIENCE,
});

// Attaches req.userId from the verified Auth0 access token's `sub` claim.
function attachUserId(req, res, next) {
  req.userId = req.auth.payload.sub;
  next();
}

// DEV/TEST ONLY: bypasses real Auth0 verification when AUTH_BYPASS=true, so the API can be
// built and tested end-to-end before real Auth0 credentials exist. Must never be enabled in
// production — index.js/app.js refuses to start with AUTH_BYPASS=true when NODE_ENV=production.
function bypassAuth(req, res, next) {
  req.userId = process.env.AUTH_BYPASS_USER_ID || 'dev-user';
  next();
}

const requireAuth =
  process.env.AUTH_BYPASS === 'true' ? [bypassAuth] : [auth0Middleware, attachUserId];

module.exports = { requireAuth };
