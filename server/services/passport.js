var passport =  require("passport"),
LocalStrategy = require("passport-local").Strategy,
JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
User = require("../db/models/user"),
config = require("../config/config")
var localOptions = {
  usernameField:"email",
  passwordField:"password"
}

var loginStrategy = new LocalStrategy(localOptions,(email,password, done)=>{

        //find user
        User.findOne({email:email}, (err, foundUser)=>{
          if(err)return done(err, null)
          if(!foundUser) return done(null, null)
            if(foundUser){

                    foundUser.comparePassword(password, function(error, isMatch){
                          //if(error) return done(error,null)
                          if(!isMatch) return done(null,{user:null, error})
                          if(isMatch) return done(null, {user:foundUser})
                    })
            }
        })

})


var tokenOptions = {
  secretOrKey :config.SECRET,
  jwtFromRequest : ExtractJwt.fromAuthHeader()
}

var tokenStrategy = new JwtStrategy(tokenOptions, (option, done)=>{
        User.findOne({_id:option.payload}, (err, foundUser)=>{

                if(err) return done(err, null)
                if(!foundUser)return done(new Error("UnAuthorized User"), null)
                return done(null, foundUser)
        })
})

passport.use(loginStrategy)
passport.use(tokenStrategy)
