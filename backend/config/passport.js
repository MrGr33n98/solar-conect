const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models'); // Adjust path as necessary
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); // Ensure JWT_SECRET is loaded

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

if (!opts.secretOrKey) {
  throw new Error('JWT_SECRET is not defined in your .env file');
}

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findByPk(jwt_payload.id);
      if (user) {
        return done(null, user); // User found, attach to req.user
      }
      return done(null, false); // User not found
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
