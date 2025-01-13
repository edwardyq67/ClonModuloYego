const { Strategy, ExtractJwt } = require("passport-jwt");
const { getUserByUsername } = require("../models/userModel");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtStrategy = new Strategy(options, async (payload, done) => {
  try {
    const user = await getUserByUsername(payload.username);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

module.exports = jwtStrategy;
