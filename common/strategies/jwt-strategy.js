const User = require('../../models/user') // Import UserModel

// Import Passport JWT
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const opt = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    issuer : 'api.cpd.com',
    audience : 'cpd.com',
    secretOrKey : process.env.JWT_SECRET
}

const jwtStrategy = new JwtStrategy(opt, async (jwt_payload, done)=>{
    const user = await User.findById(jwt_payload.id)
    if(!user){
        done(null, false)
    }
    done(null, user)
})

module.exports = jwtStrategy